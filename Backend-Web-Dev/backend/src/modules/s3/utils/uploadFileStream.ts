import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, ObjectCannedACL } from "@aws-sdk/client-s3";
import fs, { statSync } from "fs";
import { lookup } from "mime-types";

import { formatToLocalDateTime } from "@/shared/utils/time/formatToLocalDateTime";
import { config } from "@/config.app";

const calculateChunkSize = (fileSize: number) => {
  if (fileSize <= 1024 * 1024 * 1024) {
    // File nhỏ hơn 1GB, dùng chunk 2MB
    return 5 * 1024 * 1024;
  } else if (fileSize <= 5 * 1024 * 1024 * 1024) {
    // File từ 1GB đến 5GB, dùng chunk 5MB
    return 20 * 1024 * 1024;
  } else {
    // File lớn hơn 5GB, dùng chunk 10MB
    return 50 * 1024 * 1024;
  }
};

export const uploadFileStream = async ({
  key,
  filePath,
  mimeType = undefined, // Loại MIME của file, nếu không có sẽ tự động xác định
  acl = undefined,
}: {
  key: string;
  filePath: string;
  mimeType?: string; // Loại MIME của file, nếu không có sẽ tự động xác định
  acl?: ObjectCannedACL; // Thay đổi nếu cần thiết, mặc định là public-read
}) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const fileSize = statSync(filePath).size;
    const contentType =
      mimeType || lookup(filePath) || "application/octet-stream";

    const chunkSize = calculateChunkSize(fileSize);
    const totalChunks = Math.ceil(fileSize / chunkSize);

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

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.CLOUDFLARE_R2_BUCKET_NAME,
        Key: key,
        Body: fileStream,
        ACL: acl || undefined, // Nếu không có ACL, sẽ không đặt ACL
        ContentType: contentType,
      },
      leavePartsOnError: false, // Nếu true, các phần đã tải lên sẽ không bị xóa khi có lỗi
      queueSize: totalChunks, // Số lượng phần tải lên đồng thời
      partSize: chunkSize, // Kích thước mỗi phần (5MB)
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(`🔄 Uploaded s3: ${key} | ${progress.loaded} bytes`);
    });

    await upload.done();

    const fileUrl = `${config.CLOUDFLARE_R2_DOMAIN}/${config.CLOUDFLARE_R2_BUCKET_NAME}/${key}`;
    console.log(
      "✅ " +
        formatToLocalDateTime(new Date().toISOString()) +
        ` - ☁️ Upload stream s3: ${key} | ${fileSize} bytes`
    );
    return {
      url: fileUrl,
      mimeType: contentType,
      size: fileSize,
    };
  } catch (error) {
    throw error;
  }
};
