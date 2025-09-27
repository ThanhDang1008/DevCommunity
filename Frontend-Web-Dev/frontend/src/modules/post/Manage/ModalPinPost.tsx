"use client";

import { Modal, message } from "antd";
import { useState } from "react";
import { updateRankPost } from "@/service/api/post";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type ModalPinPostProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  _id: string;
};

const ModalPinPost = (props: ModalPinPostProps) => {
  const queryClient = useQueryClient();
  const [selectedRank, setSelectedRank] = useState<number>(0);
  //console.log("selectedRank", selectedRank);

  const { mutate: updateRankPostMutation, isPending } = useMutation({
    mutationFn: (data: { _id: string; rank: number }) => updateRankPost(data),
    onSuccess: (data) => {
      //console.log("data onSuccess", data);
      message.open({
        type: "success",
        content: "Ghim bài viết thành công",
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
    if (selectedRank === 0) {
      message.open({
        type: "error",
        content: "Vui lòng chọn thứ hạng để ghim bài viết",
      });
      return;
    }
    updateRankPostMutation({
      _id: props._id,
      rank: selectedRank,
    });
  };

  const handleCancel = () => {
    setSelectedRank(0);
    props.onClose();
  };
  return (
    <Modal
      title={
        <>
          <div>Ghim bài viết</div>
        </>
      }
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Ghim"
      cancelText="Hủy"
      okButtonProps={{
        disabled: selectedRank === 0,
      }}
      confirmLoading={isPending}
    >
      <div className="flex flex-col gap-2">
        <div className="text-sm">
          Bạn có chắc chắn muốn ghim bài viết:{" "}
          <span className="font-semibold text-cyan-600 italic">
            {props.name}
          </span>{" "}
        </div>
        <div className="text-sm text-gray-600">
          Bài viết sẽ được ghim lên đầu trang chủ.
        </div>
        <div className="flex flex-col gap-2 mt-4 items-center">
          <div className="text-sm font-semibold">Chọn thứ hạng để ghim:</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 13 }, (_, i) => i + 1).map((rank) => (
              <button
                key={rank}
                className={`px-4 py-2 border rounded ${
                  selectedRank === rank
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedRank(rank)}
              >
                #{rank}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPinPost;
