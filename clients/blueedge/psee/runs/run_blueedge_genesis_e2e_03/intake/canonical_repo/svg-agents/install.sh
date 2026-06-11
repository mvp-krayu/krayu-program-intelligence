#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Blue Edge SVG Agent Installer v1.0
# Installs HASI Bridge + Sensor Collector on SVG 2.0 Yocto Linux
# Run as root: sudo bash install.sh --device-id SVG-A1B2C3-AE
# ══════════════════════════════════════════════════════════════
set -euo pipefail

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${BLUE}[INSTALL]${NC} $1"; }
ok()   { echo -e "${GREEN}[  OK  ]${NC} $1"; }
warn() { echo -e "${YELLOW}[ WARN ]${NC} $1"; }
err()  { echo -e "${RED}[ERROR ]${NC} $1"; exit 1; }

# ── Parse Args ──────────────────────────────────────────────
DEVICE_ID=""
API_URL="https://api.blueedge.network/api/v1"
MQTT_BROKER="mqtt.blueedge.network"

while [[ $# -gt 0 ]]; do
    case $1 in
        --device-id)  DEVICE_ID="$2"; shift 2 ;;
        --api-url)    API_URL="$2"; shift 2 ;;
        --mqtt)       MQTT_BROKER="$2"; shift 2 ;;
        *)            err "Unknown option: $1" ;;
    esac
done

[[ -z "$DEVICE_ID" ]] && err "Usage: install.sh --device-id SVG-XXXXXX-XX"

log "Installing Blue Edge SVG Agents for ${DEVICE_ID}"

# ── Create user & directories ───────────────────────────────
if ! id -u blueedge &>/dev/null; then
    useradd -r -s /usr/sbin/nologin -d /opt/blueedge blueedge
    ok "Created blueedge user"
fi

mkdir -p /opt/blueedge/{hasi-bridge,sensor-collector,config,certs}
mkdir -p /var/log/blueedge
chown -R blueedge:blueedge /opt/blueedge /var/log/blueedge

# ── Copy agent scripts ──────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cp "$SCRIPT_DIR/hasi-bridge/hasi_bridge.py" /opt/blueedge/hasi-bridge/
cp "$SCRIPT_DIR/sensor-collector/sensor_collector.py" /opt/blueedge/sensor-collector/
chmod +x /opt/blueedge/hasi-bridge/hasi_bridge.py
chmod +x /opt/blueedge/sensor-collector/sensor_collector.py
ok "Copied agent scripts"

# ── Copy configs ────────────────────────────────────────────
cp "$SCRIPT_DIR/config/blueedge.yaml" /opt/blueedge/config/
cp "$SCRIPT_DIR/config/sensors.yaml" /opt/blueedge/config/

# Inject device ID into config
sed -i "s/hardware_id:.*/hardware_id: \"${DEVICE_ID}\"/" /opt/blueedge/config/blueedge.yaml
sed -i "s|api_url:.*|api_url: \"${API_URL}\"|" /opt/blueedge/config/blueedge.yaml
sed -i "s|broker:.*|broker: \"${MQTT_BROKER}\"|" /opt/blueedge/config/blueedge.yaml
ok "Installed configs with device ID: ${DEVICE_ID}"

# ── Set environment variables ───────────────────────────────
cat > /opt/blueedge/config/env << EOF
BLUEEDGE_DEVICE_ID=${DEVICE_ID}
BLUEEDGE_API_URL=${API_URL}
BLUEEDGE_MQTT_BROKER=${MQTT_BROKER}
BLUEEDGE_MQTT_PORT=8883
BLUEEDGE_MQTT_ENABLED=true
BLUEEDGE_LOG_LEVEL=INFO
EOF
ok "Environment variables configured"

# ── Install Python dependencies ─────────────────────────────
log "Installing Python dependencies..."
pip3 install --quiet paho-mqtt pymodbus pyyaml 2>/dev/null || warn "pip install failed (some features may be unavailable)"

# ── Install systemd services ───────────────────────────────
cp "$SCRIPT_DIR/systemd/blueedge-hasi-bridge.service" /etc/systemd/system/
cp "$SCRIPT_DIR/systemd/blueedge-sensor-collector.service" /etc/systemd/system/

# Add env file to services
for svc in blueedge-hasi-bridge blueedge-sensor-collector; do
    if ! grep -q "EnvironmentFile" /etc/systemd/system/${svc}.service; then
        sed -i "/\[Service\]/a EnvironmentFile=/opt/blueedge/config/env" /etc/systemd/system/${svc}.service
    fi
done

systemctl daemon-reload
ok "Systemd services installed"

# ── Enable and start ────────────────────────────────────────
systemctl enable blueedge-hasi-bridge.service
systemctl enable blueedge-sensor-collector.service
ok "Services enabled"

log "Starting agents..."
systemctl start blueedge-sensor-collector.service && ok "Sensor Collector started" || warn "Sensor Collector failed to start (check config)"
systemctl start blueedge-hasi-bridge.service && ok "HASI Bridge started" || warn "HASI Bridge failed to start (check HASI is running)"

# ── Verification ────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Blue Edge SVG Agents Installed Successfully${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "  Device ID:         ${DEVICE_ID}"
echo "  API Endpoint:      ${API_URL}"
echo "  MQTT Broker:       ${MQTT_BROKER}"
echo ""
echo "  Services:"
echo "    blueedge-hasi-bridge       → $(systemctl is-active blueedge-hasi-bridge 2>/dev/null || echo 'inactive')"
echo "    blueedge-sensor-collector  → $(systemctl is-active blueedge-sensor-collector 2>/dev/null || echo 'inactive')"
echo ""
echo "  Logs:"
echo "    journalctl -u blueedge-hasi-bridge -f"
echo "    journalctl -u blueedge-sensor-collector -f"
echo ""
echo "  Config:  /opt/blueedge/config/"
echo "  Certs:   /opt/blueedge/config/certs/ (place TLS certs here)"
echo ""
