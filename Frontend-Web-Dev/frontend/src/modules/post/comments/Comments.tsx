"use client";

import { useState, useRef, useEffect, useMemo, use } from "react";
import clsx from "clsx";
import {
  useInfiniteQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { message as messageAntd, Modal } from "antd";

import type { InfiniteData } from "@tanstack/react-query";
import type { AxiosResponse } from "@/lib/axiosInstance";
import type {
  GetAllCommentsPostResponse,
  GetAllReplyCommentsResponse,
  IPostComments,
} from "@/service/api/post/types/PostComments";

import ViewAccess from "@ViewAccess";
import { EnumStatusComment } from "@/service/api/post/types/PostComments";
import SuneEditor, { SuneEditorRef } from "@components/suneditor";
import { buttonListOptions } from "@components/suneditor/comment.suneditor-options";
import ParseHTML from "@components/suneditor/parse";
import {
  getPostComments,
  getPostCommentsReply,
  createPostComment,
  deletePostComment,
} from "@/service/api/post";
import { queryKeys, Role } from "@/constants/Common";
import { timeSince } from "@/shared/utils/time";
import { useGetInfoUser } from "@/modules/user/hooks";
import { socketPostService } from "@/service/socket/post/socketInstance";
import { PostEvent } from "@/service/socket/post/constants/Common";
import LoginModal from "@/components/ui/modal/ModalLogin";

const ModalDeleteComment = (props: {
  postId: string;
  isOpen: boolean;
  comment: IPostComments;
  onClose: () => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: () => void;
}) => {
  const { mutate: deleteCommentMutation, isPending } = useMutation({
    mutationFn: (data: {
      postId: string;
      commentId: string;
      parentId?: string | null;
    }) => deletePostComment(data),
    onSuccess: (data) => {
      if (props.onDeleteSuccess) {
        props.onDeleteSuccess();
      }
      // messageAntd.open({
      //   type: "success",
      //   content: "Gửi tin nhắn thành công",
      // });
    },
    onError: (error: any) => {
      if (props.onDeleteError) {
        props.onDeleteError();
      }
      if (error?.response?.status === 429) {
        messageAntd.open({
          type: "error",
          content: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
          duration: 3,
        });
        return;
      }
      messageAntd.open({
        type: "error",
        content:
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
      return;
    },
    retry: 1,
    retryDelay: 2000,
  });

  const handleDelete = () => {
    if (!props?.postId || !props?.comment?._id) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
      return;
    }
    deleteCommentMutation({
      postId: props?.postId,
      commentId: props?.comment?._id,
      parentId: props?.comment?.parentId || null,
    });
    //props.onClose();
  };
  return (
    <Modal
      open={props.isOpen || false}
      title="Xóa bình luận"
      onCancel={props.onClose}
      onOk={handleDelete}
      okText={"Xóa"}
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading: isPending }}
    >
      <p className="italic">Bạn có chắc chắn muốn xóa bình luận này không?</p>
      <ParseHTML
        html={props.comment?.content}
        styleDark={{
          backgroundColor: "#1f1f1f",
        }}
      />
      {/* <p className="line-clamp-2">{props.comment?.content}</p> */}
    </Modal>
  );
};

