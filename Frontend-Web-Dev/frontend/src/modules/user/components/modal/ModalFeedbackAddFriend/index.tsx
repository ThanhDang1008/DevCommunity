"use client";

import { Modal, message, Input } from "antd";
import { useMutation} from "@tanstack/react-query";
import clsx from "clsx";

import { feedbackFriendRequest } from "@/service/api/user";

import type { TypeFriendRequestStatus } from "@/service/api/user/types/FriendRequests";

type TypeModalFeedbackAddFriendProps = {
  isOpen: boolean;
  requestId: string; // ID của yêu cầu kết bạn
  accepted: boolean; // Trạng thái chấp nhận hay từ chối
  friendId?: string;
  friendName?: string;
  friendAvatar?: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalFeedbackAddFriend = (props: TypeModalFeedbackAddFriendProps) => {
  const {
    mutate: feedbackAddFriendMutation,
    isPending: isPendingFeedbackAddFriend,
  } = useMutation({
    mutationFn: (data: {
      requestId: string;
      status: TypeFriendRequestStatus;
    }) => feedbackFriendRequest(data),
    onSuccess: (data) => {
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
    retry: 3, // Thử lại tối đa 3 lần nếu có lỗi
    retryDelay: 2000, // Thời gian chờ giữa các lần thử lại (2 giây)
  });

  const handleFeedbackAddFriend = () => {
    if (!props.requestId) {
      message.error("Không tìm thấy yêu cầu kết bạn để phản hồi.");
      return;
    }
    feedbackAddFriendMutation({
      requestId: props.requestId,
      status: props.accepted ? "ACCEPTED" : "REJECTED",
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
            <span
              className={clsx(
                "font-semibold text-lg",
                props.accepted ? "text-green-600" : "text-red-600"
              )}
            >
              {props.accepted ? "Xác nhận kết bạn" : "Từ chối kết bạn"}
            </span>
            <span className="text-sm text-gray-500">
              {props.friendName ? `với ${props.friendName}` : ""}
            </span>
          </div>
        </>
      }
      open={props.isOpen || false}
      onOk={() => {
        handleFeedbackAddFriend();
        props.onOk?.();
      }}
      onCancel={() => props.onCancel?.()}
      okText={isPendingFeedbackAddFriend ? "Đang xác nhận..." : "Ok"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingFeedbackAddFriend}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
    </Modal>
  );
};

export { ModalFeedbackAddFriend };
