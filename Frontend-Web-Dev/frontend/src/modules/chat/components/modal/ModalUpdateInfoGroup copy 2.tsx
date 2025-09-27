"use client";

import { Modal, message, Input, Select } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";
import { useGetInfoUser } from "@/modules/user/hooks";

type TypeModalUpdateInfoGroupProps = {
  isOpen: boolean;
  title: React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalUpdateInfoGroup = (props: TypeModalUpdateInfoGroupProps) => {
  const { infoUserInGroup } = useMainChatContext();
  const queryClient = useQueryClient();

  //   const {
  //     mutate: updatePermissionsMutation,
  //     isPending: isPendingUpdatePermissions,
  //   } = useMutation({
  //     mutationFn: (data: {
  //       groupId: string;
  //       userId: string;
  //       permissions: TypePermissionsParticipant;
  //       role: TypeRoleParticipants;
  //     }) => updatePermissions(data),
  //     onSuccess: (data) => {
  //       message.success("Cập nhật quyền thành công");
  //       queryClient.invalidateQueries({
  //         queryKey: [queryKeys.CHAT_GROUP_DETAIL, props.groupId],
  //       });
  //       props.onOk?.();
  //     },
  //     onError: (error: any) => {
  //       message.error(
  //         error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
  //       );
  //     },
  //   });

  //   const handleUpdatePermissions = () => {

  //   };
  return (
    <Modal
      title={props.title}
      open={props.isOpen || false}
      onOk={() => {
        //handleUpdatePermissions();
      }}
      onCancel={() => props.onCancel?.()}
      okText="Cập nhật"
      cancelText="Đóng"
      okType="primary"
      //   confirmLoading={
      //     isPendingUpdatePermissions
      // }
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tên nhóm
          </label>
          <Input
            placeholder="Nhập tên nhóm"
            className="mt-1"
            defaultValue={""}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mô tả nhóm
          </label>
          <Input.TextArea
            placeholder="Nhập mô tả nhóm"
            className="mt-1"
            defaultValue={""}
            disabled
          />
        </div>
      </div>
    </Modal>
  );
};

export { ModalUpdateInfoGroup };
