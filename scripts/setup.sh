#!/bin/bash

set -e

echo "🚀 Setting up DupliClean..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🐳 Starting infrastructure services..."
docker compose up postgres redis minio -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Setting up database..."
pnpm db:generate
pnpm db:push

echo "🪣 Initializing MinIO bucket..."
node scripts/init-minio.js

echo "🌱 Seeding database..."
pnpm db:seed

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the application:"
echo "   pnpm dev"
echo ""
echo "📱 Access the application at: http://localhost:3000"
echo "📊 MinIO Console at: http://localhost:9001 (admin/minioadmin)"
echo ""
echo "🔑 Test credentials:"
echo "   Email: test@example.com"
echo "   (Check server console for magic link)"
