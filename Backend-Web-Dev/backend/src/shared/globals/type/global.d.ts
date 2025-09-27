export {};
import type { IRole } from "@/modules/role/schemes/role.model";

declare global {
  interface ReqHeaderSession {
      email: string;
      id_user: string;
      session_id: string;
      id_role: IRole;
  }
}
