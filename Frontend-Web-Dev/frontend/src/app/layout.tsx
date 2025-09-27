import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AppProvider } from "@/app/provider";

import { URL } from "@/constants/Common";
import Head from "next/head";
import { metadataGlobal } from "@/config/seo";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = metadataGlobal;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Head>
          <link rel="canonical" href={`${URL}`} key="canonical" />
        </Head>

        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
