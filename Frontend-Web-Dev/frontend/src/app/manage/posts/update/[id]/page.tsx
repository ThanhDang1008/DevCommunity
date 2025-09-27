import { PageAdmin } from "@/app/manage/_components/page-admin";
import UpdatePost from "@modules/post/Manage/UpdatePost";

export default function Page() {
  return (
    <>
      <PageAdmin>
        <h1 className="text-2xl font-bold">Cập nhật bài viết</h1>
        <UpdatePost />
      </PageAdmin>
    </>
  );
}
