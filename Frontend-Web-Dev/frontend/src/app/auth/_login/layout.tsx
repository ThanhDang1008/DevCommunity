import RoleAccess from "@RoleAccess";
import { Metadata } from "next";
import { URL } from "@/constants/Common";

export const metadata: Metadata = {
  title: "Đăng nhập | minwandev.io.vn",
  description: `Đăng nhập để trải nghiệm các tính năng từ minwandev.io.vn`,
  applicationName: "Minh Quân Nguyễn | minwandev.io.vn",
  keywords: [
    "web development",
    "frontend development",
    "programming",
    "Minh Quân Nguyễn",
    "minwandev.io.vn",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
  ],
  icons: {
    icon: `${URL}/icon.png`,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `${URL}/auth/login`,
    siteName: "MinWanDev",
    title: "Đăng nhập | minwandev.io.vn",
    description: "Đăng nhập để trải nghiệm các tính năng từ minwandev.io.vn",
    images: [
      {
        url: `${URL}/icon.png`,
        width: 800,
        height: 600,
        alt: "Minh Quân Nguyễn | minwandev.io.vn",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: URL,
    languages: {
      vi: URL,
    },
  },
  //manifest: `/manifest.json`,
  twitter: {
    card: "summary_large_image",
    title: "Đăng nhập | minwandev.io.vn",
    description: `Đăng nhập để trải nghiệm các tính năng từ minwandev.io.vn`,
    images: [`${URL}/icon.png`],
  },
  //Document has a valid rel=canonical
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RoleAccess roles={["GUEST"]} routeAuth={true}>
        {children}
      </RoleAccess>
    </>
  );
}
