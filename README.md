# DupliClean 🧹✨

**Production-grade duplicate file detection and cleanup for images and PDFs**

DupliClean is a modern web application that helps you find and remove duplicate and near-duplicate images and PDFs from your digital collection. Built with Next.js 14, TypeScript, and powered by perceptual hashing algorithms.

## ✨ Features

- **🔐 Secure Authentication**: Email magic-link login with NextAuth.js
- **📁 Smart File Import**: Drag & drop, folder picker, and cloud service integration
- **🔍 Advanced Detection**: Perceptual hashing (pHash) for near-duplicate detection
- **📄 PDF Support**: Automatic page extraction and duplicate detection
- **☁️ Cloud Integration**: Import from Google Drive, Dropbox, OneDrive via rclone
- **🎯 Smart Selection**: Automatic keeper selection based on quality metrics
- **📊 Audit Trail**: Complete deletion history and logging
- **🚀 Production Ready**: Docker Compose, health checks, rate limiting, monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │   Background    │    │   PostgreSQL    │
│   Web App       │◄──►│   Worker        │◄──►│   Database      │
│   (React 18)    │    │   (BullMQ)      │    │   (Prisma)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MinIO/S3      │    │   Redis         │    │   rclone        │
│   Object Store  │    │   (Queue)       │    │   (Cloud Sync)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** and **pnpm**
- **Docker** and **Docker Compose**
- **Git**

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/dupli-clean.git
cd dupli-clean

# Run the complete setup script
./scripts/complete-setup.sh
```

### 2. Access the Application

- **Web App**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (admin/minioadmin)
- **rclone GUI**: http://localhost:5572 (rclone/rclone)

### 3. First Login

1. Visit http://localhost:3000
2. Enter your email address
3. Check the console for the magic link (in development)
4. Click the link to sign in

## 🛠️ Development

### Project Structure

```
dupli-clean/
├── apps/
│   ├── web/                 # Next.js 14 web application
│   └── worker/              # Background job processor
├── packages/
│   ├── db/                  # Prisma database package
│   ├── hashing/             # Perceptual hashing algorithms
│   ├── shared/              # Shared utilities and types
│   └── config/              # Shared configuration
├── tests/
│   ├── e2e/                 # Playwright E2E tests
│   └── fixtures/            # Test files
├── scripts/                 # Setup and utility scripts
└── docker-compose.yml       # Development infrastructure
```

### Available Scripts

```bash
# Development
pnpm dev                    # Start web app in development
pnpm build                  # Build all packages
pnpm typecheck             # Run TypeScript checks
pnpm lint                  # Run ESLint

# Database
pnpm db:generate           # Generate Prisma client
pnpm db:push               # Push schema to database
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed database

# Testing
pnpm test                  # Run unit tests
pnpm e2e:install           # Install Playwright
pnpm e2e                   # Run E2E tests
pnpm e2e:headed            # Run E2E tests with browser

# Infrastructure
docker compose up -d       # Start all services
docker compose down        # Stop all services
```

### Environment Variables

Create `.env.local` in the `apps/web` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dup"

# Redis
REDIS_URL="redis://localhost:6379"

# S3/MinIO
S3_ENDPOINT="http://localhost:9000"
S3_REGION="us-east-1"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_BUCKET="dups"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@dupli.clean"

# Upload limits
MAX_UPLOAD_MB=100

# Rclone (for cloud service integration)
RCLONE_RC_URL="http://localhost:5572"
RCLONE_RC_USER="rclone"
RCLONE_RC_PASS="rclone"

# Public URLs
NEXT_PUBLIC_S3_URL="http://localhost:9000/dups"
```

## ☁️ Cloud Service Integration

DupliClean supports importing files from various cloud services using rclone:

### Supported Services

- **Google Drive** & **Google Photos**
- **Dropbox**
- **OneDrive** & **SharePoint**
- **Box**
- **Amazon S3**
- **And 50+ more...**

### Setup Cloud Services

1. Open http://localhost:5572 (rclone Web GUI)
2. Click "Add Remote"
3. Select your cloud service
4. Follow the authentication flow
5. Use the "Cloud Services" tab in DupliClean to import files

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
# Install Playwright (first time only)
pnpm e2e:install

# Run E2E tests
pnpm e2e

# Run with browser visible
pnpm e2e:headed
```

### Test Coverage

The E2E tests cover:
- User authentication flow
- File upload and processing
- Duplicate detection and clustering
- Bulk deletion with audit logging
- Thumbnail generation

## 🚀 Deployment

### Docker Compose (Production)

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose logs -f web
```

### Environment Setup

For production deployment, ensure you have:

1. **PostgreSQL** database
2. **Redis** instance
3. **S3-compatible** object storage (or MinIO)
4. **Email service** (Resend recommended)
5. **Domain** and **SSL certificate**

### Environment Variables (Production)

```env
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
S3_ENDPOINT=https://your-s3-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=your-bucket
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@your-domain.com
```

## 🔧 Troubleshooting

### Common Issues

**Prisma Schema Issues**
```bash
# Clear Prisma cache and regenerate
cd packages/db
rm -rf node_modules/.prisma
pnpm db:generate
```

**Docker Services Not Starting**
```bash
# Check service health
docker compose ps
docker compose logs postgres redis minio

# Restart services
docker compose down
docker compose up -d
```

**E2E Tests Failing**
```bash
# Ensure all services are running
docker compose up -d

# Check service health
curl http://localhost:3000/api/healthz
curl http://localhost:9000/minio/health/live

# Run tests with debug
pnpm e2e:headed
```

**rclone Connection Issues**
```bash
# Check rclone service
curl http://localhost:5572

# Reconfigure rclone
docker compose exec rclone rclone config reconnect
```

### Performance Optimization

- **Database Indexes**: Ensure Prisma indexes are created
- **Hash Bucketing**: Uses O(log n) search for duplicates
- **Background Processing**: File processing doesn't block the UI
- **Caching**: Redis for session and queue management

## 📊 Monitoring

### Health Checks

- **Web App**: `GET /api/healthz`
- **Metrics**: `GET /api/metrics` (Prometheus format)

### Logs

```bash
# View application logs
docker compose logs -f web worker

# View service logs
docker compose logs postgres redis minio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NextAuth.js** for authentication
- **Prisma** for database management
- **rclone** for cloud service integration
- **Sharp** for image processing
- **BullMQ** for job queuing

---

**Made with ❤️ for keeping your digital life organized**
