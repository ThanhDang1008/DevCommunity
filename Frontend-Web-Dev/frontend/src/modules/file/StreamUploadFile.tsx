"use client";

import { useState, useRef, useCallback, useEffect } from "react";

import type { uploadFileStreamResponse } from "@/service/api/file/types";
import type { AxiosResponse } from "@/lib/axiosInstance";
import clsx from "clsx";

import { uploadFileStream } from "@/service/api/file";

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress: number;
}

const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const calculateChunkSize = (fileSize: number): number => {
  if (fileSize <= 0.5 * 1024 * 1024 * 1024) {
    // File nhỏ hơn 500MB, dùng chunk 1MB
    return 5 * 1024 * 1024; // 1MB
  } else if (fileSize <= 1 * 1024 * 1024 * 1024) {
    // File lớn hơn 500MB và nhỏ hơn 1GB, dùng chunk 5MB
    return 10 * 1024 * 1024;
  } else if (fileSize <= 5 * 1024 * 1024 * 1024) {
    // File lớn hơn 1GB và nhỏ hơn 5GB, dùng chunk 10MB
    return 25 * 1024 * 1024;
  } else {
    // File lớn hơn 5GB, dùng chunk 50MB
    return 50 * 1024 * 1024;
  }
};

type UploadFileProps = {
  title: string;
  description: string;
  messageUploadSuccess?: string;
  btnUploadText?: string;
  btnUploadLoadingText?: string;
  onUploadSuccess?: (data: {
    chunkIndex: number;
    totalChunks: number;
    fileName: string;
    mimetype: string;
    url: string;
    key: string;
    size: number; // Kích thước tập tin
  }) => void;
  onUploadError?: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
};

