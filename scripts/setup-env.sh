#!/bin/bash

# DupliClean Environment Setup Script
# This script helps you set up your environment variables

set -e

echo "🚀 DupliClean Environment Setup"
echo "================================"

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Your existing .env file is preserved."
        exit 0
    fi
fi

# Copy example environment file
echo "📋 Copying environment template..."
cp env.example .env

# Generate NextAuth secret
echo "🔐 Generating NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
sed -i.bak "s/your-secret-key-here/$NEXTAUTH_SECRET/" .env
rm .env.bak

echo "✅ Environment file created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your actual values:"
echo "   nano .env"
echo ""
echo "2. Required services to set up:"
echo "   - PostgreSQL database"
echo "   - Redis instance"
echo "   - S3-compatible storage (AWS S3, Cloudflare R2, etc.)"
echo "   - Resend email account"
echo ""
echo "3. See ENVIRONMENT_SETUP.md for detailed instructions"
echo ""
echo "4. Start the application:"
echo "   docker-compose up -d"
echo ""
echo "🔐 Generated NextAuth secret: $NEXTAUTH_SECRET"
echo ""
echo "📚 For detailed setup instructions, see:"
echo "   - ENVIRONMENT_SETUP.md (environment variables)"
echo "   - DEPLOYMENT_CHECKLIST.md (deployment guide)"
echo "   - README.md (general documentation)"
