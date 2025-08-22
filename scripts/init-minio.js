const { S3Client, CreateBucketCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
});

async function initMinio() {
  try {
    const bucketName = process.env.S3_BUCKET || 'dups';
    
    console.log('Creating bucket:', bucketName);
    
    // Create bucket
    await s3.send(new CreateBucketCommand({
      Bucket: bucketName,
    }));
    
    console.log('Bucket created successfully');
    
    // Set bucket policy for public read access to thumbnails
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadForThumbnails',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/thumbs/*`,
        },
      ],
    };
    
    await s3.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    }));
    
    console.log('Bucket policy set successfully');
    
  } catch (error) {
    if (error.name === 'BucketAlreadyExists') {
      console.log('Bucket already exists, skipping creation');
    } else {
      console.error('Error initializing MinIO:', error);
      process.exit(1);
    }
  }
}

initMinio();
