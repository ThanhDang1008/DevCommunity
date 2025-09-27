import type { ReactNode } from "react";

import RoleAccess from "@RoleAccess";
import LoadingGlobal from "@/components/ui/loading/loading.global";
import { PageAdmin } from "../_components/page-admin";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <PageAdmin>
        <RoleAccess
          customLoading={
            <>
              <LoadingGlobal />
            </>
          }
          roles={["ROOT", "ADMIN"]}
        >
          {children}
        </RoleAccess>
      </PageAdmin>
    </>
  );
}
