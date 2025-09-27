import { PageAdmin } from "../_components/page-admin";
import FileGallery from "@modules/file/FileGallery";
import FileStatistics from "@modules/file/FileStatistics";

export default function Page() {
  return (
    <PageAdmin>
      <FileStatistics />
      <div className="mb-10" />
      <FileGallery />
    </PageAdmin>
  );
}
