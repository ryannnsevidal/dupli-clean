#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up GitHub repository for DupliClean..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the dupli-clean directory"
    exit 1
fi

# Get the repository name from user
echo ""
echo "📝 Please provide your GitHub username and repository name:"
read -p "GitHub username: " GITHUB_USERNAME
read -p "Repository name (default: dupli-clean): " REPO_NAME
REPO_NAME=${REPO_NAME:-dupli-clean}

echo ""
echo "🔗 Setting up remote repository..."

# Add the remote
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Set the main branch
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your DupliClean repository is now on GitHub!"
echo ""
echo "🌐 Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "📋 Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Enable GitHub Actions (if not already enabled)"
echo "3. Set up environment secrets for CI/CD (optional)"
echo "4. Share the repository with others!"
echo ""
echo "🔧 To get started locally:"
echo "   ./scripts/complete-setup.sh"
echo ""
echo "🎉 Happy coding!"
