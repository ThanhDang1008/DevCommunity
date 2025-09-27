"use client";

import { message } from "antd";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import clsx from "clsx";

import { PageAdmin } from "../_components/page-admin";
import { queryKeys } from "@/constants/Common";
import { sendMailResetPassword } from "@/service/api/mail";
import type { SendResetPassword } from "@/service/api/mail/types";
import { URL } from "@/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";

export default function Page() {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetInfoUser();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: sendMailMutation, isPending } = useMutation({
    mutationFn: (data: SendResetPassword) => sendMailResetPassword(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      setIsSubmitted(true);
      return message.open({
        type: "success",
        content: "Gửi email thành công",
        duration: 3,
      });
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

  const handleSendResetPassword = () => {
    //console.log(account);

    const email = userInfo?.email;
    const name = "bạn";
    const url_service = URL;
    const name_service = "minwandev.io.vn";
    if (!email || !url_service) {
      return message.open({
        type: "error",
        content: "Lỗi hệ thống, vui lòng thử lại sau",
        duration: 3,
      });
    }
    sendMailMutation({
      email: email,
      name: name,
      url_service: url_service,
      name_service: name_service,
    });
  };
  return (
    <PageAdmin>
      <div className="h-screen flex items-center justify-center">
        <div
          className={clsx(
            "p-8 rounded-lg shadow-md w-full max-w-md",
            "bg-slate-50 dark:bg-slate-800"
          )}
        >
          {isSubmitted ? (
            // Thông báo thành công
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Kiểm Tra Email Của Bạn
              </h2>
              <p className="text-gray-600 mb-4">
                Chúng tôi đã gửi một liên kết đặt lại mật khẩu đến{" "}
                <span className="font-semibold text-cyan-600">
                  {userInfo?.email}
                </span>
                . Vui lòng kiểm tra hộp thư đến (và thư mục spam/rác) để tìm
                email.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Đặt Lại Mật Khẩu
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu
                  trong email của bạn đã đăng ký.
                </p>
              </div>
              <button
                onClick={() => {
                  handleSendResetPassword();
                }}
                className={clsx(
                  "w-full bg-cyan-500 text-white p-3 rounded-lg transition",
                  {
                    "hover:bg-cyan-600": !isPending,
                    "bg-gray-400 cursor-not-allowed": isPending,
                  }
                )}
                disabled={isPending}
              >
                {isPending ? "Đang Gửi..." : "Gửi"}
              </button>
            </>
          )}
        </div>
      </div>
    </PageAdmin>
  );
}
