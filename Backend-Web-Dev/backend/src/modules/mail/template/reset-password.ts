interface ResetPasswordTemplateData {
  name_user: string;
  email_user: string;
  url_reset_password: string;
  name_service: string;
  email_support: string;
  time_expire: string;
}

export const ResetPasswordTemplate = (data: ResetPasswordTemplateData) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4a90e2;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .button-container {
            text-align: center; /* Canh giữa nút */
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #4a90e2;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #357abd;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Yêu cầu đặt lại mật khẩu</h1>
        </div>
        <div class="content">
            <p>Xin chào, <strong>${data.name_user}</strong></p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>${data.name_service}</strong>. Để tiến hành đặt lại mật khẩu, vui lòng nhấp vào nút dưới đây:</p>
            <div class="button-container">
                <a href="${data.url_reset_password}" class="button">Đặt lại mật khẩu</a>
            </div>
            <p>Liên kết này sẽ hết hạn trong vòng <strong>${data.time_expire}</strong>. Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email này. Tài khoản của bạn sẽ vẫn an toàn.</p>
            <p>Nếu bạn gặp bất kỳ khó khăn nào hoặc cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua <a href="mailto:${data.email_support}">${data.email_support}</a>.</p>
           
        </div>
        <div class="footer">
            <p>© 2025 ${data.name_service}.</p>
        </div>
    </div>
</body>
</html>`;
  return {
    from: `${data.name_service} <${data.email_support}>`, // sender address
    to: `${data.email_user}`, // list of receivers
    subject: `Yêu cầu đặt lại mật khẩu cho ${data.name_service}`, //tiêu đề
    //text: "Hello world?", // plain text body
    html: htmlContent, // nội dung
  };
};
