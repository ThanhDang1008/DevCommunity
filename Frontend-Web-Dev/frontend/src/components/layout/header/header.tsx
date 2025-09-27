"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Sun, Moon, Menu, X } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useTheme, Theme } from "@/components/ThemeContext";
import useScrollDirection from "@/hooks/useScrollDirection.hook";
import { queryKeys } from "@/constants/Common";
import { readDataWeb } from "@/service/api/web";
import useClient from "@/hooks/useClient.hook";
import ModalLogout from "@/components/ui/modal/ModalLogout";
import ViewAccess from "@ViewAccess";
import LoginModal from "@/components/ui/modal/ModalLogin";
import { Role } from "@/constants/Common";
import LiquidGlassComponent from "@components/LiquidGlass/LiquidGlass";

import Sidebar from "./sidebar";

const Logo = () => {
  return (
    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-400 dark:from-indigo-300 dark:to-blue-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        className="w-6 h-6 text-white"
      >
        <path
          d="M12 22l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 10l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 6l-4 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const BtnThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  // console.log("theme", theme);
  return (
    <>
      {/* Theme Toggle */}
      <button
        onClick={() => {
          if (theme === Theme.LIGHT_MODE) {
            toggleTheme(Theme.DARK_MODE);
          } else if (theme === Theme.DARK_MODE) {
            toggleTheme(Theme.LIGHT_MODE);
          } else {
            alert(
              "Đã xảy ra lỗi khi chuyển đổi giao diện. Vui lòng thử lại sau."
            );
          }
        }}
        className="btn-glass glass p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
      >
        {theme === Theme.LIGHT_MODE ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
};

const BtnAccount = (props: { isSearchActive?: boolean }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isOpenModalLogout, setIsOpenModalLogout] = useState(false);
  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const Menu = [
    {
      title: "Tài khoản",
      href: "/manage/account",
      icon: <i className="bi bi-person-circle"></i>,
    },
    {
      title: "Đăng bài",
      href: "/manage/posts/create",
      icon: <i className="bi bi-pencil-square"></i>,
    },
    {
      title: "Quản lý bài viết",
      href: "/manage/posts/view",
      icon: <i className="bi bi-journal-text"></i>,
    },
    {
      title: "Đăng xuất",
      href: "/logout",
      icon: <i className="bi bi-box-arrow-right"></i>,
    },
  ];
  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };
  return (
    <>
      <ViewAccess
        roles={Object.values(Role)}
        error={
          <>
            <button
              title="Bắt đầu ngay"
              onClick={() => {
                setIsOpenLoginModal(true);
              }}
              className={clsx(
                "px-6 max-h-10 py-2 rounded-lg font-medium text-white transition-all duration-200",
                "bg-gradient-to-r from-[#6C47FF] to-[#5BC0FF] hover:brightness-110",
                "border-none",
                "line-clamp-1",
                props.isSearchActive && "hidden md:block"
              )}
            >
              Bắt đầu ngay
            </button>

            {isOpenLoginModal && (
              <LoginModal
                isOpen={isOpenLoginModal}
                onClose={() => {
                  setIsOpenLoginModal(false);
                }}
              />
            )}
          </>
        }
      >
        <button
          title="Quản lý"
          className={clsx(
            "px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200",
            "bg-white dark:bg-indigo-900/30",
            "border border-gray-300 dark:border-gray-500",
            "hover:bg-gray-100 dark:hover:bg-[#37365a]",
            props.isSearchActive && "hidden md:block",
            "relative",
            "btn-glass glass"
          )}
          onClick={() => toggleDropdown("account")}
        >
          <i className="bi bi-person-circle"></i>

          {openDropdown === "account" && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
              {Menu.map((item, index) => {
                if (item.title === "Đăng xuất") {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setIsOpenModalLogout(true);
                      }}
                      className={clsx(
                        "flex items-center px-4 py-2 text-sm  cursor-pointer",
                        "text-gray-700 dark:text-gray-300 hover:bg-red-500 dark:hover:bg-red-500",
                        "hover:text-white dark:hover:text-white"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      <span className="flex-1 text-left">{item.title}</span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={item.href}
                    title={item.title}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span className="flex-1 text-left">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </button>
        <ModalLogout
          isOpen={isOpenModalLogout}
          onClose={() => {
            setIsOpenModalLogout(false);
          }}
          isRefresh={false}
        />
      </ViewAccess>
    </>
  );
};

const BtnMenuToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="flex gap-5 md:hidden">
        <BtnThemeToggle />
        <button className="btn-glass glass p-2 text-gray-700 dark:text-gray-300">
          {isOpen ? (
            <X size={24} onClick={() => setIsOpen(false)} />
          ) : (
            <Menu size={24} onClick={() => setIsOpen(true)} />
          )}
        </button>
      </div>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

const Header = () => {
  const { isClient } = useClient();
  const { isScrolledDown, isAtTop } = useScrollDirection(100);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // const [categories, setCategories] = useState<MainCategory[]>([]);

  const {
    data: data_web,
    isLoading: isLoading_web,
    isError: isError_web,
    error,
  } = useQuery({
    queryKey: [queryKeys.GET_DATA_WEB],
    queryFn: () => readDataWeb(),
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false, //fetch dữ liệu khi mount component
    refetchInterval: false, //thời gian tự động fetch lại dữ liệu
    retry: 3,
    retryDelay: 2000,
    retryOnMount: true,
  });

  const categoriesData = useMemo(() => {
    if (
      data_web &&
      data_web?.data?.data?.header &&
      data_web?.data?.data?.header?.length > 0
    ) {
      return data_web.data.data.header;
    }
    return [];
  }, [data_web]);

  const menu = [
    {
      title: "🌍 Khám phá",
      value: "/kham-pha",
      children: [],
    },
    {
      title: "Giới thiệu",
      value: "#",
      children: [],
    },
    {
      title: "Chuyên mục",
      value: "#",
      children: [
        { title: "Lập trình", value: "#" },
        { title: "Công nghệ", value: "#" },
        { title: "Hướng dẫn", value: "#" },
      ],
    },
    {
      title: "Tính năng",
      value: "#",
      children: [
        { title: "Bình luận", value: "#" },
        { title: "Đánh dấu", value: "#" },
        { title: "Chia sẻ", value: "#" },
      ],
    },
  ];

  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  // Handle search activation
  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      // Focus input after animation
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  // Handle search blur
  const handleSearchBlur = () => {
    // Small delay to allow form submission if user clicks submit
    setTimeout(() => {
      setIsSearchActive(false);
      setSearchQuery("");
    }, 200);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // if (searchQuery.trim()) {
    //   console.log("Searching for:", searchQuery);
    //   // Implement search logic here
    // }
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchActive(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 w-full backdrop-blur-md border-b ",
          "shadow-lg bg-white/80 dark:bg-indigo-950/80 dark:shadow-indigo-800/30 border-gray-200/20 dark:border-gray-700/20",
          "glass",

          // "overflow-hidden",
          {
            //display none
            hidden: !isScrolledDown && !isAtTop,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" title="Trang chủ" className="flex items-center mr-2">
              <div className="flex items-center space-x-3">
                <Logo />
                <span className="btn-glass glass p-2 text-xl font-bold text-gray-900 dark:text-white">
                  Devlogik
                </span>
              </div>
            </Link>

            {/* Navigation - Hidden when search is active */}
            <nav
              className={clsx(
                "hidden md:flex items-center md:space-x-3 lg:space-x-6 xl:space-x-8 transition-all duration-300 ease-in-out",
                isSearchActive
                  ? "opacity-0 transform scale-95 pointer-events-none"
                  : "opacity-100 transform scale-100"
              )}
            >
              {menu.map((item, index) => {
                if (item.children.length > 0) {
                  return (
                    <div key={index} className="relative">
                      <button
                        className={clsx(
                          "flex items-center space-x-1 transition-colors duration-200",
                          "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                          "hover:bg-gray-100 dark:hover:bg-[#37365a] rounded-lg px-3 py-2",
                          "btn-glass glass"
                        )}
                        onClick={() => toggleDropdown(item.title)}
                        //onBlur={() => setOpenDropdown(null)}
                      >
                        <span>{item.title}</span>

                        <ChevronDown
                          size={16}
                          className={clsx(
                            "transition-transform duration-200",
                            openDropdown === item.title && "rotate-180"
                          )}
                        />
                      </button>

                      {openDropdown === item.title && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                          {item.title !== "Chuyên mục" &&
                            item.children.map((subItem, subIndex) => {
                              return (
                                <Link
                                  key={subIndex}
                                  href={subItem.value}
                                  title={subItem.title}
                                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {subItem.title}
                                </Link>
                              );
                            })}
                          {item.title === "Chuyên mục" &&
                            categoriesData.map((categorie, subIndex) => {
                              return (
                                <ul key={subIndex} className="space-y-1 group">
                                  <li className="relative">
                                    <Link
                                      href={`/chu-de${categorie.value}`}
                                      title={categorie.title}
                                      className="px-4 py-2 block text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      {categorie.title}
                                      {categorie.children &&
                                        categorie.children.length > 0 && (
                                          <ChevronDown
                                            size={16}
                                            className="inline ml-1"
                                          />
                                        )}
                                    </Link>
                                    {categorie.children &&
                                      categorie.children.length > 0 && (
                                        <div
                                          className={clsx(
                                            "absolute left-full top-0 mt-0 ml-0 min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pl-0 z-10",
                                            "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200",
                                            "py-2"
                                          )}
                                        >
                                          <ul className={clsx("space-y-1")}>
                                            {categorie.children.map(
                                              (childCategory, childIndex) => (
                                                <li key={childIndex}>
                                                  <Link
                                                    href={`/chu-de${categorie.value}${childCategory.value}`}
                                                    title={childCategory.title}
                                                    className="px-4 py-2 block text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                  >
                                                    {childCategory.title}
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                  </li>
                                </ul>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={item.value}
                    title={item.title}
                    className={clsx(
                      "line-clamp-1 transition-colors duration-200",
                      "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                      "hover:bg-gray-100 dark:hover:bg-[#37365a] rounded-lg px-3 py-2"
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* Search Form - Shows when search is active */}
            <div
              className={clsx(
                "absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out",
                isSearchActive
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none",
                "hidden md:block"
              )}
            >
              <div onSubmit={handleSearchSubmit} className="relative">
                {isClient && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={handleSearchBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm kiếm bài viết..."
                    spellCheck="false"
                    className={clsx(
                      "w-80 px-4 py-2 pl-10 pr-4 rounded-lg",
                      "bg-white dark:bg-gray-800",
                      "border border-gray-300 dark:border-gray-600",
                      "text-gray-900 dark:text-white",
                      "placeholder-gray-500 dark:placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400",
                      "transition-all duration-200"
                    )}
                  />
                )}

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search Icon */}
              {isClient && (
                <>
                  <button
                    onClick={handleSearchToggle}
                    className={clsx(
                      "hidden btn-glass glass md:block p-2 transition-all duration-200",
                      isSearchActive
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {isSearchActive ? <X size={20} /> : <Search size={20} />}
                  </button>
                  <BtnThemeToggle />
                  <BtnAccount isSearchActive={isSearchActive} />
                </>
              )}
              {/* Mobile Menu Button */}
            </div>

            <BtnMenuToggle />
          </div>
        </div>
      </header>

      {/* <div className="fixed top-20 left-0 w-full h-16 z-50 pointer-events-none">
        <LiquidGlassComponent>
          <h1 className="h-20">header</h1>
        </LiquidGlassComponent>
      </div> */}
    </>
  );
};

export default Header;
