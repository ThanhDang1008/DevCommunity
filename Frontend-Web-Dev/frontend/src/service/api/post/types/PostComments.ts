export enum EnumStatusComment {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DELETED = "deleted",
  EDITED = "edited",
  PINNED = "pinned",
  PENDING = "pending",
}

export enum EnumReactionType {
  LIKE = "like",
  HEART = "heart",
}

export interface IReactions {
  userId: string;
  type: EnumReactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostComments {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
  };
  content: string;
  parentId: string | null;
  status: EnumStatusComment;
  reactions: IReactions[];
  createdAt: string | Date;
  updatedAt: string | Date;
  replies: Omit<IPostComments, "replies" | "totalReplies">[];
  totalReplies: number;
}

export type GetAllCommentsPostResponse = {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  data: IPostComments[];
  message: string;
};

export type GetAllReplyCommentsResponse = {
  currentPage: number;
  totalPages: number;
  totalReplies: number;
  data: IPostComments[];
  message: string;
};
