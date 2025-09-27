"use client";

import { Modal, message, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/Common";
import type { DataType } from "@/modules/user/components/manage/ListUser";
import { deleteUser } from "@/service/api/user";

type TypeModalDeleteUserProps = {
  isOpen: boolean;
  title: React.ReactNode;
  userRecord: DataType;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalDeleteUser = (props: TypeModalDeleteUserProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation, isPending: isPendingDeleteUser } =
    useMutation({
      mutationFn: (data: { id: string }) => deleteUser(data.id),
      onSuccess: (data) => {
        message.success("Xoá người dùng thành công");
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_ALL_USER],
        });
        props.onOk?.();
      },
      onError: (error: any) => {
        message.error(
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
        );
      },
      retry: 1, // Thử lại tối đa 3 lần nếu có lỗi
      retryDelay: 2000, // Thời gian chờ giữa các lần thử lại
    });

  const handleDeleteUser = () => {
    if (!props.userRecord.key) {
      message.error("Đã xảy ra lỗi, không tìm thấy người dùng để xoá.");
      return;
    }
    deleteUserMutation({ id: props?.userRecord?.key });
  };

  return (
    <Modal
      title={
        <>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">{props.title}</span>
          </div>
        </>
      }
      open={props.isOpen || false}
      onOk={() => {
        handleDeleteUser();
      }}
      onCancel={() => props.onCancel?.()}
      okText={"Xoá"}
      cancelText="Đóng"
      okType="primary"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isPendingDeleteUser}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="space-y-1">
        <p className="text-gray-700 dark:text-gray-300">
          Bạn có chắc chắn muốn xoá người dùng{" "}
          <span className="font-semibold text-red-500">
            {props.userRecord.fullname}
          </span>
          ?
        </p>
        <p className="text-gray-500 italic">
          Việc xoá người dùng sẽ không thể hoàn tác. Vui lòng xác nhận trước khi
          tiếp tục.
        </p>
      </div>
    </Modal>
  );
};

export { ModalDeleteUser };