export default function StreamUploadFile(props: UploadFileProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // console.log("StreamUploadFile props: ", file);
  // console.log("StreamUploadFile props: ", uploading);

  const uploadStartTimeRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastUploadedBytesRef = useRef<number>(0);

  const resetUploadState = () => {
    setFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadedSize(0);
    setTotalSize(0);
    setUploadSpeed(0);
    setEstimatedTime(0);
    //setUploadComplete(false);
    setError(null);
  };

  useEffect(() => {
    return () => {
      // Reset trạng thái khi component bị hủy
      resetUploadState();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTotalSize(selectedFile.size);
      setUploadProgress(0);
      setUploadedSize(0);
      setUploadComplete(false);
      setError(null);
    }
  };

  const updateProgress = (event: UploadProgressEvent) => {
    const now = Date.now();
    const timeDiff = (now - lastUpdateTimeRef.current) / 1000; // thời gian tính bằng giây

    if (timeDiff > 0) {
      const bytesDiff = event.loaded - lastUploadedBytesRef.current;
      const currentSpeed = bytesDiff / timeDiff; // bytes/second

      // Cập nhật tốc độ upload và thời gian còn lại
      setUploadSpeed(currentSpeed);

      const remainingBytes = event.total - event.loaded;
      const remainingTime =
        currentSpeed > 0 ? remainingBytes / currentSpeed : 0;
      setEstimatedTime(remainingTime);

      // Cập nhật giá trị tham chiếu cho lần tính toán tiếp theo
      lastUpdateTimeRef.current = now;
      lastUploadedBytesRef.current = event.loaded;
    }

    setUploadProgress(event.progress);
    setUploadedSize(event.loaded);
  };

  const uploadFileInChunks = useCallback(async () => {
    if (!file) return;

    const upload = async (fileUpload: File) => {
      setUploading(true);
      setError(null);
      setUploadComplete(false);

      // Khởi tạo thời gian bắt đầu upload
      uploadStartTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
      lastUploadedBytesRef.current = 0;

      const chunkSize = calculateChunkSize(fileUpload.size);
      const totalChunks = Math.ceil(fileUpload.size / chunkSize);
      let uploadedChunks = 0;
      let uploadedBytes = 0;

      // Tạo một ID duy nhất cho phiên tải lên này
      const uploadId = `${fileUpload.name.replace(
        /[^a-zA-Z0-9]/g,
        ""
      )}-${Date.now()}`;

      let response: AxiosResponse<uploadFileStreamResponse> | null = null;

      // Tải lên từng chunk
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, fileUpload.size);
        let chunk = fileUpload.slice(start, end);

        // console.log("chunk", chunk);
        // console.log("chunkIndex", chunkIndex);
        // console.log("totalChunks", totalChunks);
        // console.log("chunkSize", chunkSize);
        // console.log("mimeType", fileUpload.type);
        // console.log("uploadId", uploadId);
        // console.log("file", fileUpload);
        response = await uploadFileStream({
          chunk: chunk,
          file: fileUpload,
          mimeType: fileUpload.type,
          uploadId: uploadId,
          chunkIndex: chunkIndex,
          totalChunks: totalChunks,
          chunkSize: chunkSize,
          onUploadProgress: (progressEvent) => {
            // Tính toán tiến trình cho chunk hiện tại
            // console.log("progressEvent.loaded", progressEvent.loaded);//bytes
            // console.log("progressEvent.total", progressEvent.total);//bytes
            const chunkProgress =
              progressEvent.loaded / (progressEvent.total ?? 1);
            uploadedBytes = start + chunkProgress * (end - start);

            // Cập nhật tiến trình tổng thể
            updateProgress({
              loaded: uploadedBytes,
              total: fileUpload.size,
              progress: (uploadedBytes / fileUpload.size) * 100,
            });
            props.onUploadProgress?.((uploadedBytes / fileUpload.size) * 100);
          },
        });
        //console.log("response", response);

        uploadedChunks++;
      }
      // Hoàn thành việc tải lên
      setUploadComplete(true);
      resetUploadState();
      if (response && response?.status === 200) {
        if (response?.data?.chunkIndex === totalChunks - 1) {
          //khi tải lên hoàn tất
          props.onUploadSuccess?.({
            chunkIndex: response?.data?.chunkIndex,
            totalChunks: totalChunks,
            fileName: fileUpload.name,
            mimetype: fileUpload.type,
            url: response?.data?.url || "", // URL của tập tin đã tải lên
            key: response?.data?.key || "", // Key của tập tin đã tải lên
            size: fileUpload.size, // Kích thước tập tin
          });
        }
      }

      // Tính toán thời gian tải lên tổng cộng
      const totalTime = (Date.now() - uploadStartTimeRef.current) / 1000;
      //console.log(`Upload hoàn tất trong ${totalTime.toFixed(2)} giây`);
    };

    try {
      await upload(file);
    } catch (error: any) {
      //console.log("Lỗi khi tải lên: ", error);

      setError(
        error?.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại"
      );
      props.onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  }, [file]);

  return (
    <div className={clsx("rounded-lg p-6", "bg-white dark:bg-zinc-800")}>
      {props.title && (
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {props.title}
        </h3>
      )}

      <div className="mb-6">
        <label className="block mb-2">
          {props.description}{" "}
          {/* <span className="text-red-500">(Chỉ dành cho quản trị viên)</span> */}
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {file && (
        <div className="mb-4">
          <p className={clsx("text-gray-800 dark:text-gray-200")}>
            <span className="font-medium">Tên:</span> {file.name}
          </p>
          <p className={clsx("text-gray-700 dark:text-gray-200")}>
            <span className="font-medium">Kích thước:</span>{" "}
            {formatBytes(file.size)}
          </p>
        </div>
      )}

      <button
        onClick={uploadFileInChunks}
        disabled={!file || uploading}
        className={`w-full py-2 px-4 rounded font-medium ${
          !file || uploading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {uploading
          ? props.btnUploadLoadingText || "Đang tải lên..."
          : props.btnUploadText || "Tải lên"}
      </button>

      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="">Tiến độ: {uploadProgress.toFixed(2)}%</span>
            <span className="">
              {formatBytes(uploadedSize)} / {formatBytes(totalSize)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm ">
            <div>
              <span className="font-medium">Tốc độ:</span>{" "}
              {formatBytes(uploadSpeed)}/s
            </div>
            <div>
              <span className="font-medium">Còn lại:</span>{" "}
              {estimatedTime > 60
                ? `${Math.ceil(estimatedTime / 60)} phút`
                : `${Math.ceil(estimatedTime)} giây`}
            </div>
          </div>
        </div>
      )}

      {uploadComplete && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {props.messageUploadSuccess || "Tải lên hoàn tất"}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
    </div>
  );
}
