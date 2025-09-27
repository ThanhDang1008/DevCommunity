"use client";

import type { TypeCreateChatGroup } from "@/service/api/chat/types/GroupConversations";
import { Modal, message, Input, Select } from "antd";
import { useState } from "react";
import SelectFriends from "@/modules/user/components/Select-Friends";
import { createChatGroup } from "@/service/api/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type ModalCreateChatGroupProps = {
  isOpen: boolean;
  title: string;
  onOk?: () => void;
  onCancel?: () => void;
};

const ModalCreateChatGroup = (props: ModalCreateChatGroupProps) => {
  const queryClient = useQueryClient();
  const [titleChatGroup, setTitleChatGroup] = useState<string>("");
  const [listSelectedFriends, setListSelectedFriends] = useState<
    { userId: string }[]
  >([]);
  const [groupIsPublic, setGroupIsPublic] = useState<boolean>(false);

  const [topics, setTopics] = useState<string[]>([]);
  //console.log("topics", topics);

  const handleChangeTopics = (value: string[]) => {
    const filtered = value.filter(
      (topic) => topic.trim() !== "" && topic.length <= 20
    );
    if (value.some((topic) => topic.trim() === "")) {
      return message.warning("Chủ đề không được để trống");
    }
    if (value.some((topic) => topic.length > 20)) {
      return message.warning("Chủ đề không được dài quá 20 ký tự");
    }
    return setTopics(filtered);
  };
  //console.log("listSelectedFriends", listSelectedFriends);

  const { mutate: createChatGroupMutation, isPending } = useMutation({
    mutationFn: (data: TypeCreateChatGroup) => createChatGroup(data),
    onSuccess: (data) => {
      message.open({
        type: "success",
        content: "Tạo nhóm chat thành công",
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_ALL_CHAT_GROUP_COMMUNITY],
      });
      props.onOk?.();
    },
    onError: (error: any) => {
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
    retry: 3,
    retryDelay: 2000,
  });

  const handleCreateChatGroup = () => {
    if (!titleChatGroup) {
      message.error("Vui lòng nhập tên nhóm chat");
      return;
    }
    if (topics.length === 0) {
      message.error("Vui lòng thêm ít nhất một chủ đề");
      return;
    }
    if (listSelectedFriends.length === 0) {
      message.error("Vui lòng chọn ít nhất một người bạn");
      return;
    }

    createChatGroupMutation({
      title: titleChatGroup,
      members: listSelectedFriends,
      topics: topics,
      isPublic: groupIsPublic,
    });
  };
  return (
    <Modal
      title={props.title}
      open={props.isOpen || false}
      onOk={() => {
        handleCreateChatGroup();
        // props.onOk?.({
        //   title: titleChatGroup,
        //   listSelectedFriends: listSelectedFriends,
        // });
        // setTitleChatGroup("");
        // setListSelectedFriends([]);
      }}
      onCancel={() => props.onCancel?.()}
      okText={isPending ? "Đang tạo nhóm..." : "Tạo nhóm"}
      cancelText="Đóng"
      okType="primary"
      confirmLoading={isPending}
      //cancelButtonProps={{ style: { display: "none" } }}
    >
      <Input
        showCount
        maxLength={100}
        onChange={(e) => {
          setTitleChatGroup(e.target.value);
        }}
        spellCheck={false}
        value={titleChatGroup}
        placeholder="Tên nhóm chat"
        autoFocus
      />
      <div className="mt-4" />
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Nhập hoặc chọn chủ đề"
        value={topics}
        maxCount={5} // Giới hạn số lượng chủ đề
        maxTagTextLength={10} // Giới hạn độ dài của thẻ
        onChange={handleChangeTopics}
        tokenSeparators={[","]}
        options={topics.map((topic) => ({ value: topic }))}
      />
      <div className="mt-2" />
      <span className="text-xs text-gray-500">
        (Tối đa 5 chủ đề, mỗi chủ đề không quá 20 ký tự)
      </span>
      <span className="text-xs text-gray-500">
        <br />
        Nhấn <b>Enter</b> hoặc <b>(dấu phẩy)</b> để thêm chủ đề.
      </span>
      <div className="mt-2" />

      <Select
        defaultValue={false}
        style={{ width: "100%" }}
        onChange={(value) => {
          setGroupIsPublic(value);
        }}
        options={[
          { value: true, label: "Nhóm công khai" },
          { value: false, label: "Nhóm riêng tư" },
        ]}
        placeholder="Chọn chế độ nhóm"
        className="w-full"
        value={groupIsPublic}
      />

      <div className="mt-4" />
      <SelectFriends
        onChange={(value) => {
          setListSelectedFriends(value.map((item) => ({ userId: item.value })));
        }}
        onClear={() => {
          setListSelectedFriends([]);
        }}
      />
    </Modal>
  );
};

export { ModalCreateChatGroup };
