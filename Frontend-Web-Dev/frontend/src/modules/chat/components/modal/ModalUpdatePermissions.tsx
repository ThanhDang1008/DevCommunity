"use client";

import { Modal, message, Input, Select } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";
import { useGetInfoUser } from "@/modules/user/hooks";

import { updatePermissions } from "@/service/api/chat";

import {
  TypeRoleParticipants,
  TypePermissionsParticipant,
  EnumRoleParticipants,
  EnumPermissionsParticipant,
  IParticipants,
} from "@/service/api/chat/types/GroupConversations";

type TypeModalUpdatePermissionsProps = {
  isOpen: boolean;
  title: React.ReactNode;
  groupId: string;
  participant: IParticipants | null;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalUpdatePermissions = (props: TypeModalUpdatePermissionsProps) => {
  const { infoUserInGroup } = useMainChatContext();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<TypeRoleParticipants>(
    props.participant?.role || EnumRoleParticipants.MEMBER
  );
  const [permissions, setPermissions] = useState<TypePermissionsParticipant>(
    props.participant?.permissions || {
      [EnumPermissionsParticipant.CAN_SEND_MESSAGES]: true,
      [EnumPermissionsParticipant.CAN_SEND_MEDIA]: true,
      [EnumPermissionsParticipant.CAN_SEND_POLLS]: true,
      [EnumPermissionsParticipant.CAN_CHANGE_INFO]: false,
      [EnumPermissionsParticipant.CAN_INVITE_USERS]: false,
      [EnumPermissionsParticipant.CAN_PIN_MESSAGES]: false,
      [EnumPermissionsParticipant.CAN_DELETE_MESSAGES]: false,
      [EnumPermissionsParticipant.CAN_KICK_USERS]: false,
      [EnumPermissionsParticipant.CAN_RESTRICT_MEMBERS]: false,
      [EnumPermissionsParticipant.CAN_PROMOTE_MEMBERS]: false,
    }
  );

  //console.log("selectedRole", selectedRole);
  //console.log("permissions", permissions);

  const PermissionsTranslations = {
    [EnumPermissionsParticipant.CAN_SEND_MESSAGES]: "Gửi tin nhắn",
    [EnumPermissionsParticipant.CAN_SEND_MEDIA]: "Gửi phương tiện",
    [EnumPermissionsParticipant.CAN_SEND_POLLS]: "Gửi cuộc thăm dò",
    [EnumPermissionsParticipant.CAN_CHANGE_INFO]: "Thay đổi thông tin nhóm",
    [EnumPermissionsParticipant.CAN_INVITE_USERS]: "Mời người dùng khác",
    [EnumPermissionsParticipant.CAN_PIN_MESSAGES]: "Ghim tin nhắn",
    [EnumPermissionsParticipant.CAN_DELETE_MESSAGES]: "Xoá tin nhắn",
    [EnumPermissionsParticipant.CAN_KICK_USERS]: "Đá người dùng ra khỏi nhóm",
    [EnumPermissionsParticipant.CAN_RESTRICT_MEMBERS]:
      "Hạn chế quyền thành viên",
    [EnumPermissionsParticipant.CAN_PROMOTE_MEMBERS]: "Thăng chức thành viên",
  };

  const {
    mutate: updatePermissionsMutation,
    isPending: isPendingUpdatePermissions,
  } = useMutation({
    mutationFn: (data: {
      groupId: string;
      userId: string;
      permissions: TypePermissionsParticipant;
      role: TypeRoleParticipants;
    }) => updatePermissions(data),
    onSuccess: (data) => {
      message.success("Cập nhật quyền thành công");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.CHAT_GROUP_DETAIL, props.groupId],
      });
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
  });

  const handleUpdatePermissions = () => {
    if (
      infoUserInGroup?.role !== EnumRoleParticipants.CREATOR &&
      infoUserInGroup?.role !== EnumRoleParticipants.ADMIN
    ) {
      message.error("Bạn không có quyền cập nhật quyền người dùng");
      return;
    }

    if (!infoUserInGroup?.permissions?.can_restrict_members) {
      message.error("Bạn không có quyền cập nhật quyền người dùng");
      return;
    }

    if (!props.participant) {
      message.error("Không tìm thấy người dùng để cập nhật quyền");
      return;
    }
    if (props.groupId.trim() === "") {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
      return;
    }

    updatePermissionsMutation({
      groupId: props.groupId,
      userId: props.participant.userId._id,
      permissions: permissions,
      role: selectedRole,
    });
  };
  return (
    <Modal
      title={props.title}
      open={props.isOpen || false}
      onOk={() => {
        handleUpdatePermissions();
      }}
      onCancel={() => props.onCancel?.()}
      okText="Cập nhật"
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPendingUpdatePermissions}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Vai trò</label>
          <Select
            showSearch
            placeholder="Chọn vai trò"
            optionFilterProp="label"
            value={selectedRole}
            onChange={(value) => {
              setSelectedRole(value as TypeRoleParticipants);
            }}
            options={[
              {
                value: EnumRoleParticipants.CREATOR,
                label: "Người tạo nhóm",
                disabled: true, // Người tạo không thể thay đổi vai trò
              },
              {
                value: EnumRoleParticipants.ADMIN,
                label: "Quản trị viên",
              },
              {
                value: EnumRoleParticipants.MEMBER,
                label: "Thành viên",
              },
            ]}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Phân quyền</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(EnumPermissionsParticipant).map(
                ([key, value]) => (
                  <div key={value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={value}
                      checked={
                        permissions[value as keyof TypePermissionsParticipant]
                      }
                      onChange={(e) => {
                        setPermissions((prev) => ({
                          ...prev,
                          [value]: e.target.checked,
                        }));
                      }}
                    />
                    <label htmlFor={value} className="text-sm">
                      {PermissionsTranslations[
                        value as EnumPermissionsParticipant
                      ] || key.replace(/_/g, " ").toLowerCase()}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ModalUpdatePermissions };
