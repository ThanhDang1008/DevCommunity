import type { AxiosProgressEvent } from "axios";
import type { uploadFileStreamResponse } from "./types";
import type { StringValue } from "ms";
import type { AxiosResponse } from "@/lib/axiosInstance";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";

import { generateSignature } from "@/shared/utils/signature";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

import type {
  GetListFileResponse,
  UploadFileResponse,
  GetFileStatisticsResponse,
} from "./types";

export const getListFile = async (
  page: number,
  limit: number,
  filters?: {
    startDate?: string;
    endDate?: string;
    mimetype?: string;
    minSize?: number;
    maxSize?: number;
  }
) => {
  const response: AxiosResponse<GetListFileResponse> = await instance.post(
    `/api/v1/s3/file?page=${page}&limit=${limit}`,
    {
      filters: filters,
    }
  );
  return response;
};

export const deleteFile = async (key: string) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/s3/file`,
    {
      data: {
        key: key,
      },
    }
  );
  return response;
};

export const downloadFile = async (url: string) => {
  const response = await instance.post(
    `/api/v1/s3/file/download`,
    {
      url: url,
    },
    {
      responseType: "blob", // 🔑 về blob
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const uploadFile = async (path: string, file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const response: AxiosResponse<UploadFileResponse> = await instance.post(
    `${path}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Size: file.size,
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const getFileStatisticsByAuthor = async () => {
  const response: AxiosResponse<GetFileStatisticsResponse> = await instance.get(
    `/api/v1/s3/file/total-size-upload`
  );
  return response;
};

export const uploadFileStream = async ({
  chunk,
  file,
  mimeType,
  uploadId,
  chunkIndex,
  totalChunks,
  chunkSize,
  onUploadProgress,
}: {
  chunk: Blob;
  file: File;
  mimeType: string;
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  chunkSize: number;
  onUploadProgress: (progressEvent: AxiosProgressEvent) => any;
}) => {
  const token = getTokenAuth2();
  const formData = new FormData();
  formData.append("chunk", chunk, file.name);

  //chunkSize tối đa 50MB
  let timeSignature: StringValue = "1m";
  if (chunkSize > 10 * 1024 * 1024) {
    // Nếu chunkSize lớn hơn 10MB, tính toán thời gian ký hiệu
    // Ví dụ: nếu chunkSize là 50MB, thì timeSignature sẽ là "5m"
    timeSignature = `${Math.ceil(chunkSize / (10 * 1024 * 1024))}m`; //làm tròn lên số nguyên gần nhất
  }

  // Loại bỏ dấu tiếng Việt khỏi tên file trước khi gửi lên server
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const sanitizedFileName = removeVietnameseTones(file.name);

  const response: AxiosResponse<uploadFileStreamResponse> = await instance.post(
    `/api/v1/s3/file/upload-stream`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "stream-upload-id": uploadId,
        "stream-chunk-index": chunkIndex,
        "stream-total-chunks": totalChunks,
        "stream-file-name": sanitizedFileName,
        "stream-file-size": file.size,
        "stream-file-type": mimeType,
        "x-signature": await generateSignature({}, timeSignature),
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        onUploadProgress(progressEvent);
      },
    }
  );
  return response;
};
