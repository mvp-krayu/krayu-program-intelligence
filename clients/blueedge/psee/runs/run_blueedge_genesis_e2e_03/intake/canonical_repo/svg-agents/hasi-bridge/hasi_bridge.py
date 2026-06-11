#!/usr/bin/env python3
"""
Blue Edge — HASI Bridge Agent v1.0
Runs on SVG 2.0 Yocto Linux alongside HASI.
Watches HASI's SQLite DB for new captures, threats, and recommendations,
then pushes analysis results to Blue Edge cloud via MQTT or REST fallback.

Deployment: /opt/blueedge/hasi-bridge/hasi_bridge.py
Systemd:    /etc/systemd/system/blueedge-hasi-bridge.service
Config:     /opt/blueedge/config/blueedge.yaml
"""

import os
import sys
import json
import time
import sqlite3
import hashlib
import logging
import signal
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, List

# ── Configuration ───────────────────────────────────────────────
DEFAULT_CONFIG = {
    "device_hardware_id": os.environ.get("BLUEEDGE_DEVICE_ID", "SVG-UNKNOWN-XX"),
    "vehicle_id": os.environ.get("BLUEEDGE_VEHICLE_ID", ""),

    # HASI paths
    "hasi_db_path": os.environ.get("HASI_DB_PATH", "/opt/hasi/data/hasi.db"),
    "hasi_captures_dir": os.environ.get("HASI_CAPTURES_DIR", "/opt/hasi/data/captures"),

    # Blue Edge cloud
    "cloud_api_url": os.environ.get("BLUEEDGE_API_URL", "https://api.blueedge.network/api/v1"),
    "cloud_api_key": os.environ.get("BLUEEDGE_API_KEY", ""),

    # MQTT broker
    "mqtt_enabled": os.environ.get("BLUEEDGE_MQTT_ENABLED", "true").lower() == "true",
    "mqtt_broker": os.environ.get("BLUEEDGE_MQTT_BROKER", "mqtt.blueedge.network"),
    "mqtt_port": int(os.environ.get("BLUEEDGE_MQTT_PORT", "8883")),
    "mqtt_use_tls": os.environ.get("BLUEEDGE_MQTT_TLS", "true").lower() == "true",
    "mqtt_topic_prefix": os.environ.get("BLUEEDGE_MQTT_TOPIC", "blueedge/hasi"),
    "mqtt_client_cert": os.environ.get("BLUEEDGE_MQTT_CERT", "/opt/blueedge/certs/client.pem"),
    "mqtt_client_key": os.environ.get("BLUEEDGE_MQTT_KEY", "/opt/blueedge/certs/client.key"),
    "mqtt_ca_cert": os.environ.get("BLUEEDGE_MQTT_CA", "/opt/blueedge/certs/ca.pem"),

    # Polling
    "poll_interval_sec": int(os.environ.get("BLUEEDGE_POLL_INTERVAL", "30")),
    "batch_size": int(os.environ.get("BLUEEDGE_BATCH_SIZE", "10")),

    # State tracking
    "state_file": "/opt/blueedge/hasi-bridge/state.json",
    "log_file": "/var/log/blueedge/hasi-bridge.log",
    "log_level": os.environ.get("BLUEEDGE_LOG_LEVEL", "INFO"),
}

# ── Logging ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("hasi-bridge")


