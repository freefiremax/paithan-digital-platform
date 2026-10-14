#!/usr/bin/env bash
set -euo pipefail

# Keep lifecycle scripts enabled: Prisma and native packages need postinstall.
# Retry only transient network failures, and still fail after three attempts.
retry_network() {
  local attempt status log
  log="$(mktemp)"
  for attempt in 1 2 3; do
    if "$@" 2>&1 | tee "$log"; then
      rm -f "$log"
      return 0
    else
      status=${PIPESTATUS[0]}
    fi
    if [ "$attempt" -eq 3 ] || ! grep -Eq 'ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|ECONNREFUSED' "$log"; then
      rm -f "$log"
      return "$status"
    fi
    echo "::warning::Transient network failure; retrying attempt $((attempt + 1)) of 3."
    sleep "$((attempt * 10))"
  done
}

retry_network npm ci
retry_network npm run db:generate
