"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import clsx from "clsx";
import {
  Eye,
  EyeOff,
  X,
  Mail,
  Lock,
  Github,
  Chrome,
  Facebook,
  Linkedin,
  Gitlab,
  Twitter,
} from "lucide-react";
import { signIn } from "next-auth/react";
import type { FormProps } from "antd";
import { Form, Input, message, Tooltip } from "antd";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import useClient from "@/hooks/useClient.hook";
import Verify from "@/components/puzzle-captcha";
import { login } from "@/components/auth/actions";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import { queryKeys } from "@/constants/Common";
import { setTokenAuth } from "@/components/auth/TokenAuth";
import { setTokenAuth2 } from "@/components/auth/TokenAuth2";
import { useAuthContext } from "@/components/auth/auth.provider";
import { sendMailRegister } from "@/service/api/mail";
import { getInfoUser } from "@/service/api/user";
import { URL } from "@/constants/Common";

type LoginModalProps = {
  isOpen: boolean;
  onClose?: () => void;
};

type FieldType = {
  email: string;
  password: string;
};

enum CaptchaStatus {
  VERIFY_SUCCESS = "VERIFY_SUCCESS",
  NOT_VERIFY = "NOT_VERIFY",
  VERIFYING = "VERIFYING",
  VERIFY_FAIL = "VERIFY_FAIL",
}

