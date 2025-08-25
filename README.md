# DupliClean 🧹✨

**Enterprise-grade duplicate file detection and cleanup powered by ML**

DupliClean is a production-ready web application that uses advanced machine learning algorithms and perceptual hashing to detect and remove duplicate images and PDFs from your digital collection. Built with Next.js 14, TypeScript, and modern ML techniques.

## ✨ Features

### 🔐 **Secure Authentication**
- **Email Magic Link Login** - Passwordless authentication with NextAuth.js
- **JWT Sessions** - Secure session management with Prisma adapter
- **User Data Isolation** - Complete data separation between users

### 📁 **Smart File Management**
- **Drag & Drop Upload** - Intuitive file selection with progress tracking
- **Cloud Service Integration** - Import from 50+ services via rclone
- **Folder Support** - Upload entire directories
- **Multiple Formats** - Images (JPG, PNG, WebP, GIF) and PDFs
- **Pre-signed URLs** - Secure direct-to-S3 uploads

### 🔍 **Advanced Duplicate Detection**
- **Perceptual Hashing** - pHash, aHash, dHash algorithms
- **ML Embeddings** - CLIP, VGG16, ResNet50 for enhanced similarity
- **Smart Clustering** - Union-find algorithm with keeper selection
- **Hash Bucketing** - O(log n) candidate search for large datasets
- **Near-Duplicate Support** - Configurable similarity thresholds

### 🎨 **Modern UI/UX**
- **Responsive Dashboard** - Real-time statistics and ML insights
- **Interactive Charts** - Visual analytics with Recharts
- **Real-time Updates** - Live progress and status indicators
- **Smart Defaults** - Automatically selects best quality files
- **Bulk Operations** - One-click deletion with confirmation

### ☁️ **Cloud Integration**
- **50+ Cloud Services** - Google Drive, Dropbox, OneDrive, Box, Amazon S3
- **Background Import** - Non-blocking file copying
- **Service Management** - Easy cloud service configuration
- **Progress Tracking** - Real-time import status

### 🚀 **Production Ready**
- **Docker Compose** - Complete containerized deployment
- **Background Workers** - BullMQ job queue for scalability
- **Health Checks** - Comprehensive monitoring
- **Audit Logging** - Complete operation history
- **Rate Limiting** - API protection

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DupliClean Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Next.js   │    │   API       │    │ PostgreSQL  │     │
│  │   Frontend  │◄──►│   Routes    │◄──►│   Database  │     │
│  │   (React)   │    │   (Node)    │    │  (Prisma)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │           │
│         │ Upload            │ Enqueue           │ Store     │
│         ▼                   ▼                   ▼           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   MinIO/S3  │    │   Redis     │    │   Worker    │     │
│  │   Storage   │    │   (BullMQ)  │    │  (Node.js)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                   │           │
│         │                   │                   │           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   rclone    │    │   ML        │    │   Thumbnail │     │
│  │   Service   │    │   Models    │    │   Generation│     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
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
│   ├── ml/                  # ML embeddings and similarity
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

## 🤖 ML Features

### Perceptual Hashing
- **pHash** - Discrete Cosine Transform based hashing
- **aHash** - Average hash for fast comparison
- **dHash** - Difference hash for edge detection
- **Hash Bucketing** - O(log n) search performance

### Machine Learning Embeddings
- **CLIP** - OpenAI's vision-language model
- **VGG16** - Deep CNN features
- **ResNet50** - Residual network features
- **Cosine Similarity** - Advanced similarity detection

### Enhanced Detection
- **Two-tier Approach** - Hash + ML confirmation
- **Configurable Thresholds** - Adjustable sensitivity
- **Batch Processing** - Efficient large-scale analysis
- **Model Selection** - Choose optimal ML model per use case

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

## 📊 Dashboard & Analytics

### Real-time Statistics
- **File Counts** - Total files, assets, and duplicates
- **Storage Usage** - Disk space and bandwidth metrics
- **Processing Jobs** - Background task status
- **ML Model Usage** - Embedding generation statistics

### Interactive Charts
- **File Type Distribution** - Pie charts of file formats
- **Job Status Overview** - Processing pipeline health
- **ML Model Performance** - Model usage analytics
- **Cloud Service Activity** - Import statistics

### Processing Insights
- **Background Jobs** - Real-time job monitoring
- **Error Tracking** - Failed job analysis
- **Performance Metrics** - Processing speed and efficiency
- **Audit Trail** - Complete operation history

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
- ML embedding generation
- Duplicate detection and clustering
- Cloud service integration
- Bulk deletion with audit logging
- Dashboard analytics

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

**ML Model Issues**
```bash
# Check ML package installation
pnpm --filter @dupli/ml install

# Verify TensorFlow.js setup
pnpm --filter @dupli/ml test
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

### Performance Optimization

- **Database Indexes** - Ensure Prisma indexes are created
- **Hash Bucketing** - Uses O(log n) search for duplicates
- **Background Processing** - File processing doesn't block the UI
- **ML Model Caching** - Embedding generation optimization
- **Connection Pooling** - Efficient database connections
- **CDN Ready** - Static assets optimized

## 📊 Monitoring

### Health Checks

- **Web App**: `GET /api/healthz`
- **Metrics**: `GET /api/metrics` (Prometheus format)
- **Dashboard**: `GET /api/dashboard/stats`

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
- Include ML model documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NextAuth.js** for authentication
- **Prisma** for database management
- **rclone** for cloud service integration
- **Sharp** for image processing
- **BullMQ** for job queuing
- **TensorFlow.js** for ML capabilities
- **Recharts** for data visualization

---

**Made with ❤️ for keeping your digital life organized and intelligent** 🧹✨🤖
