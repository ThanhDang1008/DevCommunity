export type SendResetPassword = {
  email: string;
  name: string;
  url_service: string;
  name_service: string;
};

export type SendUpdatePassword = {
  new_password: string;
  token: string;
};

export type SendRegister = {
  email: string;
  name: string;
  url_service: string;
  name_service: string;
};