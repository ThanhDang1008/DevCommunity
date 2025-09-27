"use client";

import { Button, Modal, Input, message } from "antd";
import { convertToSlug } from "@/shared/utils/slugify";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTag, checkExistTag } from "@/service/api/tag";
import { queryKeys } from "@/constants/Common";
import type { CreateTag } from "@/service/api/tag/types";
import useDebounce from "@/hooks/useDebounce.hook";

type ModalCreateTagProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalCreateTag = (props: ModalCreateTagProps) => {
  const queryClient = useQueryClient();

  const [nameTag, setNameTag] = useState<string>("");
  const [slugTag, setSlugTag] = useState<string>("");
  const [descriptionTag, setDescriptionTag] = useState<string>("");

  const [isExistSlug, setIsExistSlug] = useState<boolean>(false);
  const [isLoadingExistSlug, setIsLoadingExistSlug] = useState<boolean>(false);

  //   console.log("isExistSlug ", isExistSlug);
  //   console.log("isLoadingExistSlug ", isLoadingExistSlug);

  const debouncedSlugTag = useDebounce(slugTag, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await checkExistTag(debouncedSlugTag);
        //console.log("response", response);
        if (response?.status === 200) {
          setIsLoadingExistSlug(false);
          setIsExistSlug(false);
        }
      } catch (error: any) {
        //console.log("error", error);
        if (error?.response?.status === 400) {
          setIsLoadingExistSlug(false);
          setIsExistSlug(true);
        } else {
          setIsLoadingExistSlug(true);
          return message.open({
            type: "error",
            content:
              error.response?.data?.message ||
              "Kiểm tra slug thất bại, vui lòng thử lại sau",
            duration: 3,
          });
        }
      }
    };

    if (nameTag && debouncedSlugTag) {
      fetchData();
    }
    //console.log("debouncedSlugTag", debouncedSlugTag);
  }, [debouncedSlugTag]);

  const { mutate: createTagMutation, isPending } = useMutation({
    mutationFn: (data: CreateTag) => createTag(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      message.open({
        type: "success",
        content: "Thêm chủ đề thành công",
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.GET_All_TAG],
      });
      handleCancel();
    },
    onError: (error: any) => {
      {
        process.env.NODE_ENV === "development" && console.log("error", error);
      }
      message.open({
        type: "error",
        content:
          error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
    },
  });

  const handleOk = () => {
    if (!nameTag) {
      message.open({
        type: "warning",
        content: "Tên chủ đề không được để trống",
      });
      return;
    }
    createTagMutation({
      name: nameTag,
      slug: slugTag,
      description: descriptionTag,
    });
  };

  const handleCancel = () => {
    //clear state
    setNameTag("");
    setSlugTag("");
    setDescriptionTag("");
    setIsExistSlug(false);
    setIsLoadingExistSlug(false);
    props.onClose();
  };

  const onChangeNameTag = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //console.log("Change:", e.target.value);
    setNameTag(e.target.value);
    if (e.target.value !== "") {
      setIsLoadingExistSlug(true);
    }
    if (e.target.value === "") {
      setIsExistSlug(false);
      setIsLoadingExistSlug(false);
    }
    setSlugTag(convertToSlug(e.target.value.trim()));
  };

  const onChangeDescriptionTag = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    //console.log("Change:", e.target.value);
    setDescriptionTag(e.target.value);
  };

  return (
    <Modal
      title={
        <>
          <div>Thêm chủ đề</div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={isPending}
      okButtonProps={{
        disabled: !nameTag || isLoadingExistSlug || isExistSlug,
      }}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!nameTag || isLoadingExistSlug || isExistSlug) {
                return message.open({
                  type: "warning",
                  content: "Vui lòng kiểm tra lại thông tin",
                });
              }
              handleOk();
            }
          }}
        />
      </div>
      <div className="mb-3">
        <p>Slug</p>
        <Input spellCheck={false} value={slugTag} disabled />
        {isExistSlug && (
          <p className="text-red-500 text-xs">
            Slug đã tồn tại, vui lòng chọn tên khác
          </p>
        )}
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

export default ModalCreateTag;