const IconLoading = () => (
  <svg
    className="animate-spin h-5 w-5 text-white inline-block"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

type TypeCommentItemProps = {
  comment: IPostComments;
  postId: string;
  parentId: string;
  isReply?: boolean;
  onAddReply?: (parentId: string, content: string) => void;
  onLike?: (commentId: string, isReply?: boolean, parentId?: string) => void;
};

const CommentItem = (props: TypeCommentItemProps) => {
  const { data: userInfo } = useGetInfoUser();
  const queryClient = useQueryClient();

  const sunEditorLocalRef = useRef<SuneEditorRef>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  useEffect(() => {
    if (isReplying && props.isReply) {
      sunEditorLocalRef.current?.setHtmlContent(
        `<p><a href="#" title="@${props?.comment?.userId?.fullname}">@${props?.comment?.userId?.fullname}</a> </p>`
      );
    }
  }, [isReplying]);

  const { mutate: createCommentReplyMutation, isPending } = useMutation({
    mutationFn: (data: {
      postId: string;
      content: string;
      UUID: string;
      parentId?: string | null;
    }) => createPostComment(data),
    onSuccess: (data) => {
      // messageAntd.open({
      //   type: "success",
      //   content: "Gửi tin nhắn thành công",
      // });
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        messageAntd.open({
          type: "error",
          content: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
          duration: 3,
        });
        return;
      }
      messageAntd.open({
        type: "error",
        content:
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
      return;
    },
    retry: 1,
    retryDelay: 2000,
  });

  const handleReplySubmit = () => {
    if (!sunEditorLocalRef.current) return;
    const content = sunEditorLocalRef.current.getHtmlContent();
    if (!content.trim()) {
      alert("Bạn chưa nhập bình luận");
      return;
    }
    if (!props.postId || !props.parentId) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
      return;
    }
    //thêm bình luận mới vào danh sách cache react-query
    const UUID = `cmt-reply-${crypto.randomUUID()}`;
    const newCommentReply: Omit<IPostComments, "replies" | "totalReplies"> = {
      _id: UUID,
      postId: props.postId,
      userId: {
        _id: userInfo?._id || `user-id-${crypto.randomUUID()}`,
        fullname: userInfo?.fullname || "Bạn",
        email: userInfo?.email || "",
        avatar: userInfo?.avatar || "",
      },
      status: EnumStatusComment.PENDING,
      content: content,
      parentId: props.parentId,
      reactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    //console.log("new comments reply", newCommentReply);
    queryClient.setQueryData(
      [queryKeys.GET_ALL_REPLY_COMMENT_POST, props.postId, props.parentId],
      (oldData: InfiniteData<AxiosResponse<GetAllReplyCommentsResponse>>) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page, idx) => {
          if (props.isReply) {
            // Thêm vào trang cuối cùng (nếu đang trả lời bình luận reply)
            if (idx === oldData.pages.length - 1) {
              return {
                ...page,
                data: {
                  ...page.data,
                  data: [...page.data.data, newCommentReply],
                  totalReplies: page.data.totalReplies + 1,
                },
              };
            }
          } else {
            // Thêm vào trang đầu tiên (nếu đang trả lời bình luận chính)
            if (idx === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  data: [newCommentReply, ...page.data.data],
                  totalReplies: page.data.totalReplies + 1,
                },
              };
            }
          }
          return page;
        });
        return {
          ...oldData,
          pages: newPages,
          pageParams: oldData.pageParams,
        };
      }
    );
    sunEditorLocalRef.current.clearHtmlContent();
    setIsReplying(false);
    createCommentReplyMutation({
      postId: props.postId,
      content: content,
      parentId: props.parentId,
      UUID: UUID,
    });
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  return (
    <>
      <div className={clsx("flex flex-row")}>
        <div className="flex flex-col">
          <div
            className={clsx("h-10", {
              "pl-12": props.isReply,
              "w-6": props.isReply,
              "border-b-2 border-gray-200 dark:border-violet-800":
                props.isReply,
            })}
          ></div>
        </div>

        <div
          className={clsx(
            "flex gap-3 p-4 rounded-lg w-full",
            "bg-slate-100 dark:bg-violet-950 shadow-sm border border-gray-200 dark:border-violet-800",
            "shadow-[0_2px_8px_0_rgba(99,102,241,0.10)] hover:shadow-[0_4px_16px_0_rgba(99,102,241,0.18)] transition-shadow duration-200 ease-in-out"
          )}
        >
          <img
            src={props.comment.userId.avatar}
            alt={props.comment.userId.fullname}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {props.comment.userId.fullname}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timeSince(new Date(props.comment.createdAt))}
              </span>
            </div>

            {/* <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
          {comment.content}
        </p> */}
            <ParseHTML
              html={props.comment.content}
              styleLight={{
                // color: "#000",
                backgroundColor: "#f1f5f9",
              }}
              styleDark={{
                //color: "#fff",
                backgroundColor: "#2e1065",
              }}
            />

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {}}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {props.comment.status === EnumStatusComment.PENDING
                  ? "Đang gửi..."
                  : "Đã gửi"}
              </button>
              <button
                onClick={() =>
                  props.onLike?.(
                    props.comment._id,
                    props.isReply,
                    props.parentId
                  )
                }
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{10}</span>
              </button>

              <button
                onClick={() => {
                  setIsReplying(!isReplying);
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Trả lời
              </button>
              {userInfo?._id === props?.comment?.userId?._id && (
                <>
                  <button
                    onClick={() => {
                      // Xử lý chỉnh sửa bình luận
                      console.log("Chỉnh sửa bình luận", props.comment._id);
                    }}
                    className="text-xs text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      setIsOpenDeleteModal(true);
                    }}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    Xóa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isReplying && (
        <div
          className={clsx("mt-3 flex flex-col sm:flex-row gap-2", {
            "ml-2 sm:ml-12": props.isReply,
          })}
        >
          <div
            className={clsx(
              "flex-1 max-h-[200px] overflow-y-auto"
              // "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none"
            )}
          >
            <SuneEditor
              ref={sunEditorLocalRef}
              isShowToc={false}
              buttonList={buttonListOptions}
            />
          </div>
          <div className="flex flex-col justify-start gap-2 mt-3 sm:mt-0">
            <button
              onClick={handleReplySubmit}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Gửi
            </button>
            <button
              onClick={handleCancelReply}
              className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
      <ModalDeleteComment
        postId={props?.postId}
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        onDeleteSuccess={() => {
          setIsOpenDeleteModal(false);
          // Xử lý thành công xóa bình luận
          //console.log("Xóa bình luận thành công");
        }}
        comment={props?.comment}
      />
    </>
  );
};

type TypePostCommentsReplyProps = {
  commentId: string;
  postId: string;
};

const PostCommentsReply = (props: TypePostCommentsReplyProps) => {
  const queryClient = useQueryClient();
  const LIMIT = 5;

  useEffect(() => {
    const event_POST_COMMENT_ADDED = `${PostEvent.POST_COMMENT_ADDED}_${props.postId}_${props.commentId}`;
    const event_POST_COMMENT_DELETED = `${PostEvent.POST_COMMENT_DELETED}_${props.postId}_${props.commentId}`;

    socketPostService.on(
      event_POST_COMMENT_ADDED,
      (data: { postId: string; comment: IPostComments; UUID: string }) => {
        // console.log("New comment reply added from socket:", data);

        if (
          data.postId !== props.postId ||
          data?.comment?.parentId !== props.commentId
        )
          return;

        if (data?.comment?.parentId !== null) {
          queryClient.setQueryData(
            [
              queryKeys.GET_ALL_REPLY_COMMENT_POST,
              props.postId,
              props.commentId,
            ],
            (
              oldData: InfiniteData<AxiosResponse<GetAllReplyCommentsResponse>>
            ) => {
              if (!oldData) return oldData;
              // Chỉ tìm và thay thế bình luận trong trang cuối cùng
              const lastPage = oldData.pages[oldData.pages.length - 1];
              const idx = lastPage.data.data.findIndex(
                (c) => c._id === data.UUID
              );

              let newPages = [...oldData.pages];

              if (idx !== -1) {
                // Nếu tìm thấy, thay thế bình luận bằng comment mới từ socket
                const newComments = [
                  ...lastPage.data.data.slice(0, idx),
                  data.comment,
                  ...lastPage.data.data.slice(idx + 1),
                ];
                newPages[newPages.length - 1] = {
                  ...lastPage,
                  data: {
                    ...lastPage.data,
                    data: newComments,
                  },
                };
              } else {
                // Nếu không tìm thấy, thêm vào cuối trang cuối cùng
                newPages[newPages.length - 1] = {
                  ...lastPage,
                  data: {
                    ...lastPage.data,
                    data: [...lastPage.data.data, data.comment],
                    totalReplies: lastPage.data.totalReplies + 1,
                  },
                };
              }

              return {
                ...oldData,
                pages: newPages,
                pageParams: oldData.pageParams,
              };
            }
          );
        }
      }
    );

    socketPostService.on(
      event_POST_COMMENT_DELETED,
      (data: {
        postId: string;
        commentId: string;
        parentId: string | null;
      }) => {
        // console.log("Comment deleted from socket:", data);

        if (data.postId !== props.postId || data?.parentId !== props.commentId)
          return;

        queryClient.setQueryData(
          [queryKeys.GET_ALL_REPLY_COMMENT_POST, props.postId, props.commentId],
          (
            oldData: InfiniteData<AxiosResponse<GetAllReplyCommentsResponse>>
          ) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((page) => {
              const newComments = page.data.data.filter(
                (c) => c._id !== data.commentId
              );
              return {
                ...page,
                data: {
                  ...page.data,
                  data: newComments,
                  totalReplies: page.data.totalReplies - 1,
                },
              };
            });
            return {
              ...oldData,
              pages: newPages,
              pageParams: oldData.pageParams,
            };
          }
        );
      }
    );
  }, [props.postId, props.commentId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [
      queryKeys.GET_ALL_REPLY_COMMENT_POST,
      props.postId,
      props.commentId,
    ],
    queryFn: ({ pageParam = 1 }: { pageParam?: unknown }) =>
      getPostCommentsReply({
        postId: props.postId,
        commentId: props.commentId,
        page: Number(pageParam),
        limit: LIMIT,
      }),
    getNextPageParam: (
      response: AxiosResponse<GetAllReplyCommentsResponse>
    ) => {
      if (response?.data?.currentPage < response?.data?.totalPages) {
        return response?.data?.currentPage + 1;
      }
      return undefined;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 1,
    retryDelay: 2000,
    retryOnMount: true,
    gcTime: 1000 * 60 * 10,
    initialPageParam: 1,
  });

  const commentsReplyPost = useMemo(() => {
    const seen = new Set<string>();
    return (
      data?.pages
        .flatMap((page) => page.data.data)
        .filter((comment) => {
          if (seen.has(comment._id)) return false;
          seen.add(comment._id);
          return true;
        }) || []
    );
  }, [data]);

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500 dark:text-red-400">
        Đã xảy ra lỗi khi tải phản hồi. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "mt-4 ml-5",
        "border-l-2 border-gray-200 dark:border-violet-800"
      )}
    >
      {commentsReplyPost.map((comment) => {
        return (
          <div key={comment._id} className={clsx("mt-2")}>
            <CommentItem
              key={comment._id}
              postId={props.postId}
              comment={comment}
              parentId={props.commentId}
              isReply={true}
            />
          </div>
        );
      })}

      {/* {!isFetching && commentsReplyPost.length === 0 && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          Chưa có phản hồi nào cho bình luận này.
        </div>
      )} */}

      {/* {isFetching && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Đang tải phản hồi...
        </div>
      )} */}

      {/* Nút load thêm phản hồi */}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="ml-12 text-xs mt-4 px-2 py-1 bg-slate-500 hover:bg-slate-400 dark:bg-indigo-800 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors"
        >
          {isFetchingNextPage ? <IconLoading /> : `Xem thêm trả lời`}
        </button>
      )}
    </div>
  );
};

