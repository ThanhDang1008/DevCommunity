"use client";

import { Modal, message, } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { useRouter } from 'next/navigation';

import { leaveGroup } from "@/service/api/chat";

type TypeModalLeaveGroupProps = {
  isOpen: boolean;
  title: React.ReactNode;
  groupId: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalLeaveGroup = (props: TypeModalLeaveGroupProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: leaveGroupMutation, isPending: isPendingLeaveGroup } =
    useMutation({
      mutationFn: (data: { groupId: string }) => leaveGroup(data.groupId),
      onSuccess: (data) => {
        message.success("Rời nhóm thành công");
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_ALL_CHAT_GROUP_COMMUNITY],
        });
        router.push('/manage/chat/group');
        props.onOk?.();
      },
      onError: (error: any) => {
        message.error(
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
        );
      },
    });

  const handleLeaveGroup = () => {
    leaveGroupMutation({ groupId: props.groupId });
  };
  return (
    <Modal
      title={props.title}
      open={props.isOpen || false}
      onOk={() => {
        handleLeaveGroup();
      }}
      onCancel={() => props.onCancel?.()}
      okText="Rời nhóm"
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingLeaveGroup}
      //cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ danger: true }}
    >
      <p>Bạn có chắc chắn muốn rời nhóm này không?</p>
    </Modal>
  );
};

export { ModalLeaveGroup };
