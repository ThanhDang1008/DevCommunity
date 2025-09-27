export type CreateUser = {
  fullname: string;
  email: string;
  password: string;
  status: string;
  id_role: string;
  type?: string; //local, facebook, google, zalo
  avatar?: string;
};

export type UpdateUser = {
  fullname?: string;
  status?: string;
  id_role?: string;
  type?: string; //local, facebook, google, zalo
  avatar?: string;
  bio?: string;
  phone?: string;
  gender?: string;
  birthday?: Date | string;
  location?: {
    country?: string;
    city?: string;
    address?: string;
    ward?: string;
  };
};

export type SetInfoUser = {
  fullname?: string;
  email?: string;
  password?: string;
  status?: string;
  id_role?: string;
  type?: string; //local, facebook, google, zalo
  avatar?: string;
};
