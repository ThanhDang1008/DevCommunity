import type {
  GetAllTags,
  GetAllChildTags,
  CreateChildTag,
  GetTagById,
  GetChildTagById,
  UpdateTag,
  UpdateChildTag,
  DeleteChildTag,
  CreateTag,
  GetAllTagHeader,
  TagHeader,
  GetDetailTagBySlug,
} from "@/service/api/tag/types";

import { baseURL,AxiosResponse } from "@/lib/axiosInstance";
import { NextAPI } from "@/shared/utils/next.api";
import { tagNext,URL } from "@/constants/Common";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const getAllTags = async () => {
  const response: AxiosResponse<GetAllTags> = await instance.get("/api/v1/tag");
  //console.log(response);
  return response;
};

export const createTag = async (data: CreateTag) => {
  const response: AxiosResponse<any> = await instance.post("/api/v1/tag", {
    name: data.name,
    slug: data.slug,
    description: data.description || "",
  });
  //console.log(response);
  return response;
};

export const updateTag = async (data: UpdateTag) => {
  const response: AxiosResponse<any> = await instance.patch(`/api/v1/tag`, {
    _id: data._id,
    name: data.name,
    description: data.description || "",
  });
  //console.log(response);
  return response;
};

export const deleteTag = async (slug: string) => {
  const response: AxiosResponse<any> = await instance.delete(`/api/v1/tag`, {
    data: {
      slug: slug,
    },
  });
  //console.log(response);
  return response;
};

export const checkExistTag = async (slug: string) => {
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/tag/check`,
    {
      slug: slug.trim(),
    }
  );
  //console.log(response);
  return response;
};

export const getTagById = async (tagId: string) => {
  const response: AxiosResponse<GetTagById> = await instance.get(
    `/api/v1/tag/${tagId}`
  );
  //console.log(response);
  return response;
};

//------------------------Child Tag------------------------

export const getAllChildTags = async (tagId: string) => {
  const response: AxiosResponse<GetAllChildTags> = await instance.get(
    `/api/v1/tag/child/${tagId}`
  );
  //console.log(response);
  return response;
};

export const getAllChildTagsBySlug = async (slug: string) => {
  const response: AxiosResponse<GetAllChildTags> = await instance.post(
    `/api/v1/tag/child-by-slug`,
    {
      slug: slug,
    }
  );
  //console.log(response);
  return response;
};

export const createChildTag = async (data: CreateChildTag) => {
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/tag/child`,
    {
      tag_id: data.tag_id,
      child: [
        {
          name: data.name,
          slug: data.slug,
          description: data.description,
        },
      ],
    }
  );
  //console.log(response);
  return response;
};

export const updateChildTag = async (data: UpdateChildTag) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/tag/child`,
    {
      tag_id: data.tag_id,
      child_tag_id: data.child_tag_id,
      name: data.name,
      description: data.description || "",
    }
  );
  //console.log(response);
  return response;
};

export const deleteChildTag = async (data: DeleteChildTag) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/tag/child`,
    {
      data: {
        slug: data.slug,
        child_slug: data.child_slug,
      },
    }
  );
  //console.log(response);
  return response;
};

export const checkExistChildTag = async (tagId: string, slug: string) => {
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/tag/child/check`,
    {
      tag_id: tagId,
      slug: slug.trim(),
    }
  );
  //console.log(response);
  return response;
};

export const getChildTagById = async (tagId: string, childTagId: string) => {
  const response: AxiosResponse<GetChildTagById> = await instance.post(
    `/api/v1/tag/child-by-id`,
    {
      tag_id: tagId,
      child_tag_id: childTagId,
    }
  );
  //console.log(response);
  return response;
};

export const getDetailTagBySlug = async (slug: string[]) => {
  const response: AxiosResponse<GetDetailTagBySlug> = await instance.post(
    `/api/v1/tag/detail`,
    {
      tags: slug,
    }
  );
  //console.log(response);
  return response;
};

export const getAllTagHeader = async () => {
  const response: AxiosResponse<GetAllTagHeader> = await instance.post(
    "/api/v1/tag/header"
  );
  //console.log(response);
  return response;
};

//------------------------------------------------


export const getDetailTagBySlugNext = async (slug: string[]) => {
  const response = await NextAPI<GetDetailTagBySlug>(
    `${baseURL}/api/v1/tag/detail`,
    {
      method: "POST",
      body: {
        tags: slug,
      },
    },
    {
      cache: "force-cache",
      next: {
        revalidate: 30, // (seconds)
      },
    }
  );
  return response;
};

// export const updateTagHeaderNext = async (newValue: {
//   header: MainCategory[];
// }) => {
//   const CLIENT_URL =
//     process.env.CLIENT_URL || process.env.NEXT_PUBLIC_CLIENT_URL;
//     const secret = process.env.SECRET_KEY;
//   const response = await NextAPI<any>(`${CLIENT_URL}/api/data?secret=${secret}`, {
//     method: "POST",
//     body: newValue,
//   });

//   return response;
// };
