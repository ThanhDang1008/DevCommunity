import { baseURL, AxiosResponse } from "@/lib/axiosInstance";

import type {
  CreatePost,
  GetPostBySlug,
  GetAllPostRecent,
  GetPostById,
  UpdatePost,
  GetAllPostByCategory,
  GetDetailPost,
  GetPostByRank,
  GetAllPostRecentPublic,
  GetAllPostByCategoryPublic,
  GetAllPostByViewPublic,
} from "./types";

import type {
  GetAllCommentsPostResponse,
  GetAllReplyCommentsResponse,
} from "./types/PostComments";
import { NextAPI } from "@/shared/utils/next.api";
import { generateSignature } from "@/shared/utils/signature";
import { EnumPostReactionType } from "@/service/api/post/types";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const createPost = async (data: CreatePost) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/post",
    {
      slug: data.slug,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail || "",
      status: data.status,
      content: data.content,
      category: data.category,
      tags: data.tags,
      keywords: data.keywords,
      link: {
        image: data.link?.image || [],
        video: data.link?.video || [],
      },
      createdAt: data?.createdAt,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const updatePost = async (data: UpdatePost) => {
  const response: AxiosResponse<any> = await instance.patch(`/api/v1/post`, {
    _id: data._id,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    status: data.status,
    content: data.content,
    toc: data.toc || [],
    category: data.category,
    tags: data.tags,
    keywords: data.keywords,
    link: {
      image: data.link?.image || [],
      video: data.link?.video || [],
    },
    createdAt: data?.createdAt,
  });
  return response;
};

export const deletePost = async (data: {
  id: string;
  link: {
    image: string[];
    video: string[];
  };
  thumbnail: string;
}) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/post/${data.id}`,
    {
      data: {
        link: {
          image: data.link?.image || [],
          video: data.link?.video || [],
        },
        thumbnail: data.thumbnail,
      },
    }
  );
  return response;
};

export const getPostBySlug = async (slug: string) => {
  const response: AxiosResponse<GetPostBySlug> = await instance.get(
    `/api/v1/post/${slug}`
  );
  return response;
};

export const getPostById = async (id: string) => {
  const response: AxiosResponse<GetPostById> = await instance.post(
    `/api/v1/post/detail/${id}`
  );
  return response;
};

export const getAllPostRecent = async (
  page: number,
  limit: number,
  filters?: {
    startDate?: string | undefined;
    endDate?: string | undefined;
    status?: string | undefined;
    author?: string | undefined;
    category?: string[] | undefined;
    view?: "ASC" | "DESC" | "" | undefined;
    rank?: "ASC" | "DESC" | "" | undefined;
  }
) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetAllPostRecent> = await instance.post(
    `/api/v1/post/recent?page=${page}&limit=${limit}`,
    {
      filters: filters,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getAllPostByCategory = async (
  category: string[],
  page: number,
  limit: number
) => {
  const response: AxiosResponse<GetAllPostByCategory> = await instance.post(
    `/api/v1/post/category?page=${page}&limit=${limit}`,
    {
      category: category,
    }
  );
  return response;
};

export const updateRankPost = async (data: { _id: string; rank: number }) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/post/rank`,
    {
      _id: data._id,
      rank: data.rank,
    }
  );
  return response;
};

export const getAllPostByViewPublic = async (page: number, limit: number) => {
  const response: AxiosResponse<GetAllPostByViewPublic> = await instance.post(
    `/api/v1/post/view/public?page=${page}&limit=${limit}`
  );
  return response;
};

export const getAllPostRecentPublished = async (
  page: number,
  limit: number
) => {
  const response: AxiosResponse<GetAllPostRecentPublic> = await instance.post(
    `/api/v1/post/recent/public?page=${page}&limit=${limit}`
  );
  return response;
};

