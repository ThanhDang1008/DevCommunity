export interface ITag  {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  child: ChildTag[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type ChildTag = {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GetAllTags = {
  message: string;
  data: Omit<ITag, "child">[]; // Omit child from Tag type
};

export type GetAllChildTags = {
  message: string;
  data: ChildTag[];
};

export type CreateTag = {
  name: string;
  slug: string;
  description?: string;
};

export type CreateChildTag = {
  tag_id: string;
  name: string;
  slug: string;
  description?: string;
};

export type UpdateTag = {
  _id: string;
  name: string;
  description: string;
};

export type UpdateChildTag = {
  tag_id: string;
  child_tag_id: string;
  name: string;
  description: string;
};

export type GetTagById = {
  message: string;
  data: Omit<ITag, "child">; // Omit child from Tag type
};

export type GetChildTagById = {
  message: string;
  data: ChildTag[];
};

export type DeleteChildTag = {
  slug: string;
  child_slug: string;
};

export type TagHeader = {
  name: string;
  slug: string;
  child?: {
    name: string;
    slug: string;
  }[];
};

export type GetAllTagHeader = {
  message: string;
  data: TagHeader[];
};

export type GetDetailTagBySlug = {
  message: string;
  data: ITag[];
};

