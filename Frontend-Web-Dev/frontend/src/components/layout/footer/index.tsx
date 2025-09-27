import { Fragment } from "react";
import Link from "next/link";
import { readDataWebNext } from "@/service/api/web";
import clsx from "clsx";
// import ParseHTML from "@components/suneditor/parse";

type ItemChildCategory = {
  title: string;
  value: string;
};

type MainCategory = {
  title: string;
  value: string;
  children?: ItemChildCategory[];
};

const Footer = async () => {
  let topCategories: MainCategory[] = [];
  const totalItemRender = 9;

  try {
    const response = await readDataWebNext(true);
    if (response.status === 200) {
      topCategories = response?.data?.data?.header || [];
    }
  } catch (error) {}

  let footerContent =
    "<p>VNEWS247 aggregates and organizes information automatically by computer programs</p>";

  try {
    const response = await readDataWebNext(true);
    if (response.status === 200) {
      footerContent = response?.data?.data?.footer?.content || footerContent;
    }
  } catch (error) {}

  // Footer links
  const footerSections = [
    {
      title: "LIÊN HỆ",
      links: [
        { name: "Giới thiệu", href: "/gioi-thieu" },
        { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
        { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
        { name: "Quảng cáo", href: "/quang-cao" },
      ],
    },
    {
      title: "KHÁC",
      links: [{ name: "Tổng hợp", href: "/tong-hop" }],
    },
  ];

  return (
    <footer className="">
      {/* Header bar */}
      <div
        className={clsx(
          "w-full bg-[#e3d8ff] dark:bg-[#16073c] bg-opacity-90 dark:bg-opacity-80 py-3 px-4 backdrop-blur-sm flex justify-center items-center",
          "border-b border-t border-purple-300 dark:border-purple-800"
        )}
      >
        <div className="max-w-screen-xl w-full flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link
              href="/"
              className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-white transition-colors duration-300"
            >
              Devlogik
            </Link>
          </div>
        </div>
      </div>

      {/* Categories and footer content */}
      <div className="w-full bg-white dark:bg-[#010917] bg-opacity-95 dark:bg-opacity-95 py-6 px-4">
        {/* Categories */}
        <div className="">
          <div className="max-w-screen-xl mx-auto text-sm text-gray-600 dark:text-gray-300 flex flex-wrap">
            {/* Row 1 */}
            {topCategories.map((category, index) => {
              return (
                <Fragment key={index}>
                  {index > 0 && (
                    <span className="text-purple-500 dark:text-purple-600 mx-1">
                      ·
                    </span>
                  )}
                  <Link
                    title={category.title}
                    href={`/chu-de${category.value}`}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 mb-2"
                  >
                    {category.title}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <Fragment>
                      {category.children.map((child, childIndex) => {
                        return (
                          <Fragment key={childIndex}>
                            <span className="text-purple-500 dark:text-purple-600 mx-1">
                              ·
                            </span>
                            <Link
                              title={child.title}
                              href={`/chu-de${category.value}${child.value}`}
                              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 mb-2"
                            >
                              {child.title}
                            </Link>
                          </Fragment>
                        );
                      })}
                    </Fragment>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Site sections */}
        <div className="max-w-screen-xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-purple-600 dark:text-purple-400 font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-gray-500 dark:text-gray-400 mt-8 border-t border-gray-200 dark:border-purple-900 pt-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="footer-content text-sm">
              {/* <ParseHTML html={footerContent} /> */}
            </div>
            <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
              {/* © {new Date().getFullYear()} Minwandev.io.vn. All rights reserved. */}
              <p>
                Thiết kế và phát triển bởi{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-300">
                  Vo Thanh Dang
                </span>{" "}
                {/* (<span className="italic">Code Lyoko Team</span>) */}
              </p>
              <p>
                Cập nhật lần cuối:{" "}
                <span className="font-mono text-cyan-600 dark:text-cyan-400">
                  11/07/2025
                </span>
              </p>
              <p>© {new Date().getFullYear()}</p> email: td47023@gmail.com
              <p>
                Phiên bản:{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-300">
                  1.0.5
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
