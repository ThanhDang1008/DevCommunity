"use client";

import { Modal, message, Input } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { useGetInfoUser } from "@/modules/user/hooks";

import { joinGroupPublic, joinGroupPrivate } from "@/service/api/chat";

type TypeModalJoinChatGroupProps = {
  isOpen: boolean;
  title: React.ReactNode;
  isPublic: boolean;
  groupId: string;
  joinQuestions: string[];
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalJoinChatGroup = (props: TypeModalJoinChatGroupProps) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetInfoUser();
  const [requestAnswer, setRequestAnswer] = useState<string>(
    `Xin chào, tôi là ${userInfo?.fullname || ""}. Tôi muốn tham gia nhóm này.`
  );

  const {
    mutate: joinGroupPublicMutation,
    isPending: isPendingJoinGroupPublic,
  } = useMutation({
    mutationFn: () => joinGroupPublic(props.groupId),
    onSuccess: (data) => {
      message.success("Tham gia nhóm thành công");
      // queryClient.invalidateQueries({
      //   queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
      // });
      queryClient.fetchQuery({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
        gcTime: 1000 * 60 * 30, // Thời gian xoá cache khi không sử dụng
        retry: 3,
        retryDelay: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP_COMMUNITY],
      });
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
  });

  const {
    mutate: joinGroupPrivateMutation,
    isPending: isPendingJoinGroupPrivate,
  } = useMutation({
    mutationFn: () =>
      joinGroupPrivate({
        groupId: props.groupId,
        requestMessage: requestAnswer,
        requestType: "JOIN",
        invitedBy: null,
      }),
    onSuccess: (data) => {
      message.success("Yêu cầu tham gia nhóm đã được gửi");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP_COMMUNITY],
      });
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
  });

  const hanndleJoinGroup = () => {
    if (props.isPublic) {
      joinGroupPublicMutation();
    } else {
      if (!requestAnswer.trim()) {
        message.error("Vui lòng nhập lời nhắn để tham gia nhóm");
        return;
      }
      joinGroupPrivateMutation();
    }
  };
  return (
    <Modal
      title={props.title}
      open={props.isOpen || false}
      onOk={() => {
        hanndleJoinGroup();
      }}
      onCancel={() => props.onCancel?.()}
      okText={"Tham gia"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={
        props.isPublic ? isPendingJoinGroupPublic : isPendingJoinGroupPrivate
      }
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <span className="text-gray-500">
        {props.isPublic
          ? "Bạn có thể tham gia nhóm này mà không cần phê duyệt"
          : "Bạn cần gửi yêu cầu tham gia nhóm này và chờ phê duyệt"}
      </span>
      {props.joinQuestions.length > 0 && !props.isPublic && (
        <div className="mt-4">
          <span className="text-gray-500">Trả lời câu hỏi sau:</span>
          <ul className="list-disc pl-5 mt-2">
            {props.joinQuestions.map((question, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300">
                {question}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!props.isPublic && (
        <Input.TextArea
          showCount
          maxLength={255}
          onChange={(e) => setRequestAnswer(e.target.value)}
          spellCheck={false}
          value={requestAnswer}
          rows={4}
          className="mb-4 mt-2"
          placeholder={"Nhập lời nhắn của bạn để tham gia nhóm"}
        />
      )}
    </Modal>
  );
};

export { ModalJoinChatGroup };
