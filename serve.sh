#!/usr/bin/env bash
# Serve the vertical slice. Usage: ./serve.sh [port]
cd "$(dirname "$0")"
PORT="${1:-8877}"
echo "Larkspur Hollow → http://127.0.0.1:${PORT}/"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
