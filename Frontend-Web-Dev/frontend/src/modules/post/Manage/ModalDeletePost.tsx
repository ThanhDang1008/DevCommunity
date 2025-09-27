"use client";

import { Modal, message } from "antd";
import { deletePost } from "@/service/api/post";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type ModalDeletePostProps = {
  isOpen: boolean;
  onClose: () => void;
  _id: string;
  name: string;
  // pagePostRecent: number;
  // limitPostRecent: number;
  link: {
    image: string[];
    video: string[];
  };
  thumbnail: string;
};

const ModalDeletePost = (props: ModalDeletePostProps) => {
  const queryClient = useQueryClient();

  const { mutate: deletePostMutation, isPending: isPendingDelete } =
    useMutation({
      mutationFn: (data: {
        id: string;
        link: {
          image: string[];
          video: string[];
        };
        thumbnail: string;
      }) => deletePost(data),
      onSuccess: (data) => {
        //console.log("data onSuccess", data);
        message.open({
          type: "success",
          content: "Xóa bài viết thành công",
        });
        queryClient.refetchQueries({
          // queryKey: [
          //   queryKeys.GET_ALL_POST_RECENT,
          //   props.pagePostRecent,
          //   props.limitPostRecent,
          // ],
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
    deletePostMutation({
      id: props._id,
      link: props.link,
      thumbnail: props.thumbnail,
    });
  };
  const handleCancel = () => {
    props.onClose();
  };
  return (
    <Modal
      title={
        <>
          <div>Xóa bài viết</div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={isPendingDelete ? "Đang xử lý..." : "Xóa"}
      cancelText="Hủy"
      okButtonProps={{
        danger: true,
      }}
      confirmLoading={isPendingDelete}
    >
      <div className="">
        Bạn muốn xóa bài viết:{" "}
        <span className="text-red-600 font-bold">
          {props.name.toLowerCase()}
        </span>
        <p className="text-red-600 text-xs italic mt-2">
          (Tất cả hình ảnh, video của bài viết này cũng sẽ bị xóa.)
        </p>
      </div>
    </Modal>
  );
};

export default ModalDeletePost;