export default function LoginModal(props: LoginModalProps) {
  const { setUserSession } = useAuthContext();
  const { isClient } = useClient();
  const [form] = Form.useForm<FieldType>();
  const [formSignUp] = Form.useForm<FieldType>();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [captchaStatus, setCaptchaStatus] = useState<CaptchaStatus>(
    CaptchaStatus.NOT_VERIFY
  );
  const [isOpenCaptcha, setIsOpenCaptcha] = useState<boolean>(false);

  const queryClient = useQueryClient();
  queryClient.setDefaultOptions({
    queries: {
      gcTime: Number(process.env.NEXT_PUBLIC_TIME_CACHE_ACCOUNT),
    },
  });

  //   const handleSubmit = (e: React.FormEvent) => {};

  const handleCloseModal = () => {
    props.onClose?.();
    setIsSignUp(false);
    setLoadingLogin(false);
    setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
    setIsOpenCaptcha(false);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const inputVariants = {
    focused: { scale: 1.02 },
    unfocused: { scale: 1 },
  };

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
      queryClient.fetchQuery({
        queryKey: [queryKeys.GET_INFO_USER],
        queryFn: () => getInfoUser(),
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 0,
        retryDelay: 2000,
      });
      setUserSession({
        statusCode: response.status,
        role: response?.data?.data?.id_role?.role || "GUEST",
        userId: response?.data?.data?.id_user || "",
        sessionId: response?.data?.data?.session_id || "",
      });

      message.open({
        type: "success",
        content: "Đăng nhập thành công",
      });
      return handleCloseModal();
    } else if (
      response.status === HttpStatusCode.BadRequest ||
      response.status === HttpStatusCode.Unauthorized
    ) {
      form.resetFields();
      setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
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
    if (
      captchaStatus === CaptchaStatus.NOT_VERIFY ||
      captchaStatus === CaptchaStatus.VERIFY_FAIL
    ) {
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

  //-----------------------------------------------

  const {
    mutate: sendMailRegisterMutation,
    isPending: isPendingSendMailRegister,
  } = useMutation({
    mutationFn: (data: {
      email: string;
      name: string;
      url_service: string;
      name_service: string;
    }) => sendMailRegister(data),
    onSuccess: (data) => {
      formSignUp.resetFields();
      setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
      setIsOpenCaptcha(false);
      message.open({
        type: "success",
        content: "Đăng ký thành công, vui lòng kiểm tra email để xác nhận",
        duration: 3,
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
    retry: 0,
    retryDelay: 2000,
  });

  const handleSignUp = (email: string) => {
    const data = {
      email: email,
      name: "Devlogik User",
      url_service: URL as string,
      name_service: "Devlogik",
    };

    sendMailRegisterMutation(data);
  };

  const onFinishFailedSignUp: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    //console.log("Failed Sign Up:", errorInfo);
    setIsOpenCaptcha(false);
    setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
    alert("Vui lòng nhập email để đăng ký");
  };

  const onFinishSignUp: FormProps<FieldType>["onFinish"] = async (values: {
    email: string;
  }) => {
    //console.log("Success:", values);
    if (
      captchaStatus === CaptchaStatus.NOT_VERIFY ||
      captchaStatus === CaptchaStatus.VERIFY_FAIL
    ) {
      setIsOpenCaptcha(true);
      setCaptchaStatus(CaptchaStatus.VERIFYING);
    } else if (captchaStatus === CaptchaStatus.VERIFYING) {
      message.open({
        type: "warning",
        content: "Vui lòng xác thực captcha",
      });
    } else if (captchaStatus === CaptchaStatus.VERIFY_SUCCESS) {
      //alert("Đăng ký thành công, vui lòng kiểm tra email để xác nhận");
      handleSignUp(values.email);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {props.isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={clsx(
              // Tăng z-index cao hơn và đảm bảo positioning đúng
              "fixed inset-0 z-[9999] flex items-center justify-center p-4",
              "bg-black/50 backdrop-blur-sm",
              // Đảm bảo modal luôn ở giữa màn hình
              "min-h-screen w-full"
            )}
            onClick={() => {
              handleCloseModal();
            }}
            // Ngăn scroll khi modal mở
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                "relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden",
                "bg-white dark:bg-gray-900",
                "border border-gray-200 dark:border-gray-700",
                // Đảm bảo modal không bị ảnh hưởng bởi các element khác
                "z-10"
              )}
              // Đảm bảo modal luôn ở giữa
              style={{
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10" />

              {/* Close Button */}
              <button
                onClick={() => handleCloseModal()}
                className="absolute top-4 right-4 z-20 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="custom-scrollbar-sidebar relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Lock className="text-white" size={24} />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {isSignUp ? "Tạo tài khoản" : "Chào mừng trở lại Devlogik"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isSignUp
                      ? "Tạo tài khoản mới để bắt đầu"
                      : "Đăng nhập để tiếp tục"}
                  </p>
                </div>

                <div className="space-y-6">
                  {!isSignUp && (
                    <Form
                      form={form}
                      name="basic"
                      labelCol={{ span: 5 }} // duy trì khoảng cách giữa label và input
                      wrapperCol={{ span: 24 }} // duy trì khoảng cách giữa label và input
                      style={{ width: "100%" }}
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      {isClient && (
                        <>
                          <Form.Item
                            labelCol={{ span: 6 }}
                            label="Email"
                            name="email"
                            className=""
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập email",
                              },
                              {
                                pattern: new RegExp(
                                  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                                ),
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
                              className="h-9"
                            />
                          </Form.Item>
                          <Form.Item
                            labelCol={{ span: 6 }}
                            label="Mật khẩu"
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập mật khẩu",
                              },
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
                              className="h-9"
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
                          sm: { span: 24, offset: 6 },
                        }}
                        className="text-center sm:text-left"
                      >
                        {/* <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingLogin}
                        className="w-full sm:w-48 md:w-40 lg:w-36 "
                        disabled={loadingLogin}
                      >
                        {loadingLogin ? "Đang xử lý..." : "Đăng nhập"}
                      </Button> */}
                        <motion.button
                          type="submit"
                          disabled={loadingLogin}
                          //onClick={handleSubmit}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            "w-full mt-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200",
                            "bg-gradient-to-r from-blue-600 to-purple-600",
                            "hover:from-blue-700 hover:to-purple-700",
                            "text-white shadow-lg hover:shadow-xl",
                            //"focus:ring-4 focus:ring-blue-500/50"
                            {
                              "cursor-not-allowed": loadingLogin,
                            }
                          )}
                        >
                          {loadingLogin ? "Đang xử lý..." : "Đăng nhập"}
                        </motion.button>
                      </Form.Item>
                    </Form>
                  )}
                  {isSignUp && (
                    <Form
                      form={formSignUp}
                      name="basic"
                      labelCol={{ span: 5 }} // duy trì khoảng cách giữa label và input
                      wrapperCol={{ span: 24 }} // duy trì khoảng cách giữa label và input
                      style={{ width: "100%" }}
                      initialValues={{ remember: true }}
                      onFinish={onFinishSignUp}
                      onFinishFailed={onFinishFailedSignUp}
                      autoComplete="off"
                    >
                      {isClient && (
                        <>
                          <Form.Item
                            labelCol={{ span: 6 }}
                            label="Email"
                            name="email"
                            className=""
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập email",
                              },
                              {
                                pattern: new RegExp(
                                  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
                                ),
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
                              className="h-9"
                            />
                          </Form.Item>
                        </>
                      )}

                      <Form.Item
                        wrapperCol={{
                          xs: { span: 24, offset: 0 },
                          sm: { span: 24, offset: 6 },
                        }}
                        className="text-center sm:text-left"
                      >
                        <motion.button
                          type="submit"
                          disabled={isPendingSendMailRegister}
                          //onClick={handleSubmit}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={clsx(
                            "w-full mt-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200",
                            "bg-gradient-to-r from-blue-600 to-purple-600",
                            "hover:from-blue-700 hover:to-purple-700",
                            "text-white shadow-lg hover:shadow-xl",
                            //"focus:ring-4 focus:ring-blue-500/50"
                            {
                              "cursor-not-allowed": isPendingSendMailRegister,
                            }
                          )}
                        >
                          {isPendingSendMailRegister
                            ? "Đang xử lý..."
                            : "Gửi yêu cầu"}
                        </motion.button>
                      </Form.Item>
                    </Form>
                  )}
                  {/* Remember Me & Forgot Password */}
                  {/* {!isSignUp && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Ghi nhớ đăng nhập
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>
                  )} */}
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
                    form.resetFields();
                    setIsOpenCaptcha(false);
                    setCaptchaStatus(CaptchaStatus.VERIFY_FAIL);
                  }}
                  onRefresh={() => {
                    // console.log("Verify Refresh");
                  }}
                />

                {captchaStatus === CaptchaStatus.VERIFY_SUCCESS && (
                  <div className="text-center mt-2 flex items-center justify-center gap-2">
                    <span className="text-sm text-green-500">
                      Vui lòng nhấn{" "}
                      <b className="text-green-500">
                        {isSignUp ? "Gửi yêu cầu" : "Đăng nhập"}
                      </b>{" "}
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
                      <span style={{ color: "green", fontSize: "0.7rem" }}>
                        ✔
                      </span>
                    </div>
                  </div>
                )}
                {captchaStatus === CaptchaStatus.VERIFY_FAIL && (
                  <div className="text-center mt-2 text-sm text-red-500">
                    Xác thực thất bại, vui lòng thử lại
                  </div>
                )}

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                    Hoặc
                  </span>
                  <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                {/* Social Login */}
                {!isSignUp && (
                  <div className="space-y-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-yellow-400 dark:border-yellow-500",
                        "text-white",
                        "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
                        "hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700",
                        "dark:bg-gradient-to-r dark:from-yellow-500 dark:via-yellow-600 dark:to-yellow-700",
                        "hover:border-yellow-500 dark:hover:border-yellow-600"
                      )}
                      onClick={() => signIn("google")}
                    >
                      <Chrome className="mr-3" size={20} />
                      Tiếp tục với Google
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-gray-800 dark:border-gray-600",
                        "text-white",
                        "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
                        "hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 dark:hover:from-gray-700 dark:hover:via-gray-600 dark:hover:to-gray-500"
                      )}
                      onClick={() => {
                        message.open({
                          type: "info",
                          content:
                            "Chức năng đăng nhập bằng GitHub đang được phát triển",
                          duration: 3,
                        });
                      }}
                    >
                      <Github className="mr-3" size={20} />
                      Tiếp tục với GitHub
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-blue-500 dark:border-blue-600",
                        "text-white",
                        "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900",
                        "hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:via-blue-900 dark:hover:to-blue-950"
                      )}
                      onClick={() => {
                        message.open({
                          type: "info",
                          content:
                            "Chức năng đăng nhập bằng Facebook đang được phát triển",
                          duration: 3,
                        });
                      }}
                    >
                      <Facebook className="mr-3" size={20} />
                      Tiếp tục với Facebook
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-blue-300 dark:border-blue-400",
                        "text-white",
                        "bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600",
                        "hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 dark:hover:from-blue-500 dark:hover:via-blue-600 dark:hover:to-blue-700"
                      )}
                      onClick={() => {
                        message.open({
                          type: "info",
                          content:
                            "Chức năng đăng nhập bằng LinkedIn đang được phát triển",
                          duration: 3,
                        });
                      }}
                    >
                      <Linkedin className="mr-3" size={20} />
                      Tiếp tục với LinkedIn
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-orange-400 dark:border-orange-500",
                        "text-white",
                        "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600",
                        "hover:from-orange-500 hover:via-orange-600 hover:to-orange-700",
                        "dark:bg-gradient-to-r dark:from-orange-500 dark:via-orange-600 dark:to-orange-700",
                        "hover:border-orange-500 dark:hover:border-orange-600"
                      )}
                      onClick={() => {
                        message.open({
                          type: "info",
                          content:
                            "Chức năng đăng nhập bằng GitLab đang được phát triển",
                          duration: 3,
                        });
                      }}
                    >
                      <Gitlab className="mr-3" size={20} />
                      Tiếp tục với GitLab
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={clsx(
                        "w-full flex items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200",
                        "border-gray-900 dark:border-gray-800",
                        "text-white",
                        "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
                        "hover:from-gray-800 hover:via-gray-700 hover:to-gray-600 dark:hover:from-gray-700 dark:hover:via-gray-600 dark:hover:to-gray-500"
                      )}
                      onClick={() => {
                        message.open({
                          type: "info",
                          content:
                            "Chức năng đăng nhập bằng Twitter đang được phát triển",
                          duration: 3,
                        });
                      }}
                    >
                      <Twitter className="mr-3" size={20} />
                      Tiếp tục với Twitter
                    </motion.button>
                  </div>
                )}

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setCaptchaStatus(CaptchaStatus.NOT_VERIFY);
                        setIsOpenCaptcha(false);
                      }}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      {isSignUp ? "Đăng nhập" : "Đăng ký ngay"}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
