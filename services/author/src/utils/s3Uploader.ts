// utils/s3Uploader.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadBlogToS3 = async (blogId: number, blogData: any) => {
  const bucketName = "blog-micro-data-archive";
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const key = `blog-history/${today}/blog-${blogId}.json`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(blogData, null, 2),
    ContentType: "application/json",
    ObjectLockMode: "COMPLIANCE",
    ObjectLockRetainUntilDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 ngày
  });

  try {
    await s3.send(command);
    console.log(`✅ Blog ${blogId} uploaded to S3`);
  } catch (error) {
    console.error("❌ Failed to upload blog to S3:", error);
  }
};
