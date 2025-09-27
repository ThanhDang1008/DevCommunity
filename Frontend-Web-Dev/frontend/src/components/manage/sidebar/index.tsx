"use client";

import "./manage-sidebar.scss";
import Link from "next/link";
import React, { useState, useEffect, use } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Space,
  Dropdown,
  Avatar,
  Switch,
  Alert,
} from "antd";
const { Header, Content, Sider, Footer } = Layout;
import { usePathname } from "next/navigation";
import { UserOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { ChevronLeft, House } from "lucide-react";
import clsx from "clsx";

import { socketChatService } from "@/service/socket/chat/socketInstance";
import { eventSocket } from "@/constants/Common";

import { Theme, useTheme } from "@/components/ThemeContext";
import ModalLogout from "../../ui/modal/ModalLogout";
import AccountManage from "@/modules/user/components/manage/NameAccount";
import useScrollDirection from "@/hooks/useScrollDirection.hook";
import { useMobile } from "@/hooks/useMobile.hook";
import { useGetInfoUser } from "@/modules/user/hooks";

import { items_menu, MenuItem } from "./items.sidebar";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const { data: userInfo } = useGetInfoUser();
  const { theme, toggleTheme } = useTheme();
  const { isScrolledDown } = useScrollDirection(100);
  const isMobile = useMobile({
    breakpoint: 768, // breakpoint for mobile view
    checkUserAgent: false, // check user agent for mobile devices
    checkTouch: false, // check touch capability
  });
  //console.log("isMobile", isMobile);

  const [isSettings, setIsSettings] = useState(false);
  const [isOpenModalLogout, setIsOpenModalLogout] = useState(false);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [collapsed, setCollapsed] = useState(true);

  const optionDropDown = [
    {
      label: (
        <Link style={{ textDecoration: "none" }} href="/admin/account">
          <i className="bi bi-person-fill"></i> Account
        </Link>
      ),
      key: "0",
    },
  ];

  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  //console.log("pathname",pathname)

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  // useEffect(() => {
  //   //console.log("userInfo online", userInfo);
  //   if (!userInfo) return;
  //   socketChatService.connect();
  //   socketChatService.socketConnectionEvents();
    
  //   socketChatService.on(eventSocket.CONNECT, () => {
  //     socketChatService.emit("user_online", userInfo?._id);
  //   });
  //   return () => {
  //     socketChatService.emit("user_offline", userInfo?._id);
  //   };
  // }, [pathname]);

  const items_menu_addition: MenuItem[] = [
    {
      key: "/manage/settings",
      icon: <i className="bi bi-gear"></i>,
      label: <>Tuỳ chỉnh</>,
      children: [
        {
          key: "theme",
          label: (
            <>
              <Switch
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                value={theme === Theme.DARK_MODE ? true : false}
                onChange={(checked: boolean) => {
                  //console.log(checked);
                  return toggleTheme(
                    checked ? Theme.DARK_MODE : Theme.LIGHT_MODE
                  );
                }}
              />
            </>
          ),
        },
        //đặt lại mật khẩu
        {
          key: "/manage/reset-password",
          icon: <i className="bi bi-key-fill"></i>,
          label: (
            <>
              Đặt lại mật khẩu
              <Link href="/manage/reset-password"></Link>
            </>
          ),
        },
      ],
    },

    {
      key: "other",
      label: "",
      type: "group",
      children: [
        {
          key: "/manage/logout",
          icon: <i className="bi bi-box-arrow-right"></i>,
          label: (
            <>
              Đăng xuất
              <Link
                href="#"
                onClick={() => {
                  setIsOpenModalLogout(true);
                }}
              ></Link>
            </>
          ),
        },
        //thông tin
        {
          key: "/manage/info",
          icon: <i className="bi bi-info-circle"></i>,

          label: (
            <>
              Thông tin
              <Link href="/manage/info"></Link>
            </>
          ),
        },
        {
          key: "/manage/feedback",
          icon: <i className="bi bi-chat-left-text"></i>,
          disabled: true,
          label: (
            <>
              Phản hồi
              <Link href="/manage/feedback"></Link>
            </>
          ),
        },
        {
          key: "/manage/help",
          icon: <i className="bi bi-question-circle"></i>,
          disabled: true,
          label: (
            <>
              Trợ giúp
              <Link href="/manage/help"></Link>
            </>
          ),
        },
      ],
    },
    {
      key: "version",
      icon: <i className="bi bi-info-circle"></i>,
      label: (
        <>
          <p>Phiên bản 1.0.5</p>
        </>
      ),
    },
  ];

  // useEffect(() => {
  //   // Connect to the socket service when the component mounts
  //   socketChatService.connect();

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     //socketChatService.disconnect();
  //   };
  // }, []);

  const isPathChat = pathname.startsWith("/manage/chat/group/");

  return (
    <>
      <div
        className={`${
          theme === Theme.LIGHT_MODE ? "LIGHTMODE" : "DARKMODE"
        }-manage-sidebar`}
      >
        <Layout
          style={
            //   {
            //   // minHeight: "100vh",
            //   height: "100vh",
            // }
            isPathChat ? { height: "100vh" } : { minHeight: "100vh" }
          }
        >
          {/* {window.innerWidth >= 576 &&( */}
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="dark"
            // style={{
            //   overflow: "auto",
            //   height: "100vh",
            // }}
          >
            <div className="m-5">
              {collapsed ? (
                <Link
                  href="/"
                  className={clsx(
                    "flex justify-center items-center gap-2 transition-colors",
                    "dark:text-white hover:text-blue-400 text-zinc-600 dark:hover:text-blue-400"
                  )}
                >
                  <House className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className={clsx(
                    "flex items-center gap-2 transition-colors",
                    "dark:text-white hover:text-blue-400 text-zinc-600 dark:hover:text-blue-400"
                  )}
                >
                  <ChevronLeft className="w-6 h-6" />
                  Trang chủ
                </Link>
              )}
            </div>
            <Menu
              theme="dark"
              defaultSelectedKeys={selectedKeys}
              mode="inline"
              items={[...items_menu, ...items_menu_addition]}
            />
          </Sider>
          {/* )} */}

          <Layout>
            {!isScrolledDown && !isPathChat && (
              <Header>
                <Space>
                  <i
                    style={{
                      fontSize: 30,
                      padding: "9%",
                      cursor: "pointer",
                      color: "#008eff",
                    }}
                    onClick={showDrawer}
                    className="bi bi-list"
                  ></i>
                </Space>
                <AccountManage />
              </Header>
            )}

            <Content>
              {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}

              {children}
            </Content>

            {/* {!isScrolledDown && (
              <Footer
                style={{
                  background: "#2e2e2e",
                  boxShadow: "rgb(149 140 140) 0px 2px 8px",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1% 3%",
                  height: "7vh",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                    gap: 10,
                  }}
                >
                  <AccountManage />
                </div>
                <Space>
                  <i
                    style={{
                      fontSize: 30,
                      padding: "9%",
                      cursor: "pointer",
                      color: "#008eff",
                    }}
                    onClick={showDrawer}
                    className="bi bi-list"
                  ></i>
                </Space>
              </Footer>
            )} */}
          </Layout>
        </Layout>

        <Drawer
          title=""
          placement="top"
          width={500}
          onClose={onClose}
          open={open}
          className={`${
            theme === Theme.LIGHT_MODE ? "LIGHTMODE" : "DARKMODE"
          }-drawer-manage-sidebar`}
          // extra={
          //   <Space>
          //     <Button onClick={onClose}>Cancel</Button>
          //     <Button type="primary" onClick={onClose}>
          //       OK
          //     </Button>
          //   </Space>
          // }
        >
          <Menu
            theme={theme === Theme.LIGHT_MODE ? "light" : "dark"}
            defaultSelectedKeys={selectedKeys}
            mode="inline"
            items={[...items_menu, ...items_menu_addition]}
          />
        </Drawer>
      </div>

      <ModalLogout
        isOpen={isOpenModalLogout}
        onClose={() => setIsOpenModalLogout(false)}
        redirectPath="/"
      />
    </>
  );
};

export default Sidebar;

export const PageAdmin = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div
        style={{
          padding: 24,
          minHeight: "90vh",
          background: "#fff",
          borderRadius: 10,
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
        }}
        className="manage-page-admin"
      >
        {children}
      </div>
    </>
  );
};
