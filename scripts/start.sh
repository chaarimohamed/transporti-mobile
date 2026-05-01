#!/usr/bin/env bash
# =============================================================================
# Transporti – Start Mobile Only (Tunnel)
# Usage:
#   bash transporti-mobile/scripts/start.sh
# =============================================================================
set -e

if [ "$#" -gt 0 ]; then
  EXTRA_ARGS=("$@")
else
  EXTRA_ARGS=()
fi
ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

echo "[mobile] mode: tunnel"

ENV_FILE="$(dirname "$0")/../.env"
CURRENT_API_URL=$(grep '^EXPO_PUBLIC_API_URL=' "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || true)

BACKEND_PUBLIC_URL=$(cat "$ROOT_DIR/.backend-public-url" 2>/dev/null || true)
if [ -n "$BACKEND_PUBLIC_URL" ] && [ -f "$ENV_FILE" ]; then
  if sed --version &>/dev/null 2>&1; then
    sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${BACKEND_PUBLIC_URL}|" "$ENV_FILE"
  else
    sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=${BACKEND_PUBLIC_URL}|" "$ENV_FILE"
  fi
  CURRENT_API_URL="$BACKEND_PUBLIC_URL"
fi

if [ -n "$CURRENT_API_URL" ]; then
  echo "[mobile] API URL from .env: ${CURRENT_API_URL}"
else
  echo "[mobile] WARNING: EXPO_PUBLIC_API_URL is not set in transporti-mobile/.env"
  echo "[mobile] Start the backend first with: npm run start:backend"
fi

cd "$(dirname "$0")/.."

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
echo "[mobile] Keep the backend ngrok terminal running and retry Expo after a few seconds."
exit 1