class HasiBridge:
    """Watches HASI SQLite DB and pushes new analysis to Blue Edge cloud."""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.device_id = config["device_hardware_id"]
        self.running = True
        self.state = self._load_state()
        self.mqtt_client = None

        # Set up file logging if path exists
        log_dir = Path(config["log_file"]).parent
        if log_dir.exists():
            fh = logging.FileHandler(config["log_file"])
            fh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
            logger.addHandler(fh)
        logger.setLevel(getattr(logging, config["log_level"]))

    # ── State Management ────────────────────────────────────────
    def _load_state(self) -> Dict:
        """Load last processed IDs to avoid re-sending."""
        try:
            with open(self.config["state_file"]) as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"last_capture_id": 0, "last_threat_id": 0, "sent_count": 0}

    def _save_state(self):
        Path(self.config["state_file"]).parent.mkdir(parents=True, exist_ok=True)
        with open(self.config["state_file"], "w") as f:
            json.dump(self.state, f, indent=2)

    # ── MQTT Connection ─────────────────────────────────────────
    def _connect_mqtt(self):
        """Connect to Blue Edge MQTT broker with mTLS."""
        if not self.config["mqtt_enabled"]:
            logger.info("MQTT disabled, will use REST fallback")
            return

        try:
            import paho.mqtt.client as mqtt
        except ImportError:
            logger.warning("paho-mqtt not installed, falling back to REST")
            self.config["mqtt_enabled"] = False
            return

        client_id = f"hasi-bridge-{self.device_id}"
        self.mqtt_client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv5)

        if self.config["mqtt_use_tls"]:
            self.mqtt_client.tls_set(
                ca_certs=self.config["mqtt_ca_cert"],
                certfile=self.config["mqtt_client_cert"],
                keyfile=self.config["mqtt_client_key"],
            )

        self.mqtt_client.on_connect = lambda c, u, f, rc, p: logger.info(f"MQTT connected: rc={rc}")
        self.mqtt_client.on_disconnect = lambda c, u, rc, p=None: logger.warning(f"MQTT disconnected: rc={rc}")

        try:
            self.mqtt_client.connect(self.config["mqtt_broker"], self.config["mqtt_port"], keepalive=60)
            self.mqtt_client.loop_start()
            logger.info(f"MQTT connected to {self.config['mqtt_broker']}:{self.config['mqtt_port']}")
        except Exception as e:
            logger.error(f"MQTT connection failed: {e}, falling back to REST")
            self.mqtt_client = None

    # ── HASI DB Reader ──────────────────────────────────────────
    def _read_new_captures(self) -> List[Dict]:
        """Read new captures from HASI's SQLite database."""
        db_path = self.config["hasi_db_path"]
        if not Path(db_path).exists():
            logger.debug(f"HASI DB not found at {db_path}")
            return []

        conn = sqlite3.connect(db_path, timeout=5)
        conn.row_factory = sqlite3.Row
        try:
            cursor = conn.execute(
                """SELECT c.id, c.filename, c.file_size, c.total_packets,
                          c.capture_duration, c.unique_sources, c.unique_destinations,
                          c.status, c.created_at, c.analyzed_at
                   FROM captures c
                   WHERE c.id > ? AND c.status = 'analyzed'
                   ORDER BY c.id ASC LIMIT ?""",
                (self.state["last_capture_id"], self.config["batch_size"]),
            )
            captures = [dict(row) for row in cursor.fetchall()]

            for capture in captures:
                cid = capture["id"]

                # Get protocol summary
                rows = conn.execute(
                    """SELECT protocol, COUNT(*) as count
                       FROM packet_records WHERE capture_id = ?
                       GROUP BY protocol""",
                    (cid,),
                ).fetchall()
                capture["protocol_summary"] = {r["protocol"]: r["count"] for r in rows}

                # Get threats
                rows = conn.execute(
                    """SELECT indicator_type, severity, source_ip, dest_ip, port,
                              protocol, description, details, detected_at
                       FROM threat_indicators WHERE capture_id = ?""",
                    (cid,),
                ).fetchall()
                capture["threats"] = []
                for t in rows:
                    threat = dict(t)
                    # Map HASI indicator_type to Blue Edge threatCategory
                    category_map = {
                        "suspicious_port": "suspicious_port",
                        "blackhole_dns": "blackhole_dns",
                        "c2_pattern": "c2_communication",
                        "port_scan": "port_scan",
                        "anomaly": "protocol_anomaly",
                    }
                    threat["threat_category"] = category_map.get(
                        threat.get("indicator_type", ""), "custom"
                    )
                    capture["threats"].append(threat)

                # Get AI analysis if available
                row = conn.execute(
                    """SELECT response, tokens_used
                       FROM ai_analyses WHERE capture_id = ?
                       ORDER BY created_at DESC LIMIT 1""",
                    (cid,),
                ).fetchone()
                if row:
                    capture["ai_summary"] = dict(row).get("response", "")
                    capture["ai_analyzed"] = True
                else:
                    capture["ai_analyzed"] = False

                # Get firewall recommendations
                rows = conn.execute(
                    """SELECT recommendation_type, vendor, rule_text, priority
                       FROM recommendations WHERE capture_id = ?""",
                    (cid,),
                ).fetchall()
                capture["firewall_rules"] = [dict(r) for r in rows]

            return captures
        except sqlite3.Error as e:
            logger.error(f"SQLite error reading HASI DB: {e}")
            return []
        finally:
            conn.close()

    # ── Payload Builder ─────────────────────────────────────────
    def _build_payload(self, capture: Dict) -> Dict:
        """Transform HASI SQLite row into Blue Edge IngestCaptureDto format."""
        threats = []
        for t in capture.get("threats", []):
            threats.append({
                "threatCategory": t.get("threat_category", "custom"),
                "severity": t.get("severity", "medium"),
                "description": t.get("description", ""),
                "sourceIp": t.get("source_ip"),
                "destinationIp": t.get("dest_ip"),
                "destinationPort": t.get("port"),
                "protocol": t.get("protocol"),
                "confidenceScore": t.get("confidence", 75.0),
                "networkZone": "vehicle_network",
                "detectedAt": t.get("detected_at", datetime.now(timezone.utc).isoformat()),
            })

        firewall_rules = []
        for r in capture.get("firewall_rules", []):
            vendor = r.get("vendor", "iptables")
            rule = {
                "action": "deny",
                "direction": "inbound",
                "description": f"HASI auto-generated: {r.get('recommendation_type', 'acl_rule')}",
                "severity": r.get("priority", "medium"),
            }
            if vendor == "iptables":
                rule["iptablesRule"] = r.get("rule_text", "")
            elif vendor == "cisco":
                rule["ciscoAcl"] = r.get("rule_text", "")
            elif vendor == "paloalto":
                rule["paloAltoRule"] = r.get("rule_text", "")
            elif vendor == "fortinet":
                rule["fortinetRule"] = r.get("rule_text", "")
            else:
                rule["vendorNeutralRule"] = r.get("rule_text", "")
            firewall_rules.append(rule)

        # Compute file hash if capture file exists
        file_hash = ""
        cap_file = Path(self.config["hasi_captures_dir"]) / (capture.get("filename", "") or "")
        if cap_file.exists():
            file_hash = hashlib.sha256(cap_file.read_bytes()).hexdigest()

        return {
            "svgDeviceId": self.device_id,
            "svgHardwareId": self.device_id,
            "vehicleId": self.config["vehicle_id"],
            "hasiCaptureId": str(capture["id"]),
            "filename": capture.get("filename"),
            "fileSizeBytes": capture.get("file_size"),
            "fileHashSha256": file_hash,
            "totalPackets": capture.get("total_packets", 0),
            "captureDurationSec": capture.get("capture_duration"),
            "uniqueSources": capture.get("unique_sources", 0),
            "uniqueDestinations": capture.get("unique_destinations", 0),
            "protocolSummary": capture.get("protocol_summary", {}),
            "captureMode": "continuous",
            "captureScope": "all",
            "aiAnalyzed": capture.get("ai_analyzed", False),
            "aiSummary": capture.get("ai_summary"),
            "threats": threats,
            "firewallRules": firewall_rules,
        }

    # ── Send to Cloud ───────────────────────────────────────────
    def _send_mqtt(self, topic: str, payload: Dict) -> bool:
        """Publish payload to Blue Edge MQTT broker."""
        if not self.mqtt_client:
            return False
        try:
            msg = json.dumps(payload, default=str)
            result = self.mqtt_client.publish(topic, msg, qos=1)
            result.wait_for_publish(timeout=10)
            return result.is_published()
        except Exception as e:
            logger.error(f"MQTT publish failed: {e}")
            return False

    def _send_rest(self, payload: Dict) -> bool:
        """POST payload to Blue Edge REST API (fallback)."""
        try:
            import urllib.request
            url = f"{self.config['cloud_api_url']}/hasi/captures/ingest"
            data = json.dumps(payload, default=str).encode("utf-8")
            req = urllib.request.Request(
                url, data=data, method="POST",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.config['cloud_api_key']}",
                    "X-Device-ID": self.device_id,
                },
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status in (200, 201):
                    body = json.loads(resp.read())
                    logger.info(f"REST ingest OK: captureId={body.get('captureId')}")
                    return True
                else:
                    logger.error(f"REST ingest failed: HTTP {resp.status}")
                    return False
        except Exception as e:
            logger.error(f"REST ingest error: {e}")
            return False

    def _send_payload(self, payload: Dict) -> bool:
        """Try MQTT first, fall back to REST."""
        topic = f"{self.config['mqtt_topic_prefix']}/{self.device_id}/capture"

        if self.config["mqtt_enabled"] and self.mqtt_client:
            if self._send_mqtt(topic, payload):
                logger.info(f"MQTT published to {topic}")
                return True
            logger.warning("MQTT failed, trying REST fallback")

        return self._send_rest(payload)

    # ── Main Loop ───────────────────────────────────────────────
    def run(self):
        """Main polling loop."""
        logger.info(f"HASI Bridge Agent starting for {self.device_id}")
        logger.info(f"HASI DB: {self.config['hasi_db_path']}")
        logger.info(f"Cloud API: {self.config['cloud_api_url']}")
        logger.info(f"Poll interval: {self.config['poll_interval_sec']}s")

        self._connect_mqtt()

        while self.running:
            try:
                captures = self._read_new_captures()
                if captures:
                    logger.info(f"Found {len(captures)} new capture(s) to sync")

                for capture in captures:
                    payload = self._build_payload(capture)
                    threat_count = len(payload.get("threats", []))
                    rule_count = len(payload.get("firewallRules", []))

                    if self._send_payload(payload):
                        self.state["last_capture_id"] = capture["id"]
                        self.state["sent_count"] += 1
                        self._save_state()
                        logger.info(
                            f"Synced capture #{capture['id']}: "
                            f"{payload['totalPackets']} packets, "
                            f"{threat_count} threats, {rule_count} rules"
                        )
                    else:
                        logger.error(f"Failed to sync capture #{capture['id']}, will retry")
                        break  # Don't skip captures, retry on next poll

            except Exception as e:
                logger.error(f"Poll cycle error: {e}", exc_info=True)

            time.sleep(self.config["poll_interval_sec"])

        # Cleanup
        if self.mqtt_client:
            self.mqtt_client.loop_stop()
            self.mqtt_client.disconnect()
        logger.info("HASI Bridge Agent stopped")

    def stop(self, signum=None, frame=None):
        logger.info(f"Shutdown signal received (sig={signum})")
        self.running = False


