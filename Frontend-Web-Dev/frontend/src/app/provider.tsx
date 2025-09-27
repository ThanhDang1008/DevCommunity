"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import * as React from "react";

// import { MainErrorFallback } from '@/components/errors/main';
// import { Notifications } from '@/components/ui/notifications';
//import { queryConfig } from "@/lib/react-query";
import { AuthWrapper } from "@/components/auth/auth.wrapper";
import { ThemeProvider } from "@/components/ThemeContext";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Theme } from "@/components/ThemeContext";
import AntdConfigProvider from "@/lib/antd.config";
import NextAuthWrapper from "@/lib/next.auth.wrapper";

// import { App } from "antd";

//------------------------------- FIX ANT DESIGN v5 on React 19 -------------------------------
//source: https://github.com/ant-design/v5-patch-for-react-19
import { unstableSetRender } from "antd";
import { createRoot } from "react-dom/client";

type RenderType = NonNullable<Parameters<typeof unstableSetRender>[0]>;
type ContainerType = Parameters<RenderType>[1] & {
  _reactRoot?: ReturnType<typeof createRoot>;
};

unstableSetRender((node, container: ContainerType) => {
  container._reactRoot ||= createRoot(container);
  const root: ReturnType<typeof createRoot> = container._reactRoot;
  root.render(node);

  return () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        root.unmount();
        resolve();
      }, 0);
    });
});
//--------------------------------------------------------------------------------

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider
        attribute={["class", "data-theme"]} // sử dụng cả class và data-theme
        defaultTheme={Theme.LIGHT_MODE} // mặc định là light mode
        enableSystem // cho phép người dùng chọn theme mặc định
        themes={[Theme.LIGHT_MODE, Theme.DARK_MODE]} // danh sách các theme có sẵn
        storageKey="theme" // khóa lưu trữ theme trong localStorage
        disableTransitionOnChange // tắt hiệu ứng chuyển đổi khi thay đổi theme
      >
        <ThemeProvider>
          <AntdConfigProvider>
            <AntdRegistry>
              <NextAuthWrapper>
                <AuthWrapper>
                  {children}
                </AuthWrapper>
              </NextAuthWrapper>
            </AntdRegistry>
          </AntdConfigProvider>
        </ThemeProvider>
      </NextThemeProvider>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
};
