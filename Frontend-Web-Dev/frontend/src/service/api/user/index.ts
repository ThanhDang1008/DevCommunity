import { AxiosResponse } from "@/lib/axiosInstance";
import type {
  GetInfoUser,
  DataUpdateUser,
  GetAllUsers,
  DataSetInfoUser,
  GetListFriends,
  GetListRecommendFriend,
} from "./types";
import type {
  TypeFriendRequestStatus,
  GetListFriendRequestsResponse,
} from "./types/FriendRequests";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";
import { generateSignature } from "@/shared/utils/signature";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const getInfoUser = async () => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetInfoUser> = await instance.get(
    "/api/v1/user/info",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Đảm bảo gửi cookie nếu cần
    }
  );
  return response;
};

export const updateInfoUser = async (data: DataUpdateUser) => {
  const response: AxiosResponse<any> = await instance.patch("/api/v1/user", {
    data: data,
  });
  return response;
};

export const getAllUsers = async (page: number, limit: number) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetAllUsers> = await instance.get(
    `/api/v1/user/list?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const setInfoUser = async (data: DataSetInfoUser) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/user/set-info",
    {
      ...data,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const getListFriends = async () => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetListFriends> = await instance.get(
    "/api/v1/user/list-friends",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const getListRecommendFriend = async (page: number, limit: number) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetListRecommendFriend> = await instance.get(
    `/api/v1/user/recommend-friends?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const createUser = async (data: {
  fullname: string;
  email: string;
  password: string;
  id_role: string;
}) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/user/create",
    {
      ...data,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const deleteUser = async (id: string) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/user/delete`,
    {
      data: { id: id },
      headers: {
        Authorization: `Bearer ${token}`,
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

//-----------------------------------------------

export const addFriend = async (data: {
  friendId: string;
  message?: string;
}) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/user/friend-requests",
    {
      friendId: data.friendId,
      requestMessage: data.message || "",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const feedbackFriendRequest = async (data: {
  requestId: string;
  status: TypeFriendRequestStatus;
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/user/friend-requests/${data.requestId}`,
    {
      status: data.status,
    }
  );
  return response;
};

export const getListFriendRequestsSender = async (
  page?: number,
  limit?: number
) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetListFriendRequestsResponse> =
    await instance.get(
      `/api/v1/user/friend-requests/sender?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return response;
};

export const getListFriendRequestsReceiver = async (
  page?: number,
  limit?: number
) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<GetListFriendRequestsResponse> =
    await instance.get(
      `/api/v1/user/friend-requests/receiver?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  return response;
};

export const cancelFriendRequest = async (data: { receiverId: string }) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/user/friend-requests/${data.receiverId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
