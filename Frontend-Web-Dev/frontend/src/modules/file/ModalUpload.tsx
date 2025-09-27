"use client";

import { useState, useEffect } from "react";
import { Modal, Upload, message } from "antd";
import { RcFile } from "antd/es/upload";
import type { LegacyButtonType } from "antd/es/button/button";

import { baseURL } from "@/lib/axiosInstance";
import { deleteFile, uploadFile } from "@/service/api/file";

type ModalUploadProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  allowedFileTypes?: string[];
  maxSize?: number; //MB
  pathFileUpload?: string;
  title?: string;
  okText?: string;
  okType?: LegacyButtonType;
  disabledOkButton?: boolean;
  onOk?: (data: { urlFile: string | undefined }) => void;
  onCancel?: () => void;
  onUploadSuccess?: (urlFile: string) => void;
  onUploadError?: (error: any) => void;
  onRemoveSuccess?: () => void;
  onRemoveError?: (error: any) => void;
};

const ModalUpload = (props: ModalUploadProps) => {
  // (upload file)
  const [pathFileUpload, setPathFileUpload] = useState("");
  const [loadingFileUpload, setLoadingFileUpload] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<RcFile>();
  const [urlFile, setUrlFile] = useState<string | undefined>();

  useEffect(() => {
    if (!props.isOpen) {
      setPathFileUpload("");
      setLoadingFileUpload(false);
      setFileUpload(undefined);
      setUrlFile(undefined);
    }
  }, [props.isOpen]);

  return (
    <>
      <Modal
        title={props.title || "Tải lên file"}
        open={props.isOpen || false}
        onOk={() => props.onOk?.({ urlFile: urlFile ? urlFile : undefined })}
        onCancel={() => props.onCancel?.()}
        okText={props.okText ? props.okText : "Ok"}
        okType={props.okType ? props.okType : "primary"}
        okButtonProps={{
          disabled: loadingFileUpload || props.disabledOkButton,
        }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Upload.Dragger
          name="file"
          //multiple={true}
          action={`${baseURL}${pathFileUpload}`} //link trả về khi upload file
          method="POST"
          disabled={loadingFileUpload}
          customRequest={async (options) => {
            //console.log("options", options);
            setLoadingFileUpload(true);
            try {
              const response = await uploadFile(options?.action, options?.file);
              //console.log("response", response);
              if (options.onSuccess) {
                options.onSuccess(response, options?.file);
              }
              //----------------------------------------------
              setUrlFile(response?.data?.data?.url); //set url file
              props.onUploadSuccess?.(response?.data?.data?.url); //call function onUploadSuccess
              //----------------------------------------------
              //console.log("response: ", response);
            } catch (error: any) {
              //console.log("error: ", error);
              if (options.onError) {
                options.onError(error);
              }

              props.onUploadError?.(error);
            } finally {
              setLoadingFileUpload(false);
            }
          }}
          maxCount={1}
          onChange={(info) => {
            //console.log("info", info);
            // const { status } = info.file;
            // if (status === "uploading") {
            //   //console.log(info.file, info.fileList);
            //   //console.log("status", status);
            //   //message.loading("Uploading file...");
            // }
            if (status === "done") {
              setPathFileUpload("");
              message.success({
                content: `tải lên file ${info.file.name} thành công`,
                duration: 2,
              });
            }
            if (status === "error") {
              setPathFileUpload("");
              message.error(`tải lên file ${info.file.name} thất bại!`);
            }
          }}
          beforeUpload={(file) => {
            //console.log("beforeUpload", file);
            if (props.allowedFileTypes && props.allowedFileTypes?.length > 0) {
              const isAllowedFileType = props.allowedFileTypes.includes(
                file.type
              );
              if (!isAllowedFileType) {
                setPathFileUpload("");

                message.error({
                  content: `Định dạng file không hợp lệ`,
                  duration: 3,
                });
                return;
              }
            }

            if (props.maxSize && props.maxSize > 0) {
              const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize; //MB
              if (!isLtMaxSize) {
                setPathFileUpload("");
                message.error({
                  content: `Kích thước file phải nhỏ hơn ${props.maxSize}MB`,
                  duration: 3,
                });
                return;
              }
            }

            setFileUpload(file);
            return setPathFileUpload(
              props.pathFileUpload
                ? props.pathFileUpload
                : "/api/v1/s3/file/upload"
            );
          }}
          onRemove={async (file) => {
            setUrlFile("");
            const key = urlFile?.split("/").pop() || "";

            try {
              const response = await deleteFile(key);
              if (response.status === 200) {
                props.onRemoveSuccess?.();
              }
              {
                process.env.NODE_ENV === "development" &&
                  console.log("(dev) deleteFile: ", response);
              }
            } catch (error) {
              {
                process.env.NODE_ENV === "development" &&
                  console.log("(dev) deleteFile error: ", error);
              }
              props.onRemoveError?.(error);
            }

            return true;
          }}
          fileList={
            urlFile
              ? [
                  {
                    uid: fileUpload?.uid || "-1",
                    name: fileUpload?.name || "",
                    status: "done",
                    url: urlFile,
                    preview: urlFile,
                    size: fileUpload?.size || 0,
                    type: fileUpload?.type || "",
                  },
                ]
              : []
          }
        >
          {props.children ? (
            props.children
          ) : (
            <>
              <p className="ant-upload-drag-icon text-3xl">
                <i className="bi bi-cloud-arrow-up"></i>
              </p>
              <p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây</p>
              <p className="ant-upload-hint">Hỗ trợ tải lên nhiều định dạng</p>
            </>
          )}
        </Upload.Dragger>
      </Modal>
    </>
  );
};

export default ModalUpload;
export { ModalUpload };
