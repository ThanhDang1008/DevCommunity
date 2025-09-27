"use client";

import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Theme } from "@/components/ThemeContext";
import clsx from "clsx";
import { useTheme } from "@/components/ThemeContext";

import { sendUpdatePassword } from "@/service/api/mail";
import type { SendUpdatePassword } from "@/service/api/mail/types";

export default function Page() {
  const { theme } = useTheme();
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [form] = Form.useForm();

  const { mutate: sendUpdatePasswordMutation, isPending } = useMutation({
    mutationFn: (data: SendUpdatePassword) => sendUpdatePassword(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      form.resetFields();
      message.open({
        type: "success",
        content: "Đặt lại mật khẩu thành công",
        duration: 3,
      });
      return router.push("/");
    },
    onError: (error: any) => {
      {
        process.env.NODE_ENV === "development" && `(dev) Reset Password Error:`,
          error;
      }
      if (error?.response?.status === 401) {
        message.open({
          type: "error",
          content: "Bạn không có quyền truy cập",
          duration: 3,
        });
        return router.push("/");
      }
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
  });

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Tối thiểu 6 ký tự, ít nhất 1 chữ cái và 1 số

  const onFinish = async (values: any) => {
    const { password, confirmPassword } = values;
    if (!token) {
      return message.open({
        type: "error",
        content: "Đường dẫn không hợp lệ",
        duration: 3,
      });
    }

    if (password !== confirmPassword) {
      return message.open({
        type: "error",
        content: "Mật khẩu không khớp",
        duration: 3,
      });
    }

    sendUpdatePasswordMutation({
      new_password: password,
      token: token,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    //console.log("Failed:", errorInfo);
    form.resetFields();
    alert("Vui lòng nhập đầy đủ & đúng thông tin");
  };

  useEffect(() => {
    const token = searchParams.get("token");
    //console.log("token", token);
    if (!token) {
      return router.push("/");
    }
    setToken(token);
    router.push(`/auth/reset-password`);
  }, []);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div
        className={clsx(
          "min-h-screen flex items-center justify-center  py-12 px-4",
          "bg-gradient-to-br from-blue-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-800"
        )}
      >
        <div className="max-w-md w-full">
          <div className="rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
            <h2
              className={clsx(
                "text-2xl font-bold text-center mb-2",
                "text-gray-800 dark:text-white"
              )}
            >
              Đặt lại mật khẩu
            </h2>
            <p className="text-center text-sm text-gray-500 mb-8">
              Tạo mật khẩu mới cho tài khoản của bạn
            </p>
            {isClient && (
              <Form
                form={form}
                name="reset_password"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="space-y-6"
                style={{
                  backgroundColor:
                    theme === Theme.LIGHT_MODE ? "#f1f5fb" : "#27272a",
                }}
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới" },
                    {
                      pattern: passwordRegex,
                      message:
                        "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Mật khẩu mới"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu không khớp"));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Xác nhận mật khẩu"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isPending}
                    size="large"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-lg h-12 font-semibold text-white transition-all duration-300"
                  >
                    {isPending ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                  </Button>
                </Form.Item>
              </Form>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
