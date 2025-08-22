#!/usr/bin/env bash
set -euo pipefail

echo "== DupliClean: complete setup =="

# 0) ensure pnpm
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found; please install pnpm first." >&2
  exit 1
fi

# 1) bootstrap env
if [ ! -f "./apps/web/.env.local" ]; then
  cat > ./apps/web/.env.local <<'EOF'
NEXT_PUBLIC_S3_URL=http://localhost:9000/dups
RCLONE_RC_URL=http://localhost:5572
RCLONE_RC_USER=rclone
RCLONE_RC_PASS=rclone
EOF
  echo "Created apps/web/.env.local"
fi

# 2) install deps
pnpm install

# 3) spin infra
docker compose up -d --build

# 4) prisma
pnpm -w prisma:generate || true
pnpm -w prisma:migrate:deploy || true

# 5) rclone: create dupli-s3 remote if missing
docker compose exec -T rclone rclone listremotes | grep -q '^dupli-s3:' || \
docker compose exec -T rclone rclone config create dupli-s3 s3 provider Minio env_auth false \
  access_key_id ${S3_ACCESS_KEY:-minioadmin} secret_access_key ${S3_SECRET_KEY:-minioadmin} \
  endpoint ${S3_ENDPOINT:-http://minio:9000} acl private

echo "== Setup complete. Visit http://localhost:3000 =="
echo "Open rclone GUI at http://localhost:5572 to add Google Drive/Photos, Dropbox, OneDrive, etc."
