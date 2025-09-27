"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import NameAccount from "@/modules/user/components/NameAccountSidebar";
import { readDataWeb } from "@/service/api/web";
import useClient from "@/hooks/useClient.hook";
import { BtnThemeToggle } from "./header";
import { queryKeys } from "@/constants/Common";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Sidebar = (props: SidebarProps) => {
  const { isClient } = useClient();

  //const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        props.setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  //console.log("data_web: ", data_web);

  //console.log("mainCategories: ", mainCategories);

  return (
    <>
      {/* Custom scrollbar styles */}

      <style jsx>{`
        .custom-scrollbar-sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar-sidebar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 20px;
        }

        .dark .custom-scrollbar-sidebar::-webkit-scrollbar-track {
          background: #1f2937;
        }

        .dark .custom-scrollbar-sidebar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }

        .custom-scrollbar-sidebar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }

        .dark .custom-scrollbar-sidebar {
          scrollbar-color: #4b5563 #1f2937;
        }
      `}</style>

      {/* Backdrop overlay when sidebar is open */}
      {props.isOpen && (
        <div
          className={clsx(
            "fixed inset-0 bg-black h-screen bg-opacity-50 transition-opacity duration-300 ease-in-out",
            "z-40"
          )}
          onClick={() => props.setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={clsx(
          "fixed top-0 left-0 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg transition-transform duration-300 ease-in-out",
          props.isOpen ? "translate-x-0" : "-translate-x-full",
          "h-screen",
          "z-50"
        )}
      >
        {/* Logo */}
        <div className="p-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          {/* <img src="/image/minwandev.png" alt="Minwandev" className="h-6" /> */}
          <Link
            href="/"
            title="Minwandev"
            className={clsx(
              "font-bold text-lg bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text"
            )}
            onClick={() => props.setIsOpen(false)}
          >
            Devlogik
          </Link>
          <button
            className="ml-2 md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => props.setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="custom-scrollbar-sidebar overflow-y-auto"
          style={{
            //maxHeight: "calc(100vh - 150px)",
            height: "82vh",
          }}
        >
          {/* Login Button */}
          <NameAccount />

          {/* Search */}
          <div className="px-4 py-2">
            {isClient && (
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>

          {/* Discover */}
          <div className="px-4 py-3">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Chuyên mục
            </p>
          </div>

          {/* Navigation Links */}

          <nav className="px-4">
            <ul>
              {/* Main Categories */}
              {categoriesData.map((category, index: number) => {
                return (
                  <li key={index} className="mb-2">
                    <div
                      onClick={() => {
                        if (category.children && category.children.length > 0) {
                          toggleDropdown(category.value);
                        }
                      }}
                      className={clsx(
                        "flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      )}
                    >
                      <Link
                        title={category.title}
                        href={`/chu-de${category.value}`}
                        className={clsx(
                          "py-3 px-1 block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                          "hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        )}
                      >
                        <span>{category.title}</span>
                      </Link>
                      {category.children && category.children.length > 0 && (
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 text-gray-600 dark:text-gray-400 ${
                            openDropdown === category.value ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                    {/* Dropdown content */}
                    {category.children && category.children.length > 0 && (
                      <div
                        className={`mt-1 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden transition-all duration-300 ${
                          openDropdown === category.value
                            ? "max-h-80"
                            : "max-h-0"
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 m-1">
                          {category.children.map(
                            (child, childIndex: number) => {
                              return (
                                <Link
                                  key={childIndex}
                                  title={child.title}
                                  href={`/chu-de${category.value}${child.value}`}
                                  className="p-2 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-900 rounded"
                                >
                                  {child.title}
                                </Link>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* App Download */}
        <div
          className={clsx(
            "fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 p-2 border-t border-gray-200 dark:border-gray-800",
            "flex items-center justify-between gap-1"
          )}
        >
          <div className="flex flex-col items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                href="https://www.facebook.com/quan.nguyen.896295"
                title="facebook"
                className="p-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <i className="bi bi-facebook"></i>
              </Link>
              <Link
                href="https://github.com/MinWuan"
                title="github"
                className="p-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <i className="bi bi-github"></i>
              </Link>
              <Link
                href="https://linkedin.com/in/quân-nguyễn-19b588321"
                title="linkedin"
                className="p-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <i className="bi bi-linkedin"></i>
              </Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © 2025 devlogik.minwandev.io.vn. All rights reserved.
            </p>
          </div>
          <div>
            <BtnThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