# ── Entry Point ─────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Blue Edge HASI Bridge Agent")
    parser.add_argument("--config", help="Path to YAML config file")
    parser.add_argument("--device-id", help="Override device hardware ID")
    parser.add_argument("--hasi-db", help="Override HASI SQLite DB path")
    parser.add_argument("--api-url", help="Override Blue Edge API URL")
    parser.add_argument("--poll-interval", type=int, help="Override poll interval (seconds)")
    parser.add_argument("--dry-run", action="store_true", help="Read DB but don't send")
    args = parser.parse_args()

    config = DEFAULT_CONFIG.copy()

    # Load YAML config if provided
    if args.config:
        try:
            import yaml
            with open(args.config) as f:
                file_config = yaml.safe_load(f) or {}
            config.update(file_config)
        except ImportError:
            logger.warning("PyYAML not installed, using env-only config")
        except Exception as e:
            logger.error(f"Config load error: {e}")

    # CLI overrides
    if args.device_id:
        config["device_hardware_id"] = args.device_id
    if args.hasi_db:
        config["hasi_db_path"] = args.hasi_db
    if args.api_url:
        config["cloud_api_url"] = args.api_url
    if args.poll_interval:
        config["poll_interval_sec"] = args.poll_interval

    bridge = HasiBridge(config)
    signal.signal(signal.SIGTERM, bridge.stop)
    signal.signal(signal.SIGINT, bridge.stop)
    bridge.run()


if __name__ == "__main__":
    main()
