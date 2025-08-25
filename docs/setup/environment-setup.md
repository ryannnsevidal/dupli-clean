# DupliClean Environment Setup Guide 🔧

## 📋 **Required Environment Variables**

Copy `env.example` to `.env` and configure the following variables:

```bash
cp env.example .env
```

## 🗄️ **Database Configuration**

### **DATABASE_URL**
**Required**: PostgreSQL connection string

**Local Development:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dupliclean"
```

**Production (Render/Heroku):**
```
DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

**How to get:**
- **Local**: Install PostgreSQL and create database
- **Render**: Create PostgreSQL service in dashboard
- **Heroku**: `heroku addons:create heroku-postgresql:mini`
- **Railway**: Create PostgreSQL service in dashboard

## 🔴 **Redis Configuration**

### **REDIS_URL**
**Required**: Redis connection string

**Local Development:**
```
REDIS_URL="redis://localhost:6379"
```

**Production:**
```
REDIS_URL="redis://username:password@host:6379"
```

**How to get:**
- **Local**: Install Redis (`brew install redis` on macOS)
- **Render**: Create Redis service in dashboard
- **Heroku**: `heroku addons:create heroku-redis:mini`
- **Railway**: Create Redis service in dashboard

## ☁️ **S3/MinIO Storage**

### **S3_ENDPOINT**
**Required**: S3-compatible storage endpoint

**Local Development (MinIO):**
```
S3_ENDPOINT="http://localhost:9000"
```

**Production (AWS S3):**
```
S3_ENDPOINT="https://s3.amazonaws.com"
```

**Other S3-compatible services:**
- **Cloudflare R2**: `https://account-id.r2.cloudflarestorage.com`
- **Backblaze B2**: `https://s3.us-west-002.backblazeb2.com`
- **DigitalOcean Spaces**: `https://nyc3.digitaloceanspaces.com`

### **S3_REGION**
**Required**: Storage region

**Examples:**
```
S3_REGION="us-east-1"        # AWS US East
S3_REGION="us-west-002"      # Backblaze B2
S3_REGION="nyc3"             # DigitalOcean NYC
S3_REGION="auto"             # Cloudflare R2
```

### **S3_ACCESS_KEY & S3_SECRET_KEY**
**Required**: Storage credentials

**How to get:**
- **AWS S3**: Create IAM user with S3 permissions
- **Cloudflare R2**: Create API token in dashboard
- **Backblaze B2**: Create application key
- **DigitalOcean**: Create Spaces access key
- **MinIO**: Default is `minioadmin`/`minioadmin`

### **S3_BUCKET**
**Required**: Storage bucket name

**Examples:**
```
S3_BUCKET="dupliclean-files"
S3_BUCKET="my-duplicate-detection"
```

**How to create:**
- **AWS S3**: Create bucket in S3 console
- **Cloudflare R2**: Create bucket in dashboard
- **Backblaze B2**: Create bucket in dashboard
- **DigitalOcean**: Create Space in dashboard
- **MinIO**: Will be created automatically by Docker

## 🔐 **Authentication (NextAuth.js)**

### **NEXTAUTH_URL**
**Required**: Your application URL

**Local Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_URL="https://your-app.onrender.com"
```

### **NEXTAUTH_SECRET**
**Required**: Secret key for JWT encryption

**Generate a secure secret:**
```bash
# Generate random secret
openssl rand -base64 32

# Or use this command
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example:**
```
NEXTAUTH_SECRET="your-generated-secret-key-here"
```

## 📧 **Email Configuration (Resend)**

### **RESEND_API_KEY**
**Required**: Resend API key for email magic links

**How to get:**
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create new API key
4. Copy the key

**Example:**
```
RESEND_API_KEY="re_1234567890abcdef..."
```

### **EMAIL_FROM**
**Required**: Sender email address

**Must be verified in Resend:**
```
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_FROM="dupliclean@yourdomain.com"
```

**How to verify:**
1. Add domain in Resend dashboard
2. Follow DNS verification steps
3. Or use Resend's sandbox domain for testing

