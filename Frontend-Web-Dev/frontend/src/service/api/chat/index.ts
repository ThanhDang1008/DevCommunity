import { AxiosResponse } from "@/lib/axiosInstance";
import type {
  GetListGroupConversationsResponse,
  GetGroupConversationsResponse,
  TypeCreateChatGroup,
  GetAllConversationsCommunityResponse,
  TypeRoleParticipants,
  TypePermissionsParticipant,
} from "./types/GroupConversations";

import type {
  GetGroupMessagesResponse,
  CreateGroupMessage,
} from "./types/GroupMessages";

import type {
  TypeRequestType,
  TypeReviewStatus,
} from "./types/GroupJoinRequests";

import type {
  TypeGetGroupJoinRequestsResponse,
  TypeFeedbackGroupJoinRequest,
} from "./types/GroupJoinRequests";

import { generateSignature } from "@/shared/utils/signature";
import { getTokenAuth2 } from "@/components/auth/TokenAuth2";

import { getAxiosInstance } from "@/lib/axiosInstance";
const instance = getAxiosInstance();

export const getAllGroupCommunities = async () => {
  const response: AxiosResponse<GetAllConversationsCommunityResponse> =
    await instance.post("/api/v1/chat/group-conversations/all");
  return response;
};

export const createChatGroup = async (data: TypeCreateChatGroup) => {
  const response: AxiosResponse<any> = await instance.post(
    "/api/v1/chat/group-conversations",
    data,
    {
      headers: {
        "x-signature": await generateSignature(),
      },
    }
  );
  return response;
};

export const getChatGroupById = async (groupId: string) => {
  const response: AxiosResponse<GetGroupConversationsResponse> =
    await instance.get(`/api/v1/chat/group-conversations/${groupId}`);
  return response;
};

export const getAllChatGroup = async () => {
  const response: AxiosResponse<GetListGroupConversationsResponse> =
    await instance.get("/api/v1/chat/group-conversations");
  return response;
};

export const readNewMessagesGroup = async ({
  groupId,
}: {
  groupId: string;
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-conversations/read-new-messages`,
    {
      groupId: groupId,
    }
  );
  return response;
};
//--------------------------------------------------
export const getAllMessagesGroup = async (
  groupId: string,
  page: number,
  limit: number
) => {
  const response: AxiosResponse<GetGroupMessagesResponse> = await instance.get(
    `/api/v1/chat/group-messages/${groupId}?page=${page}&limit=${limit}`
  );
  return response;
};

export const createMessageGroup = async ({
  UUID,
  groupId,
  content,
  type,
  replyToId,
}: CreateGroupMessage) => {
  const token = getTokenAuth2();
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/chat/group-messages`,
    {
      UUID: UUID,
      groupId: groupId,
      content: content,
      type: type,
      replyToId: replyToId || null,
    },
    {
      headers: {
        "x-signature": await generateSignature(),
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const readMessagesByUser = async ({
  groupId,
  messageId,
}: {
  groupId: string;
  messageId: string;
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-messages/read-by-user`,
    {
      groupId: groupId,
      messageId: messageId,
    }
  );
  return response;
};

export const deleteMessageGroup = async (data: {
  groupId: string;
  messageId: string;
  isDeleted: boolean;
}) => {
  const response: AxiosResponse<any> = await instance.delete(
    `/api/v1/chat/group-messages`,
    {
      data: {
        groupId: data.groupId,
        messageId: data.messageId,
        isDeleted: data.isDeleted,
      },
    }
  );
  return response;
};

//--------------------------------------------------
export const joinGroupPublic = async (groupId: string) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-conversations/join`,
    {
      groupId: groupId,
    }
  );
  return response;
};

export const joinGroupPrivate = async (data: {
  groupId: string;
  requestType: TypeRequestType;
  requestMessage: string;
  invitedBy?: string | null;
}) => {
  const response: AxiosResponse<any> = await instance.post(
    `/api/v1/chat/group-join-requests`,
    {
      groupId: data.groupId,
      requestType: data.requestType,
      requestMessage: data.requestMessage,
      invitedBy: data.invitedBy || null,
    }
  );
  return response;
};

export const getJoinRequests = async (groupId: string) => {
  const response: AxiosResponse<TypeGetGroupJoinRequestsResponse> =
    await instance.get(`/api/v1/chat/group-join-requests/${groupId}`);
  return response;
};

export const feedbackJoinRequest = async (
  data: TypeFeedbackGroupJoinRequest
) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-join-requests/feedback`,
    {
      groupJoinRequestId: data.groupJoinRequestId,
      action: data.action,
      groupId: data.groupId,
    }
  );
  return response;
};

export const leaveGroup = async (groupId: string) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-conversations/leave`,
    {
      groupId: groupId,
    }
  );
  return response;
};

export const updatePermissions = async (data: {
  groupId: string;
  userId: string;
  permissions: TypePermissionsParticipant;
  role: TypeRoleParticipants;
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-conversations/update-permissions`,
    {
      groupId: data.groupId,
      userId: data.userId,
      permissions: data.permissions,
      role: data.role,
    }
  );
  return response;
};

export const updateInfoGroup = async (data: {
  groupId: string;
  title?: string;
  description?: string;
  avatar?: string;
  topics?: string[];
}) => {
  const response: AxiosResponse<any> = await instance.patch(
    `/api/v1/chat/group-conversations/update-info`,
    {
      groupId: data.groupId,
      title: data.title,
      description: data.description,
      avatar: data.avatar,
      topics: data.topics,
    }
  );
  return response;
};
