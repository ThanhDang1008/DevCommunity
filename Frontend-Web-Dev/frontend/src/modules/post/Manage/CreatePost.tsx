"use client";

import dayjs from "dayjs";
import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Image,
  Upload,
  message,
  Select,
  DatePicker,
  FloatButton,
  Tooltip,
} from "antd";
import type { GetProps } from "antd";
import type { DisabledTimes, BaseInfo } from "rc-picker/lib/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import clsx from "clsx";

import { createPost } from "@/service/api/post";
import type { CreatePost } from "@/service/api/post/types";
import { uploadImage, deleteImage } from "@/service/api/upload";
import { baseURL } from "@/lib/axiosInstance";

import ParseHTML from "@components/suneditor/parse";
import SelectTag, { SelectTagRef } from "@/modules/tag/Select-Tag";
import { convertToSlug } from "@/shared/utils/slugify";

import SuneEditor, { SuneEditorRef } from "@components/suneditor";
import {
  statusPost as enumStatusPost,
  queryKeys,
  statusPost,
} from "@/constants/Common";
import { RcFile } from "antd/es/upload";

import {
  PAGE_POST_RECENT,
  LIMIT_POST_RECENT,
} from "@/app/manage/posts/view/constants";

const CreatePost = () => {
  const queryClient = useQueryClient();
  const sunEditorRef = useRef<SuneEditorRef>(null);
  const tagPostRef = useRef<SelectTagRef>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urlThumbnail, setUrlThumbnail] = useState("");
  const [statusPost, setStatusPost] = useState(enumStatusPost.PUBLIC);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const [fileUpload, setFileUpload] = useState<RcFile>();
  const [loadingFileUpload, setLoadingFileUpload] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [pathFileUpload, setPathFileUpload] = useState("");

  const onChangeTitle = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
  };

  const onChangeDescription = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleChangeStatusPost = (value: statusPost) => {
    setStatusPost(value);
  };

  //----------------------------------- DatePicker ---------------------------
  //console.log("createdAt", createdAt);

  const onOkDatePicker = (value: any) => {
    // console.log("onOkDatePicker1: ", value);
    // console.log("onOkDatePicker2: ", value?.toISOString());
    setCreatedAt(value?.toISOString());
  };

  const onCalendarChange = (
    date: any | any[],
    dateString: string | string[],
    info: BaseInfo
  ) => {
    if (date) {
      // console.log("onCalendarChange", date.toISOString());
      setCreatedAt(date?.toISOString());
      //console.log("onCalendarChange", date.toISOString());
    }
  };

  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };
  const disabledHours = useMemo<DisabledTimes["disabledHours"]>(() => {
    return () => {
      const selectedDate = createdAt ? dayjs(createdAt) : dayjs();
      const currentDate = dayjs();
      const hours = Array.from({ length: 24 }, (_, i) => i);

      if (selectedDate.isSame(currentDate, "day")) {
        const currentHour = currentDate.hour();
        return hours.filter((hour) => hour < currentHour);
      }

      return [];
    };
  }, [createdAt]);

  const disabledMinutes = useMemo<DisabledTimes["disabledMinutes"]>(() => {
    return () => {
      const selectedDate = createdAt ? dayjs(createdAt) : dayjs();
      const currentDate = dayjs();
      const minutes = Array.from({ length: 60 }, (_, i) => i);

      if (
        selectedDate.isSame(currentDate, "day") &&
        selectedDate.hour() === currentDate.hour()
      ) {
        const currentMinute = currentDate.minute();
        return minutes.filter((minute) => minute < currentMinute);
      }

      return [];
    };
  }, [createdAt]);

  const disabledSeconds = useMemo<DisabledTimes["disabledSeconds"]>(() => {
    return () => {
      const selectedDate = createdAt ? dayjs(createdAt) : dayjs();
      const currentDate = dayjs();
      const seconds = Array.from({ length: 60 }, (_, i) => i);

      if (
        selectedDate.isSame(currentDate, "day") &&
        selectedDate.hour() === currentDate.hour() &&
        selectedDate.minute() === currentDate.minute()
      ) {
        const currentSecond = currentDate.second();
        return seconds.filter((second) => second < currentSecond);
      }

      return [];
    };
  }, [createdAt]);

  //----------------------------------------------------------------

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: (data: CreatePost) => createPost(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      handleClear();
      message.open({
        type: "success",
        content: "Thêm bài viết thành công",
      });
      queryClient.refetchQueries({
        queryKey: [
          queryKeys.GET_ALL_POST_RECENT,
          PAGE_POST_RECENT,
          LIMIT_POST_RECENT,
        ],
      });
      //handleCancel();
    },
    onError: (error: any) => {
      {
        process.env.NODE_ENV === "development" && console.log("error", error);
      }
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
  });

  const handleCreatePost = () => {
    const slug = `${convertToSlug(title)}-${Date.now()}.html`;

    if (!title) {
      message.open({
        type: "warning",
        content: "Tiêu đề không được để trống",
      });
      return;
    }
    if (!description) {
      message.open({
        type: "warning",
        content: "Mô tả không được để trống",
      });
      return;
    }
    if (tagPostRef.current?.getAllTag()[0] === "") {
      message.open({
        type: "warning",
        content: "Chưa chọn chủ đề",
      });
      return;
    }
    if (!sunEditorRef.current?.getHtmlContent()) {
      message.open({
        type: "warning",
        content: "Nội dung không được để trống",
      });
      return;
    }
    //-------------------------------------------

    createPostMutation({
      slug: slug,
      title: title.trim(),
      description: description.trim(),
      thumbnail: urlThumbnail,
      status: statusPost,
      content: sunEditorRef?.current?.getHtmlContent(),
      toc: sunEditorRef?.current?.getToc() || [],
      category: tagPostRef.current?.getAllTag() || [],
      tags: [],
      keywords: keywords.length > 0 ? keywords : [],
      link: {
        image: sunEditorRef?.current?.getLink()?.image || [],
        video: sunEditorRef?.current?.getLink()?.video || [],
      },
      createdAt: createdAt,
    });
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setUrlThumbnail("");
    setFileUpload(undefined);
    tagPostRef?.current?.clearAllTag();
    setStatusPost(enumStatusPost.PUBLIC);
    setCreatedAt("");
    sunEditorRef.current?.clearAll();
  };

  const handleChangeKeywords = (value: string[]) => {
    const replaced = value.map((topic) => topic.replace(/\s+/g, "-"));
    const filtered = replaced.filter(
      (topic) => topic.trim() !== "" && topic.length <= 10
    );
    if (replaced.some((topic) => topic.trim() === "")) {
      return message.warning("Từ khoá không được để trống");
    }
    if (replaced.some((topic) => topic.length > 10)) {
      return message.warning("Từ khoá không được dài quá 10 ký tự");
    }
    return setKeywords(filtered);
  };

  return (
    <>
      <div className="mb-4"> </div>
      {/*--------------------------- Tiêu đề ---------------------------*/}
      <h2 className="text-lg font-semibold">Tiêu đề</h2>
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
        <Input
          showCount
          maxLength={100}
          onChange={onChangeTitle}
          spellCheck={false}
          value={title}
          placeholder="Nhập tiêu đề bài viết"
        />
      </div>
      <div className="mt-3"></div>
      {/*--------------------------- Mô tả ---------------------------*/}
      <h2 className="text-lg font-semibold">Mô tả</h2>
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
        <Input.TextArea
          showCount
          maxLength={255}
          onChange={onChangeDescription}
          spellCheck={false}
          value={description}
          rows={4}
          placeholder="Nhập mô tả bài viết"
        />
      </div>
      <div className="mt-3"></div>
      {/*--------------------------- Ảnh nền ---------------------------*/}
      <h2 className="text-lg font-semibold">Ảnh nền</h2>
      <div className="flex gap-4 md:flex-row flex-col">
        <div className="w-32">
          <Image
            src={urlThumbnail || "/image/thumbnail_default.jpg"}
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
              try {
                setLoadingFileUpload(true);
                const response = await uploadImage(
                  options?.action,
                  options?.file
                );
                //console.log("response", response);
                if (options.onSuccess) {
                  options.onSuccess(response, options?.file);
                }
                setLoadingFileUpload(false);
                setUrlThumbnail(response?.data?.data?.url);

                //console.log("response: ", response);
              } catch (error: any) {
                message.open({
                  type: "error",
                  content:
                    error?.response?.data?.message ||
                    "Đã xảy ra lỗi. Vui lòng thử lại",
                  duration: 3,
                });
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
              setUrlThumbnail("");
              const key = urlThumbnail.substring(
                urlThumbnail.lastIndexOf("/") + 1
              );
              // const key = urlThumbnail.split("/").pop() || "";
              const response = await deleteImage(key);
              {
                process.env.NODE_ENV === "development" &&
                  console.log("(dev) deleteImage: ", response);
              }
              return true;
            }}
            fileList={
              urlThumbnail
                ? [
                    {
                      uid: fileUpload?.uid || "-1",
                      name: fileUpload?.name || "thumbnail",
                      status: "done",
                      url: urlThumbnail,
                      preview: urlThumbnail,
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
      </div>
      <div className="mt-8"></div>
      {/*--------------------------- Chủ đề ---------------------------*/}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold mr-3">Chủ đề</h2>
        <p className="text-sm text-slate-500 italic mr-1">Thêm chủ đề</p>
        <Link href="/manage/posts/tag">tại đây</Link>
      </div>
      <SelectTag ref={tagPostRef} />
      <div className="mt-3"></div>
      {/*--------------------------- Keywords ---------------------------*/}
      <Select
        className="w-full sm:w-1/2 lg:w-1/4"
        mode="tags"
        placeholder="Nhập hoặc chọn từ khoá"
        value={keywords}
        maxCount={5} // Giới hạn số lượng chủ đề
        maxTagTextLength={10} // Giới hạn độ dài của thẻ
        onChange={handleChangeKeywords}
        tokenSeparators={[","]}
        options={keywords.map((keyword) => ({ value: keyword }))}
      />
      <div className="mt-2" />
      <span className="text-xs text-gray-500">
        (Tối đa 5 từ khoá, mỗi chủ đề không quá 10 ký tự)
      </span>
      <span className="text-xs text-gray-500">
        <br />
        Nhấn <b>Enter</b> hoặc <b>(dấu phẩy)</b> để thêm từ khoá.
      </span>
      <div className="mt-3"></div>
      {/*--------------------------- Trạng Thái ---------------------------*/}
      <h2 className="text-lg font-semibold">Trạng thái</h2>
      <Select
        //defaultValue={enumStatusPost.PUBLIC}
        value={statusPost}
        style={{ width: 120 }}
        onChange={handleChangeStatusPost}
        options={[
          { value: enumStatusPost.PUBLIC, label: "Công khai" },
          { value: enumStatusPost.SHARED, label: "Chia sẻ" },
          { value: enumStatusPost.PRIVATE, label: "Riêng tư" },
        ]}
      />
      {/*--------------------------- Ngày đăng ---------------------------*/}
      <div className="mt-3"></div>
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">Ngày đăng</h2>
        <Tooltip title="Nhấn (Ok) để chọn ngày đăng">
          <i className="bi bi-info-circle cursor-pointer hover:text-slate-500 mx-2"></i>
        </Tooltip>
      </div>

      <DatePicker
        //format="HH:mm:ss DD-MM-YYYY"
        format={"HH DD/MM/YYYY"}
        disabledDate={disabledDate}
        //disabledHours={disabledHours}
        // disabledMinutes={disabledMinutes}
        // disabledSeconds={disabledSeconds}
        showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
        onOk={onOkDatePicker}
        onCalendarChange={onCalendarChange}
        lang="vi"
        showNow={false}
        showToday={true}
        //value={dayjs(createdAt ? createdAt : new Date().toISOString())} //dayjs(createdAt) : dayjs(new Date())}
        value={createdAt ? dayjs(createdAt) : ""}
        placeholder="Chọn ngày đăng"
        className="w-full sm:w-auto"
        //chỉnh footer

        //chỉnh tên các tháng
        // Removed unsupported monthNames property
      />

      <div className="mt-3 mb-8"></div>
      {/*--------------------------- Editor ---------------------------*/}
      {/* <div style={{ textAlign: "right" }}>
          <Button onClick={() => setOpen(true)} type="primary">
            Xem thử
          </Button>
        </div> */}
      <div className="mb-4"> </div>
      <SuneEditor ref={sunEditorRef} isShowToc={true} />
      <div className="mb-4"> </div>
      <div className="flex justify-start gap-4">
        <button
          className={clsx(
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            {
              "opacity-50 cursor-not-allowed": isPending,
            }
          )}
          onClick={handleCreatePost}
          disabled={isPending}
        >
          Đăng
        </button>
        <button
          className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setOpen(true)}
        >
          Xem thử
        </button>
      </div>
      <FloatButton.BackTop
        //màu sắc
        type="primary"
      />

      <Modal
        title="Xem trước"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okText="Đóng"
        cancelButtonProps={{
          style: { display: "none" },
        }}
        okType="default"
        width={{
          xs: "90%",
          sm: "90%",
          md: "90%",
          lg: "90%",
          xl: "90%",
          xxl: "90%",
        }}
      >
        <div className="p-4 dark:bg-[#0d032d] bg-white">
          <ParseHTML html={sunEditorRef.current?.getHtmlContent()} />
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;
