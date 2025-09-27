export type CreateTag = {
  name: string;
  slug: string;
  description?: string;
};

type ChildTag = {
  name: string;
  slug: string;
  description?: string;
};

export type CreateChildTag = {
  tag_id: string;
  child: ChildTag[];
};

export type UpdateTag = {
  _id: string;
  name: string;
  description?: string;
};

export type UpdateChildTag = {
  tag_id: string;
  child_tag_id: string;
  name: string;
  description?: string;
};
