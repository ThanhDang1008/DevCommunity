"use client";

import { Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";
import { getTagById, updateTag } from "@/service/api/tag";
import type { UpdateTag } from "@/service/api/tag/types";

type ModalUpdateTagProps = {
  isOpen: boolean;
  onClose: () => void;
  tag_id: string;
  name: string;
};

const ModalUpdateTag = (props: ModalUpdateTagProps) => {
  const queryClient = useQueryClient();

  const [nameTag, setNameTag] = useState<string>("");
  const [descriptionTag, setDescriptionTag] = useState<string>("");

  const {
    data: data_response,
    isLoading,
    isError,
    error: error_response,
  } = useQuery({
    queryKey: [queryKeys.GET_TAG_BY_ID, props.tag_id],
    queryFn: () => getTagById(props.tag_id),
    gcTime: 1000 * 60 * 1, //thời gian xoá cache khi không sử dụng
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const { mutate: updateTagMutation, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: (data: UpdateTag) => updateTag(data),
      onSuccess: (data) => {
        //console.log("data onSuccess", data);
        message.open({
          type: "success",
          content: "Câp nhật chủ đề thành công",
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_TAG_BY_ID, props.tag_id],
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.GET_All_TAG],
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
    //console.log("value", nameTag, descriptionTag);
    if (!nameTag) {
      message.open({
        type: "warning",
        content: "Tên chủ đề không được để trống",
      });
      return;
    }
    updateTagMutation({
      _id: props.tag_id,
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

  useEffect(() => {
    if (data_response) {
      setNameTag(
        isLoading
          ? "(Đang tải...)"
          : data_response?.data?.data?.name || "(Error!)"
      );
      setDescriptionTag(
        isLoading
          ? "(Đang tải...)"
          : data_response?.data?.data?.description || ""
      );
    }
  }, [data_response]);
  //console.log("data_response", data_response);
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
              : data_response?.data?.data?.slug || "(Error!)"
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

export default ModalUpdateTag;
