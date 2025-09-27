"use client";

import { Modal, message } from "antd";
import { updateRankPost } from "@/service/api/post";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type ModalUnpinPostProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  _id: string;
};

const ModalUnpinPost = (props: ModalUnpinPostProps) => {
  const queryClient = useQueryClient();

  const { mutate: updateRankPostMutation, isPending } = useMutation({
    mutationFn: (data: { _id: string; rank: number }) => updateRankPost(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      message.open({
        type: "success",
        content: "Bỏ ghim bài viết thành công",
      });

      queryClient.refetchQueries({
        predicate(query) {
          return (
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === queryKeys.GET_ALL_POST_RECENT
          );
        },
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
    updateRankPostMutation({
      _id: props._id,
      rank: 0,
    });
  };

  const handleCancel = () => {
    props.onClose();
  };
  return (
    <Modal
      title={
        <>
          <div>Bỏ ghim bài viết</div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Bỏ ghim"
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isPending}
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm">
          Bạn có chắc chắn muốn bỏ ghim bài viết:{" "}
          <span className="font-semibold text-red-600">{props.name}</span>{" "}
        </div>
      </div>
    </Modal>
  );
};

export default ModalUnpinPost;