## ⚙️ **Application Settings**

### **MAX_UPLOAD_MB**
**Optional**: Maximum file upload size in MB

**Default:**
```
MAX_UPLOAD_MB=100
```

### **LOG_LEVEL**
**Optional**: Logging level

**Options:**
```
LOG_LEVEL="error"     # Only errors
LOG_LEVEL="warn"      # Warnings and errors
LOG_LEVEL="info"      # Info, warnings, and errors
LOG_LEVEL="debug"     # All logs
```

### **NODE_ENV**
**Required**: Environment mode

**Options:**
```
NODE_ENV="development"  # Local development
NODE_ENV="production"   # Production deployment
```

## 🔗 **Cloud Integration (Rclone)**

### **RCLONE_RC_URL**
**Required**: Rclone remote control URL

**Local Development:**
```
RCLONE_RC_URL="http://localhost:5572"
```

**Production:**
```
RCLONE_RC_URL="http://rclone:5572"
```

### **RCLONE_RC_USER & RCLONE_RC_PASS**
**Required**: Rclone remote control credentials

**Default (Docker):**
```
RCLONE_RC_USER="rclone"
RCLONE_RC_PASS="rclone"
```

## 🚀 **Complete Environment File Example**

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dupliclean"

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
NEXTAUTH_SECRET="your-generated-secret-key-here"

# Email (Resend)
RESEND_API_KEY="re_1234567890abcdef..."
EMAIL_FROM="noreply@yourdomain.com"

# Upload limits
MAX_UPLOAD_MB=100

# Logging
LOG_LEVEL="info"
NODE_ENV="development"

# Rclone (for cloud service integration)
RCLONE_RC_URL="http://localhost:5572"
RCLONE_RC_USER="rclone"
RCLONE_RC_PASS="rclone"
```

## 🔧 **Quick Setup Commands**

### **Local Development Setup:**
```bash
# 1. Copy environment file
cp env.example .env

# 2. Generate NextAuth secret
echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env

# 3. Update with your values
nano .env

# 4. Start services
docker-compose up -d

# 5. Run database migrations
npm run db:generate
npm run db:push
```

### **Production Setup:**
```bash
# 1. Set environment variables in your hosting platform
# 2. Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 3. Run database migrations
docker-compose exec web npm run db:generate
docker-compose exec web npm run db:push
```

## 🛠️ **Service-Specific Setup**

### **AWS S3 Setup:**
1. Create S3 bucket
2. Create IAM user with S3 permissions
3. Get access key and secret
4. Set environment variables

### **Cloudflare R2 Setup:**
1. Create R2 bucket
2. Create API token
3. Get endpoint URL
4. Set environment variables

### **Resend Email Setup:**
1. Sign up at resend.com
2. Verify your domain
3. Create API key
4. Set environment variables

### **PostgreSQL Setup:**
1. Create database
2. Get connection string
3. Set DATABASE_URL

### **Redis Setup:**
1. Create Redis instance
2. Get connection string
3. Set REDIS_URL

## 🔍 **Verification Commands**

### **Test Database Connection:**
```bash
npm run db:generate
```

### **Test S3 Connection:**
```bash
# Check if bucket exists
aws s3 ls s3://your-bucket-name
```

### **Test Email:**
```bash
# Try logging in - should send magic link
curl -X POST http://localhost:3000/api/auth/signin/email
```

## 🚨 **Security Notes**

1. **Never commit `.env` files** - They're already in `.gitignore`
2. **Use strong secrets** - Generate random strings for NEXTAUTH_SECRET
3. **Limit S3 permissions** - Only grant necessary access
4. **Use HTTPS in production** - Always use secure URLs
5. **Rotate secrets regularly** - Update API keys periodically

## 📞 **Need Help?**

If you encounter issues:

1. **Check logs**: `docker-compose logs -f`
2. **Verify environment**: `echo $DATABASE_URL`
3. **Test connections**: Use verification commands above
4. **Check documentation**: See README.md for more details
