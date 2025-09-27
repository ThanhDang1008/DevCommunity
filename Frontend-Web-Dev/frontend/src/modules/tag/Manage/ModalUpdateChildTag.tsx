"use client";

import { Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { getChildTagById, updateChildTag } from "@/service/api/tag";
import type { UpdateChildTag } from "@/service/api/tag/types";

type ModalCreateChildTagProps = {
  isOpen: boolean;
  onClose: () => void;
  tag_id: string;
  child_tag_id: string;
  name: string;
};

const ModalUpdateChildTag = (props: ModalCreateChildTagProps) => {
  const queryClient = useQueryClient();

  const [nameTag, setNameTag] = useState<string>("");
  const [descriptionTag, setDescriptionTag] = useState<string>("");

  const {
    data: data_response,
    isLoading,
    isError,
    error: error_response,
  } = useQuery({
    queryKey: [queryKeys.GET_CHILD_TAG_BY_ID, props.tag_id, props.child_tag_id],
    queryFn: () => getChildTagById(props.tag_id, props.child_tag_id),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  useEffect(() => {
    if (data_response) {
      setNameTag(
        isLoading
          ? "(Đang tải...)"
          : data_response?.data?.data[0]?.name || "(Error!)"
      );
      setDescriptionTag(
        isLoading
          ? "(Đang tải...)"
          : data_response?.data?.data[0]?.description || ""
      );
    }
  }, [data_response]);
  //console.log("data_response", data_response);

   const { mutate: updateTagMutation, isPending: isPendingUpdate } = useMutation(
      {
        mutationFn: (data: UpdateChildTag) => updateChildTag(data),
        onSuccess: (data) => {
          //console.log("data onSuccess", data);
          message.open({
            type: "success",
            content: "Câp nhật chủ đề thành công",
          });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.GET_CHILD_TAG_BY_ID, props.tag_id, props.child_tag_id],
          });
          queryClient.invalidateQueries({
            queryKey: [queryKeys.GET_All_CHILD_TAG, props.tag_id],
          });
          handleCancel();
        },
        onError: (error: any) => {
          {process.env.NODE_ENV === "development" && console.log("error", error)}
          message.open({
            type: "error",
            content:
              error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
            duration: 3,
          });
        },
      }
    );

  const handleOk = () => {
    if (!nameTag) {
      message.open({
        type: "warning",
        content: "Tên chủ đề không được để trống",
      });
      return;
    }
    updateTagMutation({
      tag_id: props.tag_id,
      child_tag_id: props.child_tag_id,
      name: nameTag,
      description: descriptionTag,
    });
  };

  const handleCancel = () => {
    props.onClose();
  };

  const onChangeNameTag = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNameTag(e.target.value);
  };
  const onChangeDescriptionTag = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescriptionTag(e.target.value);
  };
  return (
    <Modal
      title={
        <>
          <div>
            Cập nhật chủ đề{" "}
            <span className="text-yellow-500">{props.name.toLowerCase()}</span>
          </div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Câp nhật"
      cancelText="Hủy"
      confirmLoading={isPendingUpdate}
    >
      <div className="mb-3">
        <p>Tên chủ đề</p>
        <Input
          showCount
          maxLength={50}
          onChange={onChangeNameTag}
          spellCheck={false}
          placeholder="Nhập tên chủ đề"
          value={nameTag}
        />
      </div>
      <div className="mb-3">
        <p>Slug</p>
        <Input
          spellCheck={false}
          value={
            isLoading
              ? "(Đang tải...)"
              : data_response?.data?.data[0]?.slug || "(Error!)"
          }
          disabled
        />
      </div>
      <div className="mb-6">
        <p>Mô tả</p>
        <Input.TextArea
          showCount
          maxLength={100}
          onChange={onChangeDescriptionTag}
          placeholder="Nhập mô tả cho chủ đề"
          spellCheck={false}
          value={descriptionTag}
        />
      </div>
    </Modal>
  );
};

export default ModalUpdateChildTag;
