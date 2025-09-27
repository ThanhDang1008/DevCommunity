export type Role = {
  _id: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type GetAllRole = {
  message: string;
  data: Role[];
};
