"use client";

import type { AxiosResponse } from "@/lib/axiosInstance";
import type { GetAllCommentsPostResponse } from "@/service/api/post/types/PostComments";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/Common";

type TypeTotalCommentsProps = {
  postId: string;
};

export const TotalComments = (props: TypeTotalCommentsProps) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<
    AxiosResponse<GetAllCommentsPostResponse>
  >([queryKeys.GET_ALL_COMMENT_POST, props.postId]);
  return <>{data?.data?.totalComments}</>;
};
