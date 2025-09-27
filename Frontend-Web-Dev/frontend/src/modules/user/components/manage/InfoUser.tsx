"use client";

import { Form, Input, Button, message, Image } from "antd";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {Theme ,useTheme} from "@/components/ThemeContext";
import { getInfoUser, updateInfoUser } from "@/service/api/user";
import type { DataUpdateUser } from "@/service/api/user/types";
import { queryKeys } from "@/constants/Common";
import ModalUpload from "@modules/file/ModalUpload";

type FormValues = {
  fullname: string;
  email: string;
};

const InfoUser = () => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isUpate, setIsUpdate] = useState(false);
  const [isOpenModalUpload, setIsOpenModalUpload] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  //--------------------------------------------------
  const {
    data: infoUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_INFO_USER],
    queryFn: () => getInfoUser(),
    gcTime: 1000 * 60 * 60, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (infoUser?.data?.data) {
      form.setFieldsValue({
        fullname: infoUser?.data?.data?.fullname,
        email: infoUser?.data?.data?.email,
      });
    }
  }, [infoUser, form]);

  //--------------------------------------------------
  const { mutate: updateInfoUserMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: (data: DataUpdateUser) => updateInfoUser(data),
      onSuccess: (data) => {
        message.open({
          type: "success",
          content: "Cập nhật thành công",
        });

        setIsUpdate(false);
        form.resetFields();
        //Invalidate the query to refetch data
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_INFO_USER],
        });
      },
      onError: (error: any) => {
        message.open({
          type: "error",
          content:
            error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
          duration: 3,
        });
      },
      retry: 3,
      retryDelay: 2000,
    });

  //--------------------------------------------------

  const onFinish = (values: FormValues) => {
    //console.log("Submitted:", values);

    //---------------------------------
    
    //---------------------------------
    const { email, ...dataUpdate } = values;
    updateInfoUserMutation({
      ...dataUpdate,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    //console.log("Failed:", errorInfo);
    alert("Vui lòng nhập đầy đủ & đúng thông tin");
  };

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h1>

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          fullname: infoUser?.data?.data?.fullname || "(đang tải...)",
          email: infoUser?.data?.data?.email || "(đang tải...)",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="bg-white p-6 space-y-6"
        wrapperCol={{ span: 14 }}
        style={{
          backgroundColor: theme === Theme.DARK_MODE ? "#18181b" : "#f8fafc",
        }}
      >
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Image
            src={infoUser?.data?.data?.avatar}
            alt="Ảnh đại diện"
            width={80}
            height={80}
            className="rounded-full object-cover border"
          />
          {/* <Form.Item
            name="avatar"
            label="Ảnh đại diện (URL)"
            rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
            className="flex-1"
          >
            <Input onChange={(e) => setAvatarUrl(e.target.value)} />
          </Form.Item> */}
          <Button
            disabled={!isUpate}
            onClick={() => {
              setIsOpenModalUpload(true);
            }}
          >
            Tải lên ảnh
          </Button>
        </div>

        {/* Họ tên */}
        <Form.Item
          name="fullname"
          label="Họ tên"
          rules={[
            { required: true, message: "Vui lòng nhập tên" },
            { min: 3, message: "Tên quá ngắn" },
            { max: 50, message: "Tên quá dài" },
          ]}
        >
          <Input disabled={!isUpate} spellCheck={false} />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <Button
            className="mb-2 md:mr-2 w-full md:w-auto"
            type="default"
            onClick={() => {
              setIsUpdate(!isUpate);
              form.resetFields();
            }}
          >
            {isUpate ? "Hủy" : "Sửa thông tin"}
          </Button>
          <Button
            disabled={!isUpate || isPendingUpdate}
            className="w-full md:w-auto"
            type="primary"
            htmlType="submit"
          >
            {isPendingUpdate ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </Form.Item>
      </Form>

      <ModalUpload
        isOpen={isOpenModalUpload}
        title="Tải lên ảnh đại diện"
        maxSize={10}
        allowedFileTypes={[
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/gif",
          "image/svg+xml",
          "image/webp",
        ]}
        onCancel={() => {
          setIsOpenModalUpload(false);
        }}
        onUploadSuccess={(url: string) => {
          //console.log("url", url);
          setAvatarUrl(url);
        }}
        onOk={() => {
          if (!avatarUrl) {
            message.error("Vui lòng tải lên ảnh");
            return;
          }
          updateInfoUserMutation({
            avatar: avatarUrl,
          });
          setIsOpenModalUpload(false);
        }}
        onUploadError={(error: any) => {
          //console.log("error", error);
          message.error("Tải lên ảnh thất bại");
        }}
        okText={isPendingUpdate ? "Đang cập nhật..." : "Cập nhật"}
        disabledOkButton={isPendingUpdate}
        okType="primary"
      >
        <p className="ant-upload-drag-icon text-3xl">
          <i className="bi bi-card-image"></i>
        </p>
        <p className="ant-upload-text">Nhấn hoặc kéo thả ảnh vào đây</p>
      </ModalUpload>
    </>
  );
};

export default InfoUser;
