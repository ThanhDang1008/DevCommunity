"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, message, Tooltip } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Verify from "@/components/puzzle-captcha";
import Link from "next/link";
import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { Theme } from "@/components/ThemeContext";
import { useTheme } from "@/components/ThemeContext";

import { login } from "@/components/auth/actions";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import { queryKeys } from "@/constants/Common";
import { setTokenAuth } from "@/components/auth/TokenAuth";
import { setTokenAuth2 } from "@/components/auth/TokenAuth2";

type FieldType = {
  email: string;
  password: string;
};

enum CaptchaStatus {
  VERIFY_SUCCESS = "VERIFY_SUCCESS",
  NOT_VERIFY = "NOT_VERIFY",
  VERIFYING = "VERIFYING",
}

function LoginForm() {
  const { theme } = useTheme();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [captchaStatus, setCaptchaStatus] = useState<CaptchaStatus>(
    CaptchaStatus.NOT_VERIFY
  );
  const [isOpenCaptcha, setIsOpenCaptcha] = useState<boolean>(false);

  const router = useRouter();
  const queryClient = useQueryClient();
  queryClient.setDefaultOptions({
    queries: {
      gcTime: Number(process.env.NEXT_PUBLIC_TIME_CACHE_ACCOUNT),
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoadingLogin(true);
    const response = await login(values.email, values.password);

    //console.log("Response LoginWithCredentials:", response);
    if (response.status === HttpStatusCode.Ok) {
      setLoadingLogin(false);

      setTokenAuth(response.data?.token || "");
      setTokenAuth2(response.data?.token || "");
      // updateToken(response.data?.token || "");

      // queryClient.invalidateQueries({
      //   queryKey: [queryKeys.GET_INFO_USER],
      // });
      message.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      return router.push("/");
    } else if (
      response.status === HttpStatusCode.BadRequest ||
      response.status === HttpStatusCode.Unauthorized
    ) {
      //Lỗi do người dùng
      message.open({
        type: "error",
        content: response.data?.message || "Đăng nhập thất bại",
      });
      return setLoadingLogin(false);
    } else {
      //Lỗi hệ thống
      message.open({
        type: "error",
        content: response.data?.message || "Đăng nhập thất bại",
      });
      return setLoadingLogin(false);
    }
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: {
    email: string;
    password: string;
  }) => {
    //console.log("Success:", values);
    if (captchaStatus === CaptchaStatus.NOT_VERIFY) {
      setIsOpenCaptcha(true);
      setCaptchaStatus(CaptchaStatus.VERIFYING);
    } else if (captchaStatus === CaptchaStatus.VERIFYING) {
      message.open({
        type: "warning",
        content: "Vui lòng xác thực captcha",
      });
    } else if (captchaStatus === CaptchaStatus.VERIFY_SUCCESS) {
      await handleLogin(values);
      // alert("Đăng nhập thành công");
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    //console.log("Failed:", errorInfo);
    setIsOpenCaptcha(false);
    setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
    alert("Vui lòng nhập đầy đủ & đúng thông tin");
  };

  //-------------------- is client --------------------
  const [isClient, setIsClient] = React.useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  //-------------------- check session (next auth) --------------------
  const { data: session } = useSession();

  useEffect(() => {
    // console.log("session", session);
    if (session?.customToken) {
      setTokenAuth(session?.customToken);
      setTokenAuth2(session?.customToken);
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_INFO_USER],
      });
      message.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      return router.push("/");
    }
  }, [session]);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div
          style={{
            padding: 20,
            borderRadius: 10,
            background:
              theme === Theme.LIGHT_MODE
                ? "linear-gradient(19deg, rgb(250 239 239), rgb(159 208 226 / 74%))"
                : "linear-gradient(19deg, rgb(68 68 68), rgb(0 54 108 / 74%))",
            //"linear-gradient(19deg, rgb(151, 149, 149), rgb(255 240 206 / 74%))",

            boxShadow:
              //"rgb(184 115 115) 33px 27px 51px, rgb(236 36 36) -25px -25px 100px",
              "rgb(115 179 255) 33px 27px 51px, rgb(23 134 234) -25px -25px 100px",
            //filter: "invert(1)",
          }}
          className="w-11/12 md:w-3/5 lg:w-2/4 xl:w-2/5 2xl:w-2/5"
        >
          <h1
            className={clsx("text-3xl text-center ", {
              "text-slate-200": theme === Theme.DARK_MODE,
              "text-zinc-800": theme === Theme.LIGHT_MODE,
            })}
          >
            Đăng nhập
          </h1>
          <br />
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            style={{ width: "100%" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {isClient && (
              <>
                <Form.Item
                  //labelCol={{ span: 24 }}
                  label="Email"
                  name="email"
                  className=""
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email",
                    },
                    {
                      pattern: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g),
                      message: "Email không hợp lệ",
                    },
                    {
                      min: 6,
                      message: "Email phải tối thiểu 6 ký tự",
                    },
                    {
                      max: 100,
                      message: "Email tối đa 100 ký tự",
                    },
                  ]}
                >
                  <Input
                    style={{
                      backgroundColor: "#b698982e",
                      border: "1px solid #c88a8aa8",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  //labelCol={{ span: 24 }}
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    {
                      min: 6,
                      message: "Mật khẩu phải tối thiểu 6 ký tự",
                    },
                    {
                      max: 100,
                      message: "Mật khẩu tối đa 100 ký tự",
                    },
                  ]}
                >
                  <Input.Password
                    style={{
                      backgroundColor: "#b698982e",
                      border: "1px solid #c88a8aa8",
                    }}
                  />
                </Form.Item>
              </>
            )}

            {/* <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 12, offset: 7 },
              }}
              className="text-center sm:text-left"
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loadingLogin}
                className="w-full sm:w-48 md:w-40 lg:w-36 "
                disabled={loadingLogin}
              >
                {loadingLogin ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </Form.Item>
          </Form>
          <div className="mb-3 text-center flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">
              Bạn chưa có tài khoản?
            </span>
            <Link
              href="/auth/register"
              className="text-sm text-blue-500 hover:text-blue-700 transition duration-200 underline"
            >
              Đăng ký
            </Link>
          </div>
          <Verify
            width={280}
            height={80}
            visible={isOpenCaptcha}
            onSuccess={() => {
              //console.log("Verify Success");
              setIsOpenCaptcha(false);
              setCaptchaStatus(CaptchaStatus.VERIFY_SUCCESS);
            }}
            onFail={() => {
              // console.log("Verify Fail");
            }}
            onRefresh={() => {
              // console.log("Verify Refresh");
            }}
          />
          {captchaStatus === CaptchaStatus.VERIFY_SUCCESS && (
            <div className="text-center mt-2 flex items-center justify-center gap-2">
              <span className="text-sm text-green-500">
                Xác thực thành công. Vui lòng nhấn
                <b className="text-green-500"> Đăng nhập </b>
                để tiếp tục
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "15px",
                  height: "15px",
                  border: "2px solid green",
                  borderRadius: "5px",
                }}
              >
                <span style={{ color: "green", fontSize: "0.7rem" }}>✔</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mt-4">
            <div className="border-t border-gray-500 w-full"></div>
            <span className="mx-2 text-gray-500">hoặc</span>
            <div className="border-t border-gray-500 w-full"></div>
          </div>

          <div className="flex justify-center items-center mt-2">
            <div className="flex gap-4 p-4">
              <Tooltip title="Github">
                <div
                  onClick={() => {
                    message.info({
                      content: "Chức năng đang được phát triển",
                    });
                  }}
                  className={clsx(
                    "cursor-pointer hover:opacity-80 transition duration-200 p-2",
                    "border border-gray-500 border-b-violet-700 rounded-md",
                    "shadow-md hover:shadow-lg"
                  )}
                >
                  <i className="bi bi-github text-2xl"></i>
                </div>
              </Tooltip>
              <Tooltip title="Google">
                <div
                  onClick={async () => {
                    signIn("google");
                  }}
                  className={clsx(
                    "cursor-pointer hover:opacity-80 transition duration-200 p-2",
                    "border border-gray-500 border-b-violet-700 rounded-md",
                    "shadow-md hover:shadow-lg"
                  )}
                >
                  {/* <i className="bi bi-google text-2xl"></i> */}
                  <img
                    src="/image/google_logo.webp"
                    alt="Google"
                    className="w-8 h-8"
                  />
                </div>
              </Tooltip>
              <Tooltip title="Facebook">
                <div
                  onClick={() => {
                    message.info({
                      content: "Chức năng đang được phát triển",
                    });
                  }}
                  className={clsx(
                    "cursor-pointer hover:opacity-80 transition duration-200 p-2",
                    "border border-gray-500 border-b-violet-700 rounded-md",
                    "shadow-md hover:shadow-lg"
                  )}
                >
                  {/* <i className="bi bi-facebook text-2xl"></i> */}
                  <img
                    src="/image/facebook_logo.webp"
                    alt="Facebook"
                    className="w-8 h-8"
                  />
                </div>
              </Tooltip>
              <Tooltip title="X">
                <div
                  onClick={() => {
                    message.info({
                      content: "Chức năng đang được phát triển",
                    });
                  }}
                  className={clsx(
                    "cursor-pointer hover:opacity-80 transition duration-200 p-2",
                    "border border-gray-500 border-b-violet-700 rounded-md",
                    "shadow-md hover:shadow-lg"
                  )}
                >
                  {/* <i className="bi bi-facebook text-2xl"></i> */}
                  <img src="/image/x_logo.webp" alt="X" className="w-8 h-8" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
