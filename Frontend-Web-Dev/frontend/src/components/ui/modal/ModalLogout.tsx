"use client";

import { Modal, message } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useLogout from "@/hooks/useLogout.hook";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

import { useAuthContext } from "@/components/auth/auth.provider";

type ModalLogoutProps = {
  isOpen: boolean;
  onClose: () => void;
  isRefresh?: boolean;
  redirectPath?: string;
};

const ModalLogout = (props: ModalLogoutProps) => {
  const queryClient = useQueryClient();
  const { setUserSession } = useAuthContext();
  const router = useRouter();
  const { logout, data, error, isPending } = useLogout();

  useEffect(() => {
    if (error) {
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setUserSession(null);
      queryClient.setQueryData([queryKeys.GET_INFO_USER], null);
      queryClient.setQueryData([queryKeys.ACCOUNT], null);
      message.open({
        type: "success",
        content: "Đăng xuất thành công",
      });
      props.onClose();

      if (props.isRefresh) {
        router.refresh();
      }
      if (props.redirectPath) {
        router.push(props.redirectPath);
      }
    }
  }, [data]);

  const handleOk = () => {
    logout();
  };
  const handleCancel = () => {
    props.onClose();
  };

  //console.log("data", data);
  return (
    <Modal
      title={
        <>
          <div className="text-lg font-bold text-red-500">Đăng xuất</div>
        </>
      }
      //open={data ? false : props.isOpen}
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isPending ? "Đang xử lý..." : "Ok"}
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isPending}
      //centered
    >
      <>
        <div className="text-sm mt-2 text-gray-500">
          Bạn có muốn đăng xuất khỏi tài khoản này không?
        </div>
      </>
    </Modal>
  );
};

export default ModalLogout;
