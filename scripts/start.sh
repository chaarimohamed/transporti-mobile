#!/usr/bin/env bash
# =============================================================================
# Transporti – Start Mobile Only (auto-detects LAN IP)
# Usage: npm run start:mobile  OR  bash transporti-mobile/scripts/start.sh
# =============================================================================
set -e

detect_lan_ip() {
  # Read cached value from root if available
  ROOT_IP_FILE="$(dirname "$0")/../../.lan-ip"
  if [ -f "$ROOT_IP_FILE" ]; then
    cat "$ROOT_IP_FILE"
    return
  fi
  # Linux
  if command -v hostname &>/dev/null && hostname -I &>/dev/null 2>&1; then
    ip=$(hostname -I 2>/dev/null | awk '{print $1}')
    [ -n "$ip" ] && echo "$ip" && return
  fi
  # macOS
  if command -v ipconfig &>/dev/null; then
    for iface in en0 en1 en2; do
      ip=$(ipconfig getifaddr "$iface" 2>/dev/null || true)
      [ -n "$ip" ] && echo "$ip" && return
    done
  fi
  if command -v ip &>/dev/null; then
    ip=$(ip route get 1.1.1.1 2>/dev/null | awk '/src/{print $7}' | head -1)
    [ -n "$ip" ] && echo "$ip" && return
  fi
  echo "localhost"
}

LAN_IP=$(detect_lan_ip)
BACKEND_PORT=$(cat "$(dirname "$0")/../../.backend-port" 2>/dev/null || echo "3000")

echo "[mobile] LAN IP: ${LAN_IP}"
echo "[mobile] API URL: http://${LAN_IP}:${BACKEND_PORT}/api"

# Update .env with current IP
ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
  if sed --version &>/dev/null 2>&1; then
    sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://${LAN_IP}:${BACKEND_PORT}/api|" "$ENV_FILE"
  else
    sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://${LAN_IP}:${BACKEND_PORT}/api|" "$ENV_FILE"
  fi
fi

cd "$(dirname "$0")/.."
EXPO_OFFLINE=1 \
REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP" \
NODE_OPTIONS=--dns-result-order=ipv4first \
npx expo start --lan --clear
