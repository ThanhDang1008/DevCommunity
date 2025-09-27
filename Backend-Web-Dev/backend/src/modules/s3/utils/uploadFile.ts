import { lookup } from "mime-types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { ObjectCannedACL } from "@aws-sdk/client-s3";
import fs from "fs";

import { config } from "@/config.app";
import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";

export const uploadFile = async ({
  key,
  filePath,
  bucket = config.CLOUDFLARE_R2_BUCKET_NAME,
  acl = undefined,
}: {
  key: string;
  filePath: string;
  bucket?: string;
  acl?: ObjectCannedACL; // Thay đổi nếu cần thiết, mặc định là public-read
}) => {
  try {
    const contentType = lookup(filePath) || "application/octet-stream";
    const fileBuffer = fs.readFileSync(filePath);

    const s3Client = new S3Client({
      endpoint: config.CLOUDFLARE_R2_ENDPOINT,
      region: "apac", //wnam, enam, weur, eeur, apac, oc, auto
      credentials: {
        accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true, // Cần thiết cho các dịch vụ S3-compatible
      //signatureVersion: "v4", // Một số dịch vụ cần chữ ký v4
    });
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: acl || undefined,
    });
    

    await s3Client.send(command);
    console.log(
      "✅ " +
        formatToLocalDateTime(new Date().toISOString()) +
        ` - ☁️ Uploaded file to S3: ${key}`
    );
  } catch (error) {
    throw error;
  }
};
