import { statusPost } from "@/constants/Common";
import type { ITag } from "@/service/api/tag/types";
import type { IUser } from "@/service/api/user/types";

export type Post = {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  toc:
    | {
        title: string;
        id: string;
        tag: string; // "h2" | "h3" | "h4" | "h5" | "h6";
      }[]
    | [];
  thumbnail: string;
  category: ITag[];
  link: {
    image: string[];
    video: string[];
  };
  author: {
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
  } | null;
  rank: number;
  status: statusPost;
  view: number;
  createdAt: Date;
  keywords: string[];
  reactions: IReactions[];
  tags: string[];
  updatedAt: Date;
};

export interface IReactions {
  listUserId: {
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
  }[];
  type: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum EnumPostReactionType {
  HEART = "heart",
  UNICORN = "unicorn",
  SURPRISED = "surprised",
  CLAP = "clap",
  FIRE = "fire",
  LIKE = "like",
}

export const listEmojiReactions = [
  { id: EnumPostReactionType.LIKE, emoji: "👍" },
  { id: EnumPostReactionType.HEART, emoji: "❤️" },
  { id: EnumPostReactionType.UNICORN, emoji: "🦄" },
  { id: EnumPostReactionType.SURPRISED, emoji: "😮" },
  { id: EnumPostReactionType.CLAP, emoji: "👏" },
  { id: EnumPostReactionType.FIRE, emoji: "🔥" },
];

export type CreatePost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  toc?:
    | {
        title: string;
        id: string;
        tag: string; // "h2" | "h3" | "h4" | "h5" | "h6";
      }[]
    | [];
  thumbnail?: string;
  link?: {
    image?: string[];
    video?: string[];
  };
  category: string[];
  tags?: string[];
  keywords?: string[];
  status: statusPost;
  createdAt?: string;
};

export type UpdatePost = {
  _id: string;
  title: string;
  description?: string;
  content: string;
  toc?:
    | {
        title: string;
        id: string;
        tag: string; // "h2" | "h3" | "h4" | "h5" | "h6";
      }[]
    | [];
  thumbnail: string;
  link?: {
    image?: string[];
    video?: string[];
  };
  category: string[];
  tags?: string[];
  keywords?: string[];
  status: statusPost;
  createdAt?: string;
};

export type GetPostBySlug = {
  message: string;
  data: Post;
};

export type GetPostById = {
  message: string;
  data: Post;
};

export type GetAllPostRecent = {
  message: string;
  data: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};

export type GetAllPostByCategory = {
  message: string;
  data: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};

export type GetDetailPost = {
  message: string;
  data: PostWithTotalComments;
};

export type GetPostByRank = {
  message: string;
  data: Omit<Post, "content">[];
};

export type PostWithTotalComments = Post & { totalComments: number };

export type GetAllPostRecentPublic = {
  message: string;
  data: Omit<PostWithTotalComments, "content">[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};

export type GetAllPostByCategoryPublic = {
  message: string;
  data: Omit<Post, "content">[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
};

export type GetAllPostByViewPublic = {
  message: string;
  data: Omit<Post, "content">[];
};
