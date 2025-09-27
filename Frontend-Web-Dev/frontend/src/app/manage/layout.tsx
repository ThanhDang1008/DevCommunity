import { ReactNode } from "react";
import type { Metadata } from "next";

import Sidebar from "@/components/manage/sidebar";
import RoleAccess from "@RoleAccess";
import { URL } from "@/constants/Common";
import LayoutChat from "@/modules/chat/components/LayoutChat";

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Quản lý",
  description: "Quản lý hệ thống",
  icons: {
    icon: `${URL}/icon.png`,
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <RoleAccess roles={["ROOT", "ADMIN", "USER"]}>
        <Sidebar>
          <LayoutChat>
            {children}
            </LayoutChat>
        </Sidebar>
      </RoleAccess>
    </>
  );
}
