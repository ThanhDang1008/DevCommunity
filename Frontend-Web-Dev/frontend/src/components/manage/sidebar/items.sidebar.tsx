import type { MenuProps } from "antd";
import Link from "next/link";
import {
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  UsbOutlined,
} from "@ant-design/icons";

export type MenuItem = Required<MenuProps>["items"][number];

export const items_menu: MenuItem[] = [
  {
    key: "/manage/dashboard",
    icon: <PieChartOutlined />,
    label: (
      <>
        <Link href="/manage/dashboard">Điều khiển</Link>
      </>
    ),
  },

  {
    key: "/manage/posts",
    icon: <i className="bi bi-postcard"></i>,
    label: (
      <>
        {/* <Link href="/manage/posts">Bài viết</Link> */}
        Bài viết
      </>
    ),
    children: [
      {
        key: "/manage/posts/view",
        icon: <i className="bi bi-file-earmark-text-fill"></i>,
        label: (
          <>
            <Link href="/manage/posts/view">Xem</Link>
          </>
        ),
      },
      {
        key: "/manage/posts/create",
        icon: <i className="bi bi-file-earmark-plus-fill"></i>,
        label: (
          <>
            <Link href="/manage/posts/create">Tạo</Link>
          </>
        ),
      },
      {
        key: "/manage/posts/tag",
        icon: <i className="bi bi-journal-text"></i>,
        label: (
          <>
            <Link href="/manage/posts/tag">Chủ đề</Link>
          </>
        ),
      },
    ],
  },

  {
    key: "/manage/cloud",
    icon: <i className="bi bi-cloud-arrow-up-fill"></i>,
    label: (
      <>
        <Link href="/manage/cloud">Cloud</Link>
      </>
    ),
  },
  {
    key: "/manage/users",
    icon: <i className="bi bi-people"></i>,
    label: (
      <>
        <Link href="/manage/users">Người dùng</Link>
      </>
    ),
  },
  {
    key: "/manage/statistics",
    icon: <i className="bi bi-bar-chart-fill"></i>,
    label: (
      <>
        <Link href="/manage/statistics">Thống kê</Link>
      </>
    ),
  },
  {
    key: "/manage/account",
    icon: <i className="bi bi-person-circle"></i>,
    label: (
      <>
        <Link href="/manage/account">Tài khoản</Link>
      </>
    ),
  },
  {
    key: "chat",
    label: "Chat",
    type: "group",
    children: [
      {
        key: "/manage/chat/group",
        icon: <i className="bi bi-chat-left-text-fill"></i>,
        label: (
          <>
            <Link href="/manage/chat/group">Nhóm của bạn</Link>
          </>
        ),
      },
      {
        key: "/manage/chat/community",
        icon: <i className="bi bi-globe"></i>,
        label: (
          <>
            <Link href="/manage/chat/community">Cộng đồng</Link>
          </>
        ),
      },
    ],
  },

  //------------------ setting ------------------
  {
    key: "setting",
    label: "Cài đặt",
    type: "group",
    children: [
      //   {
      //     key: "sub3",
      //     icon: <i className="bi bi-archive-fill"></i>,
      //     label: "Archive",
      //     children: [
      //       { key: "8", label: "Tom" },
      //       { key: "9", label: "Bill" },
      //       { key: "10", label: "Alex" },
      //     ],
      //   },
      // {
      //   key: "/manage/profile",
      //   icon: <i className="bi bi-person"></i>,
      //   disabled: true,
      //   label: (
      //     <>
      //       Hồ sơ 🆕
      //       <Link href="/manage/profile"></Link>
      //     </>
      //   ),
      // },
      {
        key: "/manage/tools",
        icon: <i className="bi bi-tools"></i>,
        disabled: true,
        label: (
          <>
            Công cụ ✨<Link href="/manage/tools"></Link>
          </>
        ),
      },
      {
        key: "/manage/trash",
        icon: <i className="bi bi-trash"></i>,
        disabled: true,
        label: (
          <>
            Thùng rác ✨<Link href="/manage/trash"></Link>
          </>
        ),
      },
      //   {
      //     key: "/manage/settings",
      //     icon: <i className="bi bi-gear"></i>,
      //     label: <>Tuỳ chỉnh</>,
      //     children: [
      //       {
      //         key: "theme",
      //         label: (
      //           <>
      //             <Switch
      //               checkedChildren="Sáng"
      //               unCheckedChildren="Tối"
      //               defaultChecked
      //               onChange={(checked:boolean) => {
      //                 console.log(checked);
      //                 return  setTheme(checked ? "LIGHTMODE" : "DARKMODE");
      //               }}
      //             />
      //           </>
      //         ),
      //       },
      //       { key: "151", label: "File 2" },
      //     ],
      //   },
    ],
  },
];
