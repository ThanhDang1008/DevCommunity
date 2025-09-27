"use client";

import { Modal, message, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";
import { addFriend } from "@/service/api/user";

type TypeModalAddFriendProps = {
  isOpen: boolean;
  title: React.ReactNode;
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalAddFriend = (props: TypeModalAddFriendProps) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetInfoUser();
  const [messageRequest, setMessageRequest] = useState<string>(
    `Xin chào${
      userInfo?.fullname ? `, tôi là ${userInfo?.fullname}` : ""
    }. Tôi muốn kết bạn với bạn.`
  );

  const { mutate: addFriendMutation, isPending: isPendingAddFriend } =
    useMutation({
      mutationFn: (data: { friendId: string; message?: string }) =>
        addFriend(data),
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

  const handleAddFriend = () => {
    if (!props.friendId) {
      message.error("Không tìm thấy người dùng để kết bạn.");
      return;
    }
    addFriendMutation({
      friendId: props.friendId,
      message: messageRequest,
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
            )}{" "}
            <span>{props.title} cho</span>
            <span className="text-purple-500 font-semibold">
              {props?.friendName}
            </span>
          </div>
        </>
      }
      open={props.isOpen || false}
      onOk={() => {
        handleAddFriend();
        props.onOk?.();
      }}
      onCancel={() => props.onCancel?.()}
      okText={isPendingAddFriend ? "Đang gửi..." : "Gửi"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingAddFriend}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <Input.TextArea
        showCount
        maxLength={255}
        onChange={(e) => setMessageRequest(e.target.value)}
        spellCheck={false}
        value={messageRequest}
        rows={4}
        className="mb-4 mt-2"
        placeholder={"Nhập lời nhắn của bạn"}
      />
    </Modal>
  );
};

export { ModalAddFriend };
