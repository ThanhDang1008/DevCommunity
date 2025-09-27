export interface ISendMailVerify {
  name_project: string;
  email_project: string;
  name_user: string;
  email_user: string;
  url_verify: string;
  url_contact: string;
  url_feedback: string;
}

export interface IPayloadMailVerify {
    email: string;
    isVerify: boolean;
}

export interface IResetPassword {
  name_service: string;
  url_service: string;
  email: string;
  name: string;
}
