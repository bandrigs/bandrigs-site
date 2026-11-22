#!/usr/bin/env bash
# Deploy the built site to Cloudflare Pages (project "bandrigs").
#   ./deploy.sh preview   -> https://redesign.bandrigs.pages.dev
#   ./deploy.sh live      -> https://bandrigs.com  (only after Ken says "go live")
# Auth: the Cloudflare token lives in the cloud environment as a network secret
# (api.cloudflare.com, path /client/v4/accounts/), so the value below is a placeholder.
set -euo pipefail
cd "$(dirname "$0")"
case "${1:-}" in preview) BRANCH=redesign ;; live) BRANCH=main ;; *) echo "usage: $0 preview|live" >&2; exit 1 ;; esac
node build.mjs
OUT=$(mktemp -d)
git ls-files | grep -vE '\.md$|^build\.mjs$|^deploy\.sh$|^brand/' | while read -r f; do mkdir -p "$OUT/$(dirname "$f")"; cp "$f" "$OUT/$f"; done
CLOUDFLARE_API_TOKEN=via-proxy CLOUDFLARE_ACCOUNT_ID=670f9f726847c524c89adaa01eef8170 \
  npx -y wrangler@3 pages deploy "$OUT" --project-name bandrigs --branch "$BRANCH" \
  --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --format=%s)" --commit-dirty=true
