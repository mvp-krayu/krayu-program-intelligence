#!/usr/bin/env python3
"""
Blue Edge — Sensor Data Collector Agent v1.0
Runs on SVG 2.0 Yocto Linux.
Reads external sensors via CAN FD, J1939, Modbus RTU, GPIO, I2C, BLE
and pushes batched telemetry to Blue Edge cloud.

Deployment: /opt/blueedge/sensor-collector/sensor_collector.py
Systemd:    /etc/systemd/system/blueedge-sensor-collector.service
Config:     /opt/blueedge/config/sensors.yaml
"""

import os
import sys
import json
import time
import struct
import logging
import signal
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple
from collections import deque

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("sensor-collector")

# ── Default Configuration ───────────────────────────────────────
DEFAULT_CONFIG = {
    "device_hardware_id": os.environ.get("BLUEEDGE_DEVICE_ID", "SVG-UNKNOWN-XX"),
    "vehicle_id": os.environ.get("BLUEEDGE_VEHICLE_ID", ""),

    # Cloud connection
    "cloud_api_url": os.environ.get("BLUEEDGE_API_URL", "https://api.blueedge.network/api/v1"),
    "cloud_api_key": os.environ.get("BLUEEDGE_API_KEY", ""),
    "mqtt_enabled": os.environ.get("BLUEEDGE_MQTT_ENABLED", "true").lower() == "true",
    "mqtt_broker": os.environ.get("BLUEEDGE_MQTT_BROKER", "mqtt.blueedge.network"),
    "mqtt_port": int(os.environ.get("BLUEEDGE_MQTT_PORT", "8883")),
    "mqtt_topic_prefix": os.environ.get("BLUEEDGE_MQTT_TOPIC", "blueedge/sensors"),

    # Batch settings
    "batch_size": int(os.environ.get("BLUEEDGE_SENSOR_BATCH", "50")),
    "flush_interval_sec": int(os.environ.get("BLUEEDGE_SENSOR_FLUSH", "5")),
    "max_buffer_size": 10000,

    # GPS (from SVG main telemetry)
    "gps_shm_path": "/dev/shm/blueedge_gps",

    "log_file": "/var/log/blueedge/sensor-collector.log",
    "log_level": os.environ.get("BLUEEDGE_LOG_LEVEL", "INFO"),

    # Sensor definitions loaded from sensors.yaml
    "sensors": [],
}

# ── Sensor Protocol Readers ─────────────────────────────────────

class CANReader:
    """Read sensors from CAN FD / J1939 bus via SocketCAN."""

    def __init__(self, interface: str = "can0"):
        self.interface = interface
        self.sock = None

    def connect(self):
        try:
            import socket as sock_mod
            self.sock = sock_mod.socket(sock_mod.PF_CAN, sock_mod.SOCK_RAW, sock_mod.CAN_RAW)
            self.sock.bind((self.interface,))
            self.sock.settimeout(0.1)
            logger.info(f"CAN connected on {self.interface}")
        except Exception as e:
            logger.error(f"CAN connect failed on {self.interface}: {e}")
            self.sock = None

    def read_frame(self) -> Optional[Tuple[int, bytes]]:
        """Read a single CAN frame. Returns (arbitration_id, data) or None."""
        if not self.sock:
            return None
        try:
            frame = self.sock.recv(72)  # CAN FD max
            arb_id = struct.unpack_from("<I", frame, 0)[0] & 0x1FFFFFFF
            dlc = frame[4]
            data = frame[8 : 8 + dlc]
            return (arb_id, data)
        except (BlockingIOError, TimeoutError):
            return None
        except Exception as e:
            logger.debug(f"CAN read error: {e}")
            return None

    def close(self):
        if self.sock:
            self.sock.close()


