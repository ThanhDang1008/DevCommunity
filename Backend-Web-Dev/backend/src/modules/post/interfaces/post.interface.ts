import { statusPost } from "@modules/post/constants/common";

export type CreatePost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  toc?: {
    title: string;
    id: string;
    tag: string;
  }[];
  thumbnail?: string;
  link: {
    image?: string[];
    video?: string[];
  };
  category: string[];
  status: statusPost;
  author: string;
  tags?: string[];
  keywords?: string[];
  createdAt?: string; // ISO string format: 2025-04-21T22:05:05.000Z
};

export type UpdatePost = {
  _id: string;
  title: string;
  description: string;
  content: string;
  toc?: {
    title: string;
    id: string;
    tag: string;
  }[];
  thumbnail?: string;
  link: {
    image: string[];
    video: string[];
  };
  category: string[];
  tags: string[];
  keywords: string[];
  status: statusPost;
  createdAt?: string; // ISO string format: 2025-04-21T22:05:05.000Z
};
