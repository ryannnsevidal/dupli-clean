#!/bin/bash

echo "🔧 Setting up rclone configuration..."

# Create rclone config directory
mkdir -p .data/rclone

# Configure the dupli-s3 remote pointing to MinIO
docker compose exec rclone rclone config create dupli-s3 s3 \
  provider Minio \
  env_auth false \
  access_key_id ${S3_ACCESS_KEY:-minioadmin} \
  secret_access_key ${S3_SECRET_KEY:-minioadmin} \
  endpoint ${S3_ENDPOINT:-http://minio:9000} \
  acl private

echo "✅ Rclone configured with dupli-s3 remote"
echo ""
echo "🌐 Next steps:"
echo "1. Open http://localhost:5572 in your browser"
echo "2. Add your cloud services (Google Drive, Dropbox, etc.)"
echo "3. Use the 'Cloud Services' tab in DupliClean to import files"
echo ""
echo "📚 Supported services:"
echo "   - Google Drive"
echo "   - Google Photos" 
echo "   - Dropbox"
echo "   - OneDrive"
echo "   - Box"
echo "   - Amazon S3"
echo "   - And many more..."
