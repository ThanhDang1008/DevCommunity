"use client";

import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const { Paragraph, Text } = Typography;

function ErrorPage() {
  const router = useRouter();
  return (
    <>
      <div
        className={clsx(
          "flex flex-col items-center justify-center h-screen w-full",
          "bg-white dark:bg-zinc-900"
        )}
      >
        <Result
          status="error"
          title="Đăng nhập thất bại"
          subTitle="Vui lòng kiểm tra lại thông tin đăng nhập của bạn hoặc thử lại sau."
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                router.push("/");
              }}
            >
              Trang chủ
            </Button>,
          ]}
        >
          {/* <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              Lý do đăng nhập thất bại:
            </Text>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Tài
            khoản của bạn không nằm trong tổ chức của trường{" "}
            <a>Liên hệ với quản trị viên &gt;</a>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Tài
            khoản của bạn đã bị khóa <a>Liên hệ với quản trị viên &gt;</a>
          </Paragraph>
          <Paragraph>
            <CloseCircleOutlined className="site-result-demo-error-icon" /> Hệ
            thống đang bảo trì
          </Paragraph>
        </div> */}
        </Result>
      </div>
    </>
  );
}

export default ErrorPage;
