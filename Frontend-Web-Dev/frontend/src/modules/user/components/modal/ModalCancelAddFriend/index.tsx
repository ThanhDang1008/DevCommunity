"use client";

import { Modal, message, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelFriendRequest } from "@/service/api/user";

type TypeModalCancelAddFriendProps = {
  isOpen: boolean;
  title: React.ReactNode;
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalCancelAddFriend = (props: TypeModalCancelAddFriendProps) => {
  const {
    mutate: cancelFriendRequestMutation,
    isPending: isPendingCancelFriendRequest,
  } = useMutation({
    mutationFn: (data: { receiverId: string }) => cancelFriendRequest(data),
    onSuccess: (data) => {
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
    retry: 3, // Thử lại tối đa 3 lần nếu có lỗi
    retryDelay: 2000, // Thời gian chờ giữa các lần thử lại
  });

  const handleCancelAddFriend = () => {
    if (!props.friendId) {
      message.error("Không tìm thấy người dùng để hủy kết bạn.");
      return;
    }
    cancelFriendRequestMutation({
      receiverId: props.friendId,
    });
  };

  return (
    <Modal
      title={
        <>
          <div className="flex items-center gap-1">
            {props.friendAvatar && (
              <img
                src={props?.friendAvatar}
                alt={props?.friendName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-lg font-semibold">{props.title}</span>
          </div>
        </>
      }
      open={props.isOpen || false}
      onOk={() => {
        handleCancelAddFriend();
        props.onOk?.();
      }}
      onCancel={() => props.onCancel?.()}
      okText={isPendingCancelFriendRequest ? "Đang hủy..." : "Hủy"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingCancelFriendRequest}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="text-gray-500">
        Bạn có chắc chắn muốn hủy lời mời kết bạn với{" "}
        <span className="font-semibold text-purple-500">
          {props.friendName}
        </span>
        ?
      </div>
    </Modal>
  );
};

export { ModalCancelAddFriend };
