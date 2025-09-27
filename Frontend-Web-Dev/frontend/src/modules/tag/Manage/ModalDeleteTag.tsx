"use client";

import { Button, Modal, message } from "antd";
import { deleteTag } from "@/service/api/tag";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type ModalDeleteTagProps = {
  isOpen: boolean;
  onClose: () => void;
  tag_id: string;
  name: string;
  slug: string;
};

const ModalDeleteTag = (props: ModalDeleteTagProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteTagMutation, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: (data: string) => deleteTag(data),
      onSuccess: (data) => {
        //console.log("data onSuccess", data);
        message.open({
          type: "success",
          content: "Xóa chủ đề thành công",
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
    deleteTagMutation(props.slug);
  };
  const handleCancel = () => {
    props.onClose();
  };
  return (
    <Modal
      title={
        <>
          <div>
            Xóa chủ đề{" "}
            <span className="text-red-600">{props.name.toLowerCase()}</span>
          </div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isPendingDelete}
    >
      <div className="">
        Bạn có chắc chắn muốn xóa chủ đề này?
        <p className="text-red-600 text-xs italic font-bold">
          Tất cả các chủ đề, bài viết của chủ đề này cũng sẽ bị xóa.
        </p>
      </div>
    </Modal>
  );
};

export default ModalDeleteTag;
