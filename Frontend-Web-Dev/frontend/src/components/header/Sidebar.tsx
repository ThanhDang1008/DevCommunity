"use client";

import { useState, useEffect, useRef, cache } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ChevronDown, User, Search, Menu, X } from "lucide-react";

import NameAccount from "@/modules/user/components/NameAccountSidebar";
import { readDataWebNext } from "@/service/api/web";
import type {
  MainCategory,
  ItemChildCategory,
} from "@/service/api/web/types";
import useClient from "@/hooks/useClient.hook";

const readDataWebNextCache = cache(readDataWebNext);

const Sidebar = () => {
  const { isClient } = useClient();

  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await readDataWebNextCache(true);
      if (response.status === 200) {
        setMainCategories(response?.data?.data?.header || []);
      }
    };
    fetchData();
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  //console.log("mainCategories: ", mainCategories);

  return (
    <>
      {/* Custom scrollbar styles */}
   
      {/* Toggle Button - fixed to the left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed top-2 right-2 z-50 p-2 rounded-full shadow-lg",
          "bg-purple-700 bg-opacity-80 hover:bg-purple-600 text-white",
          "dark:bg-purple-700 dark:bg-opacity-80 dark:hover:bg-purple-600 dark:text-white",
          "block md:hidden"
        )}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={clsx(
          "fixed top-0 left-0 w-72 shadow-lg transition-transform duration-300 ease-in-out z-50",
          "bg-white text-gray-900 border-r border-gray-200",
          "dark:bg-gray-900 dark:text-white dark:border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "h-screen"
        )}
      >
        {/* Logo */}
        <div className="p-2 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <Link
            href="/"
            title="Minwandev"
            className={clsx(
              "font-bold text-lg bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 text-transparent bg-clip-text"
            )}
            onClick={() => setIsOpen(false)}
          >
            devlogik.minwandev.io.vn
          </Link>
        </div>

        <div
          className="custom-scrollbar-sidebar overflow-y-auto"
          style={{
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
                  className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-700"
                />
              </div>
            )}
          </div>

          {/* Discover */}
          <div className="px-4 py-3">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-2" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">KHÁM PHÁ</p>
          </div>

          {/* Navigation Links */}
          <nav className="px-4">
            <ul>
              {/* Main Categories */}
              {mainCategories.map((category: MainCategory, index: number) => {
                return (
                  <li key={index} className="mb-2">
                    <div
                      onClick={() => {
                        if (category.children && category.children.length > 0) {
                          toggleDropdown(category.value);
                        }
                      }}
                      className={clsx(
                        "flex justify-between items-center rounded",
                        "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <Link
                        title={category.title}
                        href={`/chu-de${category.value}`}
                        className={clsx(
                          "py-2 px-1 block text-sm rounded",
                          "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                          "dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
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
                        className={`mt-1 rounded overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-gray-800 ${
                          openDropdown === category.value
                            ? "max-h-80"
                            : "max-h-0"
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2 m-1">
                          {category.children.map(
                            (child: ItemChildCategory, childIndex: number) => {
                              return (
                                <Link
                                  key={childIndex}
                                  title={child.title}
                                  href={`/chu-de${category.value}${child.value}`}
                                  className="p-1 text-xs rounded text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-900"
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
            "fixed bottom-0 left-0 w-full p-2 border-t",
            "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800",
            "flex flex-col items-center justify-between gap-1"
          )}
        >
          <div className="flex items-center space-x-2">
            <Link
              href="https://www.facebook.com/quan.nguyen.896295"
              title="facebook"
              className="p-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i className="bi bi-facebook"></i>
            </Link>
            <Link
              href="https://github.com/MinWuan"
              title="github"
              className="p-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i className="bi bi-github"></i>
            </Link>
            <Link
              href="https://linkedin.com/in/quân-nguyễn-19b588321"
              title="linkedin"
              className="p-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i className="bi bi-linkedin"></i>
            </Link>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Minwandev.io.vn. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

// export default Sidebar;
