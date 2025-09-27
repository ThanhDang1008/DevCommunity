"use client";

import { Modal, message, Input, Select } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Crop } from "lucide-react";
import { queryKeys } from "@/constants/Common";

import { ModalUpload } from "@/modules/file/ModalUpload";
import type { IGroupConversations } from "@/service/api/chat/types/GroupConversations";

import { useMainChatContext } from "@/modules/chat/components/chatGroups/MainChat";
import { useGetInfoUser } from "@/modules/user/hooks";
import { updateInfoGroup } from "@/service/api/chat";

type TypeModalUpdateInfoGroupProps = {
  isOpen: boolean;
  title: React.ReactNode;
  infoGroup: IGroupConversations | undefined;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalUpdateInfoGroup = (props: TypeModalUpdateInfoGroupProps) => {
  const { infoUserInGroup } = useMainChatContext();
  const queryClient = useQueryClient();
  const [isOpenModalUpload, setIsOpenModalUpload] = useState(false);
  const [linkAvatar, setLinkAvatar] = useState<string>(
    props.infoGroup?.avatar || ""
  );
  const [groupName, setGroupName] = useState<string>(
    props.infoGroup?.title || ""
  );
  const [groupDescription, setGroupDescription] = useState<string>(
    props.infoGroup?.description || ""
  );

  const {
    mutate: updateInfoGroupMutation,
    isPending: isPendingUpdateInfoGroup,
  } = useMutation({
    mutationFn: (data: {
      groupId: string;
      title?: string;
      description?: string;
      avatar?: string;
      topics?: string[];
    }) => updateInfoGroup(data),
    onSuccess: (data) => {
      message.success("Cập nhật thông tin nhóm thành công");
      queryClient.invalidateQueries({
        queryKey: [queryKeys.CHAT_GROUP_DETAIL, props.infoGroup?._id],
      });
      props.onOk?.();
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    },
  });

  const handleUpdateInfoGroup = () => {
    if (!props.infoGroup?._id) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
      return;
    }

    if (groupName.trim() === "") {
      message.error("Tên nhóm không được để trống");
      return;
    }
    updateInfoGroupMutation({
      groupId: props.infoGroup._id,
      title: groupName,
      description: groupDescription,
      avatar: linkAvatar,
      topics: [],
    });
  };
  return (
    <>
      <Modal
        title={props.title}
        open={props.isOpen || false}
        onOk={() => {
          handleUpdateInfoGroup();
        }}
        onCancel={() => props.onCancel?.()}
        okText="Cập nhật"
        cancelText="Đóng"
        okType="primary"
        confirmLoading={isPendingUpdateInfoGroup}
        //cancelButtonProps={{ style: { display: "none" } }}
      >
        <div className="space-y-4">
          <div>
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 rounded-full shadow-lg bg-gray-200 dark:bg-zinc-700 flex items-center justify-center">
                <img
                  src={linkAvatar || "/image/group_chat_default.png"}
                  alt="Group Avatar"
                  className={clsx(
                    "w-full h-full object-cover absolute z-0 overflow-hidden rounded-full",
                    "hover:scale-110 transition-transform duration-200 cursor-pointer"
                  )}
                />
                {/* Edit Avatar Button */}
                <button
                  className={clsx(
                    "absolute z-10 -bottom-1 -right-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full p-1 shadow hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                  )}
                  title="Sửa ảnh nhóm"
                  onClick={() => {
                    setIsOpenModalUpload(true);
                  }}
                  type="button"
                >
                  <Crop className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            </div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tên nhóm
            </label>
            <Input
              placeholder="Nhập tên nhóm"
              className="mt-1"
              defaultValue={groupName}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mô tả nhóm
            </label>
            <Input.TextArea
              placeholder="Nhập mô tả nhóm"
              className="mt-1"
              defaultValue={groupDescription}
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
            />
          </div>
        </div>
      </Modal>
      <ModalUpload
        isOpen={isOpenModalUpload}
        title="Tải lên ảnh đại diện nhóm"
        maxSize={10}
        allowedFileTypes={[
          "image/png",
          "image/jpg",
          "image/jpeg",
          "image/gif",
          "image/svg+xml",
          "image/webp",
        ]}
        onCancel={() => {
          setIsOpenModalUpload(false);
        }}
        onUploadSuccess={(url: string) => {}}
        onOk={(data) => {
          setLinkAvatar(data?.urlFile || "");
          //console.log("data", data);
          //setIsOpenModalUpload(false);
        }}
        onUploadError={(error: any) => {
          message.error("Tải lên ảnh thất bại");
        }}
        okText={"Ok"}
        disabledOkButton={false}
        okType="primary"
      >
        <p className="ant-upload-drag-icon text-3xl">
          <i className="bi bi-card-image"></i>
        </p>
        <p className="ant-upload-text">Nhấn hoặc kéo thả ảnh vào đây</p>
      </ModalUpload>
    </>
  );
};

export { ModalUpdateInfoGroup };
