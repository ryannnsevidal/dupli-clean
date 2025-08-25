#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found. Please create a .env file with your production configuration."
    exit 1
fi

print_success "Prerequisites check passed"

# Load environment variables
print_status "Loading environment variables..."
source .env

# Validate required environment variables
required_vars=(
    "POSTGRES_PASSWORD"
    "S3_ACCESS_KEY"
    "S3_SECRET_KEY"
    "S3_BUCKET"
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "EMAIL_FROM"
    "RESEND_API_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var:-}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_success "Environment variables validated"

# Build and deploy
print_status "Building and deploying DupliClean..."

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Build images
print_status "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
print_status "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."

# Wait for PostgreSQL
print_status "Waiting for PostgreSQL..."
timeout=60
counter=0
while ! docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U ${POSTGRES_USER:-postgres} > /dev/null 2>&1; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
        print_error "PostgreSQL failed to start within $timeout seconds"
        exit 1
    fi
done

# Wait for Redis
print_status "Waiting for Redis..."
timeout=30
counter=0
while ! docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping > /dev/null 2>&1; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
        print_error "Redis failed to start within $timeout seconds"
        exit 1
    fi
done

# Wait for MinIO
print_status "Waiting for MinIO..."
timeout=60
counter=0
while ! curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
        print_error "MinIO failed to start within $timeout seconds"
        exit 1
    fi
done

# Wait for web application
print_status "Waiting for web application..."
timeout=120
counter=0
while ! curl -f http://localhost:3000/api/healthz > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "Web application failed to start within $timeout seconds"
        exit 1
    fi
done

print_success "All services are healthy!"

# Run database migrations
print_status "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T web pnpm db:push || {
    print_error "Database migration failed"
    exit 1
}

# Generate Prisma client
print_status "Generating Prisma client..."
docker-compose -f docker-compose.prod.yml exec -T web pnpm db:generate || {
    print_error "Prisma client generation failed"
    exit 1
}

# Check service status
print_status "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Display access information
print_success "DupliClean has been successfully deployed!"
echo ""
echo "Access Information:"
echo "=================="
echo "Web Application: ${NEXTAUTH_URL:-http://localhost:3000}"
echo "MinIO Console: http://localhost:9001"
echo "rclone GUI: http://localhost:5572"
echo ""
echo "Default Credentials:"
echo "==================="
echo "MinIO Console:"
echo "  Username: ${S3_ACCESS_KEY}"
echo "  Password: ${S3_SECRET_KEY}"
echo ""
echo "rclone GUI:"
echo "  Username: ${RCLONE_RC_USER:-rclone}"
echo "  Password: ${RCLONE_RC_PASS:-rclone}"
echo ""

# Check for any failed containers
failed_containers=$(docker-compose -f docker-compose.prod.yml ps --filter "status=exited" --filter "status=dead" -q)
if [ -n "$failed_containers" ]; then
    print_warning "Some containers have failed. Check logs with:"
    echo "docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

print_success "Deployment completed successfully!"
print_status "You can now access DupliClean at: ${NEXTAUTH_URL:-http://localhost:3000}"
