import { Button, Result } from "antd";
import Link from "next/link";

function AccessDenied() {
  return (
    <>
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Link href="/">
            <Button type="primary">Trở về trang chủ</Button>
          </Link>
        }
      />
    </>
  );
}

export default AccessDenied;
