#!/usr/bin/env bash
# =============================================================================
# Transporti – Start Mobile Only (LAN or Tunnel)
# Usage:
#   bash transporti-mobile/scripts/start.sh            # LAN (default)
#   bash transporti-mobile/scripts/start.sh lan        # LAN
#   bash transporti-mobile/scripts/start.sh tunnel     # Tunnel
# =============================================================================
set -e

MODE="${1:-${START_MODE:-lan}}"
MODE="$(echo "$MODE" | tr '[:upper:]' '[:lower:]')"
if [ "$#" -gt 0 ]; then
  shift
fi
EXTRA_ARGS=("$@")
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

if [ "$MODE" != "lan" ] && [ "$MODE" != "tunnel" ]; then
  echo "[mobile] Invalid mode: $MODE"
  echo "[mobile] Use: lan | tunnel"
  exit 1
fi

echo "[mobile] mode: ${MODE}"

ENV_FILE="$(dirname "$0")/../.env"
CURRENT_API_URL=$(grep '^EXPO_PUBLIC_API_URL=' "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || true)

if [ "$MODE" = "tunnel" ]; then
  BACKEND_PUBLIC_URL=$(cat "$ROOT_DIR/.backend-public-url" 2>/dev/null || true)
  if [ -n "$BACKEND_PUBLIC_URL" ] && [ -f "$ENV_FILE" ]; then
    if sed --version &>/dev/null 2>&1; then
      sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${BACKEND_PUBLIC_URL}|" "$ENV_FILE"
    else
      sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${BACKEND_PUBLIC_URL}|" "$ENV_FILE"
    fi
    CURRENT_API_URL="$BACKEND_PUBLIC_URL"
  fi
fi

if [ -n "$CURRENT_API_URL" ]; then
  echo "[mobile] API URL from .env: ${CURRENT_API_URL}"
else
  echo "[mobile] WARNING: EXPO_PUBLIC_API_URL is not set in transporti-mobile/.env"
  echo "[mobile] Set it to a reachable URL (for WSL mirrored mode, use your Windows LAN IP)."
fi

cd "$(dirname "$0")/.."

if [ "$MODE" = "tunnel" ]; then
  attempt=1
  max_attempts=3

  while [ "$attempt" -le "$max_attempts" ]; do
    echo "[mobile] Starting Expo tunnel (attempt ${attempt}/${max_attempts})..."

    if NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --tunnel --clear "${EXTRA_ARGS[@]}"; then
      exit 0
    fi

    if [ "$attempt" -lt "$max_attempts" ]; then
      echo "[mobile] Tunnel failed to start. Retrying in 3 seconds..."
      sleep 3
    fi

    attempt=$((attempt + 1))
  done

  echo "[mobile] Tunnel could not be established after ${max_attempts} attempts."
  echo "[mobile] If this keeps happening, keep using backend ngrok and retry Expo tunnel after a few seconds."
  exit 1
else
  NODE_OPTIONS=--dns-result-order=ipv4first \
  npx expo start --lan --clear "${EXTRA_ARGS[@]}"
fi
