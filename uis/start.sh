#!/usr/bin/env bash
set -euo pipefail

(cd /workspace/uis/website && ./node_modules/.bin/next dev --hostname 0.0.0.0 --port 3000) &
website_pid=$!
(cd /workspace/uis/backoffice && ./node_modules/.bin/next dev --hostname 0.0.0.0 --port 3001) &
backoffice_pid=$!

cleanup() {
  trap - EXIT INT TERM
  kill "$website_pid" "$backoffice_pid" 2>/dev/null || true
  wait "$website_pid" "$backoffice_pid" 2>/dev/null || true
}

trap cleanup EXIT INT TERM
wait -n "$website_pid" "$backoffice_pid"