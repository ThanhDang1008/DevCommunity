import { AxiosResponse } from "@/lib/axiosInstance";
import type {
  UploadImageResponse,
  UploadVideoResponse,
} from "@/service/api/upload/types";
import { generateSignature } from "@/shared/utils/signature";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

//create post
export const uploadImage = async (path: string, file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const response: AxiosResponse<UploadImageResponse> = await instance.post(
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

//create post
export const deleteImage = async (key: string) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/s3/image/delete`,
    {
      data: {
        key: key,
      },
    }
  );
  return response;
};

//suneditor
export const uploadImageS3 = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const response: AxiosResponse<UploadImageResponse> = await instance.post(
    "/api/v1/s3/image/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Size: file.size,
        "x-signature": await generateSignature(),
      },
    }
  );
  //console.log("s3: ", response);
  return response;
};

//suneditor
export const uploadVideoS3 = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  const response: AxiosResponse<UploadVideoResponse> = await instance.post(
    "/api/v1/s3/video/upload",
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
