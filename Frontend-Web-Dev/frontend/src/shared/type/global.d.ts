export {};

declare global {
  //type Role = "ROOT" | "ADMIN" | "USER" | "GUEST" | "DEV";

  interface ISessionUser {
    _id: string;
    session_id: string;
    email: string;
    id_user: string;
    id_role: {
      _id: string;
      role: Role;
    };
  }

  interface ILoginResponseSuccess {
    status: number;
    data: {
      message: string;
      data: {
        email: string;
        id_user: string;
        session_id: string;
        id_role: {
          _id: string;
          role: Role;
        };
      };
      token: string;
    };
  }
}
