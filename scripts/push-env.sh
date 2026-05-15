#!/usr/bin/env bash
set -euo pipefail
TOKEN_ARG=()
[[ -n "${VERCEL_TOKEN:-}" ]] && TOKEN_ARG=(--token "$VERCEL_TOKEN")

while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "${line// }" ]] && continue
  [[ "${line:0:1}" == "#" ]] && continue
  key="${line%%=*}"
  value="${line#*=}"
  [[ -z "$value" ]] && continue
  for env in production preview; do
    printf '%s' "$value" | vercel env rm "$key" "$env" "${TOKEN_ARG[@]}" --yes >/dev/null 2>&1 || true
    printf '%s' "$value" | vercel env add "$key" "$env" "${TOKEN_ARG[@]}" >/dev/null
    echo "set: $key ($env)"
  done
done < "${1:-.env.local}"
