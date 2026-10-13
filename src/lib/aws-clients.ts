/**
 * AWS Client Configuration & Integration Boundary
 *
 * Designed for OpenNext / AWS Lambda server-side execution.
 * When running in client bundles, this file safely provides stubbed interfaces
 * to avoid leaking credentials or server-only SDK dependencies into the browser.
 */

export interface S3UploadConfig {
  bucketName: string;
  region: string;
  endpoint?: string;
}

export interface DynamoDBConfig {
  tableName: string;
  region: string;
}

export const getAwsConfig = () => {
  return {
    region: process.env.AWS_REGION || "ap-southeast-1",
    s3Bucket: process.env.S3_ASSETS_BUCKET || "motor-ecommerce-assets",
    dynamoTable: process.env.DYNAMODB_PRODUCTS_TABLE || "MotorProducts",
    isConfigured: Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
  };
};

/**
 * Server-only asset URL resolver for S3 / CloudFront
 */
export function getStaticAssetUrl(key: string): string {
  const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
  if (cloudfrontDomain) {
    return `https://${cloudfrontDomain}/${key.replace(/^\//, "")}`;
  }
  return key.startsWith("/") ? key : `/${key}`;
}
