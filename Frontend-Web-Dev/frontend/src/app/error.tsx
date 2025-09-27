"use client";

import { Button, Result } from "antd";

//Handle Client Component Error
function ErrorPage() {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Đã có lỗi xảy ra. Vui lòng thử lại sau."
      extra={
        <Button onClick={() => window.location.reload()} type="primary">
          Thử lại
        </Button>
      }
    />
  );
}

export default ErrorPage;
