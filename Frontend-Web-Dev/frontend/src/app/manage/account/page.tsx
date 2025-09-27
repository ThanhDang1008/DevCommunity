import { PageAdmin } from "../_components/page-admin";
import InfoUser from "@/modules/user/components/manage/InfoUser";
import FriendSuggestions from "@/modules/user/components/FriendSuggestions";
import FriendRequestList from "@/modules/user/components/FriendRequestList";
import { FriendsList } from "@/modules/user/components/FriendsList/FriendsList";

export default function Page() {
  return (
    <PageAdmin>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InfoUser />
        </div>
        <div>
          <FriendRequestList />
        </div>
      </div>
      <div className="mt-8">
        <FriendsList />
      </div>
      <div className="mt-8">
        <FriendSuggestions />
      </div>
    </PageAdmin>
  );
}
