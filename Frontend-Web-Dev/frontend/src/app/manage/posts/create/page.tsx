import { PageAdmin } from "../../_components/page-admin";
import CreatePost from "@modules/post/Manage/CreatePost";

export default function Page() {
  return (
    <>
      <PageAdmin>
        <h1 className="text-2xl font-bold">Tạo bài viết</h1>
        <CreatePost />
      </PageAdmin>
    </>
  );
}