class ModbusReader:
    """Read sensors via Modbus RTU over serial."""

    def __init__(self, port: str = "/dev/ttyS1", baudrate: int = 9600):
        self.port = port
        self.baudrate = baudrate
        self.client = None

    def connect(self):
        try:
            from pymodbus.client import ModbusSerialClient
            self.client = ModbusSerialClient(
                port=self.port, baudrate=self.baudrate,
                parity="N", stopbits=1, bytesize=8, timeout=1,
            )
            if self.client.connect():
                logger.info(f"Modbus connected on {self.port} @ {self.baudrate}")
            else:
                logger.error(f"Modbus connection failed on {self.port}")
                self.client = None
        except ImportError:
            logger.warning("pymodbus not installed, Modbus sensors unavailable")
            self.client = None

    def read_register(self, address: int, register: int, count: int = 1) -> Optional[float]:
        """Read holding register(s) from Modbus device."""
        if not self.client:
            return None
        try:
            result = self.client.read_holding_registers(register, count, slave=address)
            if result and not result.isError():
                if count == 1:
                    return float(result.registers[0])
                elif count == 2:
                    # 32-bit float from 2 registers
                    raw = struct.pack(">HH", result.registers[0], result.registers[1])
                    return struct.unpack(">f", raw)[0]
            return None
        except Exception as e:
            logger.debug(f"Modbus read error (addr={address}, reg={register}): {e}")
            return None

    def close(self):
        if self.client:
            self.client.close()


class GPIOReader:
    """Read sensors from GPIO / analog ADC via sysfs or IIO."""

    @staticmethod
    def read_gpio(pin: int) -> Optional[int]:
        """Read digital GPIO value (0 or 1)."""
        try:
            with open(f"/sys/class/gpio/gpio{pin}/value") as f:
                return int(f.read().strip())
        except Exception:
            return None

    @staticmethod
    def read_adc(channel: int, device: int = 0) -> Optional[float]:
        """Read analog value from IIO ADC."""
        try:
            path = f"/sys/bus/iio/devices/iio:device{device}/in_voltage{channel}_raw"
            with open(path) as f:
                raw = int(f.read().strip())
            # Read scale if available
            scale_path = f"/sys/bus/iio/devices/iio:device{device}/in_voltage_scale"
            scale = 1.0
            if Path(scale_path).exists():
                with open(scale_path) as f:
                    scale = float(f.read().strip())
            return raw * scale / 1000.0  # Convert to volts
        except Exception:
            return None


# ── Sensor Value Parser ─────────────────────────────────────────

def parse_can_value(data: bytes, config: Dict) -> Optional[float]:
    """Extract sensor value from CAN frame payload using config-defined format."""
    fmt = config.get("parse_format", "uint16_be")
    offset = config.get("parse_offset", 0)
    scale = config.get("parse_scale", 1.0)
    bias = config.get("parse_bias", 0.0)

    try:
        if fmt == "uint8":
            raw = data[offset]
        elif fmt == "uint16_be":
            raw = struct.unpack_from(">H", data, offset)[0]
        elif fmt == "uint16_le":
            raw = struct.unpack_from("<H", data, offset)[0]
        elif fmt == "int16_be":
            raw = struct.unpack_from(">h", data, offset)[0]
        elif fmt == "float32_be":
            raw = struct.unpack_from(">f", data, offset)[0]
        elif fmt == "j1939_spn":
            # J1939 Suspect Parameter Number extraction
            raw = struct.unpack_from("<H", data, offset)[0]
        else:
            raw = data[offset]
        return (raw * scale) + bias
    except (struct.error, IndexError):
        return None


def apply_calibration(value: float, calibration: Dict) -> float:
    """Apply calibration offset and factor."""
    offset = calibration.get("offset", 0.0)
    factor = calibration.get("factor", 1.0)
    return (value * factor) + offset


# ── Reading Buffer & Cloud Push ─────────────────────────────────