type TypePostCommentsProps = {
  postId: string;
  isReConnected: boolean;
  retryConnection: () => void;
  isConnected: boolean | null;
};

const PostComments = (props: TypePostCommentsProps) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetInfoUser();
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const sunEditorRef = useRef<SuneEditorRef>(null);
  const LIMIT = 10;

  useEffect(() => {
    const event_POST_COMMENT_ADDED = `${PostEvent.POST_COMMENT_ADDED}_${props.postId}`;
    const event_POST_COMMENT_DELETED = `${PostEvent.POST_COMMENT_DELETED}_${props.postId}`;

    socketPostService.on(
      event_POST_COMMENT_ADDED,
      (data: { postId: string; comment: IPostComments; UUID: string }) => {
        //console.log("New comment added from socket:", data);

        if (data.postId !== props.postId) return;

        // Thêm bình luận mới vào danh sách cache react-query
        if (data?.comment?.parentId === null) {
          queryClient.setQueryData(
            [queryKeys.GET_ALL_COMMENT_POST, props.postId],
            (
              oldData: InfiniteData<AxiosResponse<GetAllCommentsPostResponse>>
            ) => {
              if (!oldData) return oldData;
              const newPages = oldData.pages.map((page, idx) => {
                if (idx === 0) {
                  const idxComment = page.data.data.findIndex(
                    (c) => c._id === data.UUID
                  );
                  if (idxComment !== -1) {
                    // Nếu tìm thấy, thay thế bình luận bằng comment mới từ socket
                    const newComments = page.data.data.map((c, i) =>
                      i === idxComment ? data.comment : c
                    );
                    return {
                      ...page,
                      data: {
                        ...page.data,
                        data: newComments,
                      },
                    };
                  } else {
                    // Nếu không tìm thấy, thêm vào đầu trang đầu tiên
                    return {
                      ...page,
                      data: {
                        ...page.data,
                        data: [data.comment, ...page.data.data],
                        totalComments: page.data.totalComments + 1,
                      },
                    };
                  }
                }
                return page;
              });

              return {
                ...oldData,
                pages: newPages,
                pageParams: oldData.pageParams,
              };
            }
          );
        }
      }
    );

    socketPostService.on(
      event_POST_COMMENT_DELETED,
      (data: {
        postId: string;
        commentId: string;
        parentId: string | null;
      }) => {
        //console.log("Comment deleted from socket:", data);

        if (data.postId !== props.postId) return;

        // Xoá bình luận khỏi danh sách cache react-query
        queryClient.setQueryData(
          [queryKeys.GET_ALL_COMMENT_POST, props.postId],
          (
            oldData: InfiniteData<AxiosResponse<GetAllCommentsPostResponse>>
          ) => {
            if (!oldData) return oldData;
            const newPages = oldData.pages.map((page) => {
              const newComments = page.data.data.filter(
                (c) => c._id !== data.commentId
                // &&
                //   c.parentId !== data.commentId &&
                //   c._id !== data.parentId
              );
              return {
                ...page,
                data: {
                  ...page.data,
                  data: newComments,
                  totalComments: Math.max(
                    0,
                    page.data.totalComments -
                      (page.data.data.length - newComments.length)
                  ),
                },
              };
            });
            return {
              ...oldData,
              pages: newPages,
              pageParams: oldData.pageParams,
            };
          }
        );
      }
    );
  }, [props.postId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKeys.GET_ALL_COMMENT_POST, props.postId],
    queryFn: ({ pageParam = 1 }: { pageParam?: unknown }) =>
      getPostComments({
        postId: props.postId,
        page: Number(pageParam),
        limit: LIMIT,
      }),
    getNextPageParam: (response: AxiosResponse<GetAllCommentsPostResponse>) => {
      if (response?.data?.currentPage < response?.data?.totalPages) {
        return response?.data?.currentPage + 1;
      }
      return undefined;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 1,
    retryDelay: 2000,
    retryOnMount: true, // retry when mount component
    gcTime: 1000 * 60 * 10, //thời gian xoá cache khi không sử dụng
    initialPageParam: 1,
  });

  //console.log("check data comments", data);

  const commentsPost = useMemo(() => {
    const seen = new Set<string>();
    return (
      data?.pages
        .flatMap((page) => page.data.data)
        .filter((comment) => {
          if (seen.has(comment._id)) return false;
          seen.add(comment._id);
          return true;
        }) || []
    );
  }, [data]);

  //console.log("commentsPost", commentsPost);

  const { mutate: createCommentMutation, isPending } = useMutation({
    mutationFn: (data: {
      postId: string;
      content: string;
      UUID: string;
      parentId?: string | null;
    }) => createPostComment(data),
    onSuccess: (data) => {
      // messageAntd.open({
      //   type: "success",
      //   content: "Gửi tin nhắn thành công",
      // });
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        messageAntd.open({
          type: "error",
          content: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau",
          duration: 3,
        });
        return;
      }
      messageAntd.open({
        type: "error",
        content:
          error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
        duration: 3,
      });
      return;
    },
    retry: 1,
    retryDelay: 2000,
  });

  const handleAddComment = () => {
    if (!sunEditorRef.current) return;
    const content = sunEditorRef.current.getHtmlContent();
    if (!content.trim()) {
      alert("Bạn chưa nhập bình luận");
      return;
    }
    if (!props.postId) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
      return;
    }
    //thêm bình luận mới vào danh sách cache react-query
    const UUID = `cmt-${crypto.randomUUID()}`;
    const newCommentData: IPostComments = {
      _id: UUID,
      postId: props.postId,
      userId: {
        _id: userInfo?._id || `user-id-${crypto.randomUUID()}`,
        fullname: userInfo?.fullname || "Bạn",
        email: userInfo?.email || "",
        avatar: userInfo?.avatar || "",
      },
      status: EnumStatusComment.PENDING,
      content: content,
      parentId: null,
      reactions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
      totalReplies: 0,
    };
    queryClient.setQueryData(
      [queryKeys.GET_ALL_COMMENT_POST, props.postId],
      (oldData: InfiniteData<AxiosResponse<GetAllCommentsPostResponse>>) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page, idx) => {
          if (idx === 0) {
            return {
              ...page,
              data: {
                ...page.data,
                data: [newCommentData, ...page.data.data],
                totalComments: page.data.totalComments + 1,
              },
            };
          }
          return page;
        });
        return {
          ...oldData,
          pages: newPages,
          pageParams: oldData.pageParams,
        };
      }
    );
    sunEditorRef.current.clearHtmlContent();
    createCommentMutation({
      postId: props.postId,
      content: content,
      UUID: UUID,
    });
  };

  const handleAddReply = (parentId: string, content: string) => {};

  const handleLike = (
    commentId: string,
    isReply: boolean = false,
    parentId?: string
  ) => {};

  return (
    <div className="">
      <div className="bg-white dark:bg-indigo-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="comments" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Bình luận ({commentsPost.length})
          </h2>
        </div>

        {/* Add Comment Form */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <img
              src={userInfo?.avatar || "/image/thumbnail_default.jpg"}
              alt={userInfo?.fullname || "User Avatar"}
              className={clsx(
                "w-10 h-10 rounded-full object-cover flex-shrink-0 transition-transform duration-200 hover:scale-105 hover:ring-2 hover:ring-indigo-500",
                "hover:cursor-pointer"
              )}
            />
            <div className="flex-1">
              <div>
                <SuneEditor
                  ref={sunEditorRef}
                  isShowToc={false}
                  buttonList={buttonListOptions}
                  disable={props.isConnected === false || !userInfo?._id}
                />
              </div>
              <div className="flex justify-end mt-3">
                <ViewAccess
                  roles={Object.values(Role)}
                  error={
                    <>
                      <button
                        onClick={() => {
                          setIsOpenLoginModal(true);
                        }}
                        //disabled={!newComment.trim()}
                        className={clsx(
                          "px-6 py-2 rounded-lg font-medium transition-colors",
                          "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white",
                          "hover:scale-105 hover:shadow-lg"
                        )}
                      >
                        Đăng nhập để bình luận
                      </button>
                      {isOpenLoginModal && (
                        <LoginModal
                          isOpen={isOpenLoginModal}
                          onClose={() => {
                            setIsOpenLoginModal(false);
                          }}
                        />
                      )}
                    </>
                  }
                >
                  <button
                    onClick={() => {
                      handleAddComment();
                    }}
                    //disabled={!newComment.trim()}
                    className={clsx(
                      "px-6 py-2 rounded-lg font-medium transition-colors",
                      "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white",
                      "hover:scale-105 hover:shadow-lg"
                    )}
                  >
                    Đăng bình luận
                  </button>
                </ViewAccess>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="p-1 sm:p-6">
          {props.isConnected === false && !props.isReConnected && (
            <div className="p-2 mb-3 text-red-500 text-center bg-red-50 dark:bg-red-900/50">
              Mất kết nối với máy chủ. Vui lòng kiểm tra kết nối hoặc thử lại
              sau.
              <br />
              <button
                className="mt-1 py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={() => {
                  props.retryConnection(); // Gọi hàm để thử kết nối lại
                }}
              >
                Thử lại
              </button>
            </div>
          )}
          {props.isConnected === false && props.isReConnected && (
            // Hiển thị thông báo đang kết nối lại
            <div className="mb-3 p-2 text-green-500 text-center bg-green-100 dark:bg-green-900/50">
              Đang kết nối lại...
            </div>
          )}
          <div className="space-y-6">
            {commentsPost.map((comment) => (
              <div key={comment._id} className="relative group">
                <CommentItem
                  comment={comment}
                  postId={props.postId}
                  parentId={comment._id}
                  onAddReply={handleAddReply}
                  onLike={handleLike}
                />
                {/* {comment.totalReplies > 0 && (
                  <div>
                    <button
                      onClick={() => {}}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition-colors"
                    >
                      Xem {comment.totalReplies} trả lời
                    </button>
                  </div>
                )} */}
                <PostCommentsReply
                  postId={props.postId}
                  commentId={comment._id}
                />
              </div>
            ))}
          </div>

          {!isFetching && commentsPost.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận
              </p>
            </div>
          )}

          {isFetching && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Đang tải bình luận...
            </div>
          )}

          {/* Nút load thêm bình luận */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className={clsx(
                  "px-6 py-2 rounded-lg font-medium transition-colors",
                  "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                )}
              >
                {isFetchingNextPage ? <IconLoading /> : `Xem thêm bình luận`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { PostComments };
