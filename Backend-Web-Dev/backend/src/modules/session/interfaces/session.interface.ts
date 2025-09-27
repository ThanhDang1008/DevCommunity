import { Role } from "@/constants/common";

export interface ISessionUserClient {
  email: string;
  id_user: string;
  session_id: string;
  id_role: {
    _id: string;
    role: Role;
  };
}