import { generateToken } from "@/shared/globals/helpers/jwt.auth";

interface MailOptions {
  name_project: string;
  email_project: string;
  name_user: string;
  email_user: string;
  url_verify: string;
  url_contact: string;
  url_feedback: string;
}

const configMailOptions = (options: MailOptions) => {
  const {
    name_project,
    email_project,
    name_user,
    email_user,
    url_verify,
    url_contact,
    url_feedback,
  } = options;

  const token = generateToken({ email: email_user, isVerify: true }, "180s");
  const htmlContent = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;display: flex; align-items:center;">
    <div style="max-height: 50%;max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background-color: #fff;">
        <div style="text-align: center; margin-bottom: 20px;">▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄</div>
        <h2 style="text-align: center; color: #007bff;"><span style="color: #c4c4c1;">Confirm your email address</span></h2>
        <p>Hey <strong>${name_user}</strong>,</p>
        <p>Thanks for registering for an account on <strong>${name_project}</strong> Before we get started, we just need to confirm that this is you. Click below to verify your email address:</p>
        <div style="text-align: center;"><a style="text-decoration: none; padding: 8px; background-color: #2e2e28; color: #fff; border-radius: 5px; cursor: pointer;" href="${url_verify}?token=${token}"> Verify Email </a></div>
        <div style="margin-top: 20px; text-align: center;"><hr /></div>
        <div style="margin-top: 20px; text-align: center;"><a style="text-decoration: none; color: #007bff;" href="${process.env.CLIENT_URL}">Trang chủ</a> | <a style="text-decoration: none; color: #007bff;" href="${url_contact}">Liên hệ</a></div>
        <p style="color: #adadad;">Cần giúp đỡ? Liên hệ nhóm hỗ trợ hoặc thông qua <a style="color: #3366ff; text-decoration: none;" href="${url_contact}">@<strong>AskYourAI</strong></a>. Muốn cung cấp phản hồi? Hãy cho chúng tôi biết ý kiến của bạn trên <a style="color: #3366ff; text-decoration: none;" href="${url_feedback}">trang phản hồi</a></p>
    </div>
</div>
`;

  // Configure the mailoptions object
  return {
    from: `${name_project} <${email_project}>`, // sender address
    to: `${email_user}`, // list of receivers
    subject: `Xác Nhận Địa Chỉ Email ${name_project} `, //tiêu đề
    //text: "Hello world?", // plain text body
    html: htmlContent, // nội dung
  };
};

export { configMailOptions };