export const updateReactionPost = async (data: {
  postId: string;
  type: EnumPostReactionType;
  increment: boolean;
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/post/reaction`,
    {
      postId: data.postId,
      type: data.type,
      increment: data.increment,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

//----------------------------- NextAPI -----------------------------//

export const getPostBySlugNext = async (slug: string, cache: boolean) => {
  const response = await NextAPI<GetDetailPost>(
    `${baseURL}/api/v1/post/${slug}`,
    {
      method: "GET",
    },
    cache
      ? {
          cache: "force-cache",
          next: {
            revalidate: 30,
          },
        }
      : {
          cache: "no-cache",
        }
  );
  return response;
};

export const getAllPostByRankNext = async (
  gte: number,
  lte: number,
  cache: boolean
) => {
  const response = await NextAPI<GetPostByRank>(
    `${baseURL}/api/v1/post/rank`,
    {
      method: "POST",
      body: {
        _gte: gte,
        _lte: lte,
      },
    },
    cache
      ? {
          cache: "force-cache",
          next: {
            revalidate: 30,
          },
        }
      : {
          cache: "no-cache",
        }
  );
  return response;
};

export const getAllPostRecentPublishedNext = async (
  page: number,
  limit: number
) => {
  const response = await NextAPI<GetAllPostRecentPublic>(
    `${baseURL}/api/v1/post/recent/public?page=${page}&limit=${limit}`,
    {
      method: "POST",
    },
    {
      cache: "force-cache",
      next: {
        revalidate: 30,
      },
    }
  );
  return response;
};

export const getAllPostByCategoryPublicNext = async (
  page: number,
  limit: number,
  category: string[]
) => {
  const response = await NextAPI<GetAllPostByCategoryPublic>(
    `${baseURL}/api/v1/post/category/public?page=${page}&limit=${limit}`,
    {
      method: "POST",
      body: {
        category: category,
      },
    },
    {
      cache: "force-cache",
      next: {
        revalidate: 30,
      },
    }
  );
  return response;
};

export const getAllPostByViewPublicNext = async (
  page: number,
  limit: number
) => {
  const response = await NextAPI<GetAllPostByViewPublic>(
    `${baseURL}/api/v1/post/view/public?page=${page}&limit=${limit}`,
    {
      method: "POST",
    },
    {
      cache: "force-cache",
      next: {
        revalidate: 30,
      },
    }
  );
  return response;
};

//--------------------- Post Comment ---------------------

export const getPostComments = async (data: {
  postId: string;
  page?: number;
  limit?: number;
  replyPage?: number;
  replyLimit?: number;
}) => {
  const params = [
    data.page !== undefined ? `page=${data.page}` : null,
    data.limit !== undefined ? `limit=${data.limit}` : null,
    data.replyPage !== undefined ? `replyPage=${data.replyPage}` : null,
    data.replyLimit !== undefined ? `replyLimit=${data.replyLimit}` : null,
  ]
    .filter(Boolean)
    .join("&");

  const response: AxiosResponse<GetAllCommentsPostResponse> =
    await instance.get(
      `/api/v1/post/comments/${data.postId}${params ? "?" + params : ""}`
    );
  return response;
};

export const getPostCommentsReply = async (data: {
  commentId: string;
  postId: string;
  page?: number;
  limit?: number;
}) => {
  const params = [
    data.page !== undefined ? `page=${data.page}` : null,
    data.limit !== undefined ? `limit=${data.limit}` : null,
  ]
    .filter(Boolean)
    .join("&");

  const response: AxiosResponse<GetAllReplyCommentsResponse> =
    await instance.get(
      `/api/v1/post/comments/reply/${data.postId}/${data.commentId}${
        params ? "?" + params : ""
      }`
    );
  return response;
};

export const createPostComment = async (data: {
  postId: string;
  content: string;
  UUID: string;
  parentId?: string | null;
}) => {
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/post/comments`,
    {
      content: data.content,
      postId: data.postId,
      UUID: data.UUID,
      parentId: data.parentId || null,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const deletePostComment = async (data: {
  postId: string;
  commentId: string;
  parentId?: string | null;
}) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/post/comments/delete`,
    {
      data: {
        postId: data.postId,
        commentId: data.commentId,
        parentId: data.parentId || null,
      },
    }
  );
  return response;
};
