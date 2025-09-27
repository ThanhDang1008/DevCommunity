"use client";

import { Upload, message, Image, Button } from "antd";
import { useState, useEffect } from "react";
import { RcFile } from "antd/es/upload";

import { uploadImage, deleteImage } from "@/service/api/upload";
import { baseURL } from "@/lib/axiosInstance";
import { tagNext, LOGO_DEFAULT } from "@/constants/Common";

import { updateDataWeb, readDataWeb } from "@/service/api/web";
import { revalidateTag } from "@/service/api/web/actions";

const UpdateLogo = () => {
  const [urlLogo, setUrlLogo] = useState<string>("");
  const [fileUpload, setFileUpload] = useState<RcFile>();
  const [loadingFileUpload, setLoadingFileUpload] = useState<boolean>(false);
  const [pathFileUpload, setPathFileUpload] = useState("");

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);

  const updateLogo = async (url: string) => {
    // console.log("newValue: ", newValue);
    if (!url) {
      return message.open({
        type: "warning",
        content: "Vui lòng chọn logo",
      });
    }
    setIsLoadingUpdate(true);
    try {
      const response = await updateDataWeb({
        logo: url,
      });
      if (response?.status === 200) {
        //gọi qua server ko throw chi tiết error
        const res = await revalidateTag(tagNext.WEB).catch((error) => {
          setIsLoadingUpdate(false);
          return message.open({
            type: "error",
            content: "Cập nhật thất bại",
          });
        });
        //console.log("___res: ", res);
        if (res?.status === 200) {
          setIsLoadingUpdate(false);
          setUrlLogo(url);
          handleClear();
          return message.open({
            type: "success",
            content: "Cập nhật thành công",
          });
        }
      }
    } catch (error) {
      //console.log("___error: ", error);
      setIsLoadingUpdate(false);
      return message.open({
        type: "error",
        content: "Cập nhật thất bại",
      });
    }
  };

  const handleClear = () => {
    // setUrlLogo("");
    setFileUpload(undefined);
    setPathFileUpload("");
    setLoadingFileUpload(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await readDataWeb();
        // console.log("response: ", response);
        if (response?.status === 200) {
          setUrlLogo(response?.data?.data?.logo || "");
        }
      } catch (error) {
        message.open({
          type: "error",
          content: "Lấy logo thất bại",
        });
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex gap-4 md:flex-row flex-col items-center">
        <div className="w-32">
          <Image
            src={urlLogo || "/image/thumbnail_default.jpg"}
            fallback="/image/thumbnail_default.jpg"
            alt="Thumbnail"
          />
        </div>
        <div>
          <Upload.Dragger
            name="file"
            accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
            //multiple={true}
            action={`${baseURL}${pathFileUpload}`} //link trả về khi upload file
            method="POST"
            disabled={loadingFileUpload}
            customRequest={async (options) => {
              //console.log("options", options);
              setLoadingFileUpload(true);
              //------ xoá ảnh cũ nếu upload ảnh mới ------
              if (urlLogo && urlLogo !== LOGO_DEFAULT) {
                const key = urlLogo.split("/").pop() || "";
                const response = await deleteImage(key);
                {
                  process.env.NODE_ENV === "development" &&
                    console.log("(dev) deleteImage: ", response);
                }
              }
              //------------------------------
              try {
                const response = await uploadImage(
                  options?.action,
                  options?.file
                );
                //console.log("response", response);
                if (options.onSuccess) {
                  options.onSuccess(response, options?.file);
                }
                setLoadingFileUpload(false);
                setUrlLogo(response?.data?.data?.url);

                //console.log("response: ", response);
              } catch (error: any) {
                //console.log("error: ", error);
                setLoadingFileUpload(false);
                if (options.onError) {
                  options.onError(error);
                }
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
                  content: `tải lên ảnh ${info.file.name} thành công`,
                  duration: 2,
                });
              }
              if (status === "error") {
                setPathFileUpload("");
                message.error(`tải lên ảnh ${info.file.name} thất bại!`);
              }
            }}
            beforeUpload={(file) => {
              //console.log("beforeUpload", file);
              const allowedFileTypes = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/gif",
                "image/svg+xml",
                "image/webp",
              ];
              const isAllowedFileType = allowedFileTypes.includes(file.type);
              if (!isAllowedFileType) {
                setPathFileUpload("");

                message.error({
                  content: "Chỉ có thể tải lên các file ảnh!",
                  duration: 3,
                });
                return;
              }
              const isLt10M = file.size / 1024 / 1024 < 10;
              if (!isLt10M) {
                setPathFileUpload("");
                message.error({
                  content: "Kích thước file phải nhỏ hơn 10MB!",
                  duration: 3,
                });
                return;
              }
              setFileUpload(file);
              return setPathFileUpload("/api/v1/s3/image/upload");
            }}
            onRemove={async (file) => {
              if (urlLogo === LOGO_DEFAULT) {
                return message.open({
                  type: "warning",
                  content: "Logo mặc định không thể xóa",
                });
              }
              setUrlLogo("");
              const key = urlLogo.split("/").pop() || "";
              const response = await deleteImage(key);
              {
                process.env.NODE_ENV === "development" &&
                  console.log("(dev) deleteImage: ", response);
              }
              return true;
            }}
            fileList={
              urlLogo
                ? [
                    {
                      uid: fileUpload?.uid || "-1",
                      name: fileUpload?.name || "logo (đã cập nhật)",
                      status: "done",
                      url: urlLogo,
                      preview: urlLogo,
                      size: fileUpload?.size || 0,
                      type: fileUpload?.type || "image/png",
                    },
                  ]
                : []
            }
          >
            <p className="ant-upload-drag-icon">
              <i className="bi bi-cloud-arrow-up"></i>
            </p>
            <p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây</p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ các có định dạng ảnh: .png .jpg .jpeg .gif .svg .webp
            </p>
          </Upload.Dragger>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            size="large"
            disabled={
              !urlLogo ||
              loadingFileUpload ||
              isLoadingUpdate ||
              urlLogo === LOGO_DEFAULT
                ? true
                : false
            }
            // disabled={true}
            onClick={() => {
              //console.log("fileUpload", fileUpload);
              updateLogo(urlLogo);
            }}
          >
            {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
          <Button
            type="default"
            size="large"
            disabled={
              loadingFileUpload || isLoadingUpdate || urlLogo === LOGO_DEFAULT
                ? true
                : false
            }
            onClick={async () => {
              updateLogo(LOGO_DEFAULT);
              if (urlLogo) {
                const key = urlLogo.split("/").pop() || "";
                const response = await deleteImage(key);
                {
                  process.env.NODE_ENV === "development" &&
                    console.log("(dev) deleteImage: ", response);
                }
              }
            }}
          >
            <i className="bi bi-arrow-clockwise"></i>
            {"Khôi phục về mặc định"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UpdateLogo;