class SensorCollector:
    """Main collector: reads sensors, buffers, pushes to cloud."""

    def __init__(self, config: Dict):
        self.config = config
        self.device_id = config["device_hardware_id"]
        self.running = True
        self.buffer: deque = deque(maxlen=config["max_buffer_size"])
        self.last_flush = time.time()

        # Protocol readers
        self.can_readers: Dict[str, CANReader] = {}
        self.modbus_readers: Dict[str, ModbusReader] = {}
        self.mqtt_client = None

        # CAN ID → sensor config lookup
        self.can_sensor_map: Dict[int, Dict] = {}

    def _init_readers(self):
        """Initialize protocol readers based on sensor configs."""
        for sensor in self.config["sensors"]:
            proto = sensor.get("protocol", "")

            if proto in ("can_fd", "j1939"):
                iface = sensor.get("can_interface", "can0")
                if iface not in self.can_readers:
                    reader = CANReader(iface)
                    reader.connect()
                    self.can_readers[iface] = reader
                can_id = int(sensor.get("can_id", "0"), 16) if isinstance(sensor.get("can_id"), str) else sensor.get("can_id", 0)
                self.can_sensor_map[can_id] = sensor

            elif proto in ("modbus_rtu", "modbus_tcp"):
                port = sensor.get("serial_port", "/dev/ttyS1")
                if port not in self.modbus_readers:
                    reader = ModbusReader(port, sensor.get("baudrate", 9600))
                    reader.connect()
                    self.modbus_readers[port] = reader

        logger.info(f"Initialized {len(self.can_readers)} CAN + {len(self.modbus_readers)} Modbus readers for {len(self.config['sensors'])} sensors")

    def _connect_mqtt(self):
        if not self.config["mqtt_enabled"]:
            return
        try:
            import paho.mqtt.client as mqtt
            self.mqtt_client = mqtt.Client(client_id=f"sensor-{self.device_id}", protocol=mqtt.MQTTv5)
            self.mqtt_client.connect(self.config["mqtt_broker"], self.config["mqtt_port"])
            self.mqtt_client.loop_start()
        except Exception as e:
            logger.error(f"MQTT connect failed: {e}")
            self.mqtt_client = None

    def _read_gps(self) -> Tuple[Optional[float], Optional[float], Optional[float]]:
        """Read GPS from shared memory (set by SVG main telemetry daemon)."""
        try:
            with open(self.config["gps_shm_path"]) as f:
                data = json.load(f)
            return data.get("lat"), data.get("lon"), data.get("speed_kmh")
        except Exception:
            return None, None, None

    def _poll_sensors(self):
        """One polling cycle: read all configured sensors."""
        now = datetime.now(timezone.utc)
        lat, lon, speed = self._read_gps()

        # 1. Poll CAN bus sensors (non-blocking read of available frames)
        for iface, reader in self.can_readers.items():
            for _ in range(100):  # Read up to 100 frames per cycle
                frame = reader.read_frame()
                if not frame:
                    break
                arb_id, data = frame
                sensor = self.can_sensor_map.get(arb_id)
                if not sensor:
                    continue
                value = parse_can_value(data, sensor)
                if value is not None:
                    cal = sensor.get("calibration", {})
                    value = apply_calibration(value, cal)
                    self.buffer.append({
                        "sensorId": sensor["id"],
                        "sensorType": sensor["sensor_type"],
                        "timestamp": now.isoformat(),
                        "value": round(value, 6),
                        "unit": sensor["unit"],
                        "quality": "good",
                        "latitude": lat,
                        "longitude": lon,
                        "vehicleSpeed": speed,
                    })

        # 2. Poll Modbus sensors
        for sensor in self.config["sensors"]:
            if sensor.get("protocol") not in ("modbus_rtu", "modbus_tcp"):
                continue
            port = sensor.get("serial_port", "/dev/ttyS1")
            reader = self.modbus_readers.get(port)
            if not reader:
                continue
            value = reader.read_register(
                sensor.get("modbus_address", 1),
                sensor.get("modbus_register", 0),
                sensor.get("register_count", 1),
            )
            if value is not None:
                cal = sensor.get("calibration", {})
                value = apply_calibration(value, cal)
                self.buffer.append({
                    "sensorId": sensor["id"],
                    "sensorType": sensor["sensor_type"],
                    "timestamp": now.isoformat(),
                    "value": round(value, 6),
                    "unit": sensor["unit"],
                    "quality": "good",
                    "latitude": lat,
                    "longitude": lon,
                    "vehicleSpeed": speed,
                })

        # 3. Poll GPIO / ADC sensors
        for sensor in self.config["sensors"]:
            if sensor.get("protocol") == "gpio":
                val = GPIOReader.read_gpio(sensor.get("gpio_pin", 0))
                if val is not None:
                    self.buffer.append({
                        "sensorId": sensor["id"], "sensorType": sensor["sensor_type"],
                        "timestamp": now.isoformat(), "value": float(val),
                        "unit": sensor["unit"], "quality": "good",
                    })
            elif sensor.get("protocol") == "analog_4_20ma":
                raw = GPIOReader.read_adc(sensor.get("adc_channel", 0))
                if raw is not None:
                    # Convert 4-20mA to sensor range
                    min_r = sensor.get("min_range", 0)
                    max_r = sensor.get("max_range", 100)
                    value = min_r + (raw - 4.0) / 16.0 * (max_r - min_r)
                    self.buffer.append({
                        "sensorId": sensor["id"], "sensorType": sensor["sensor_type"],
                        "timestamp": now.isoformat(), "value": round(value, 4),
                        "unit": sensor["unit"], "quality": "good",
                        "latitude": lat, "longitude": lon,
                    })

    def _flush_buffer(self):
        """Send buffered readings to Blue Edge cloud."""
        if not self.buffer:
            return

        readings = []
        while self.buffer and len(readings) < self.config["batch_size"]:
            readings.append(self.buffer.popleft())

        payload = {"svgDeviceId": self.device_id, "readings": readings}

        success = False
        # Try MQTT
        if self.mqtt_client:
            try:
                topic = f"{self.config['mqtt_topic_prefix']}/{self.device_id}/readings"
                msg = json.dumps(payload, default=str)
                result = self.mqtt_client.publish(topic, msg, qos=1)
                result.wait_for_publish(timeout=10)
                success = result.is_published()
            except Exception as e:
                logger.debug(f"MQTT flush failed: {e}")

        # Fallback to REST
        if not success:
            try:
                import urllib.request
                url = f"{self.config['cloud_api_url']}/sensors/ingest"
                data = json.dumps(payload, default=str).encode()
                req = urllib.request.Request(
                    url, data=data, method="POST",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.config['cloud_api_key']}",
                    },
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    success = resp.status in (200, 201)
            except Exception as e:
                logger.error(f"REST flush failed: {e}")

        if success:
            logger.debug(f"Flushed {len(readings)} readings to cloud")
        else:
            # Put readings back in buffer for retry
            for r in reversed(readings):
                self.buffer.appendleft(r)
            logger.warning(f"Flush failed, {len(self.buffer)} readings buffered")

        self.last_flush = time.time()

    def run(self):
        """Main loop: poll sensors, buffer, flush."""
        logger.info(f"Sensor Collector starting for {self.device_id}")
        logger.info(f"Configured sensors: {len(self.config['sensors'])}")

        self._init_readers()
        self._connect_mqtt()

        poll_interval = 0.1  # 100ms base poll for CAN
        while self.running:
            try:
                self._poll_sensors()

                # Flush when batch full or interval elapsed
                if (len(self.buffer) >= self.config["batch_size"] or
                        time.time() - self.last_flush >= self.config["flush_interval_sec"]):
                    self._flush_buffer()

            except Exception as e:
                logger.error(f"Poll cycle error: {e}", exc_info=True)

            time.sleep(poll_interval)

        # Flush remaining on shutdown
        if self.buffer:
            self._flush_buffer()
        for r in self.can_readers.values():
            r.close()
        for r in self.modbus_readers.values():
            r.close()
        if self.mqtt_client:
            self.mqtt_client.loop_stop()
        logger.info("Sensor Collector stopped")

    def stop(self, signum=None, frame=None):
        self.running = False


def main():
    parser = argparse.ArgumentParser(description="Blue Edge Sensor Data Collector")
    parser.add_argument("--config", help="Path to sensors.yaml config")
    parser.add_argument("--device-id", help="Override device ID")
    args = parser.parse_args()

    config = DEFAULT_CONFIG.copy()

    if args.config:
        try:
            import yaml
            with open(args.config) as f:
                config.update(yaml.safe_load(f) or {})
        except Exception as e:
            logger.error(f"Config error: {e}")

    if args.device_id:
        config["device_hardware_id"] = args.device_id

    collector = SensorCollector(config)
    signal.signal(signal.SIGTERM, collector.stop)
    signal.signal(signal.SIGINT, collector.stop)
    collector.run()


if __name__ == "__main__":
    main()
