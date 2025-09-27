"use client";

import Link from "next/link";
import clsx from "clsx";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { readDataWeb } from "@/service/api/web";
import { queryKeys } from "@/constants/Common";

interface NavigationItem {
  icon: string;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarNavigationProps {
  className?: string;
}

// const navigationItems: NavigationItem[] = [
//   { icon: "🏠", label: "Home", href: "/", isActive: true },
//   { icon: "👨‍💻", label: "DEV++", href: "/dev-plus" },
//   { icon: "📖", label: "Reading List", href: "/reading-list" },
//   { icon: "🎙️", label: "Podcasts", href: "/podcasts" },
//   { icon: "📹", label: "Videos", href: "/videos" },
//   { icon: "🏷️", label: "Tags", href: "/tags" },
//   { icon: "🎓", label: "DEV Education Tracks", href: "/education-tracks" },
//   { icon: "🏆", label: "DEV Challenges", href: "/challenges" },
//   { icon: "💡", label: "DEV Help", href: "/help" },
//   { icon: "❤️", label: "Advertise on DEV", href: "/advertise" },
//   { icon: "✨", label: "DEV Showcase", href: "/showcase" },
//   { icon: "😎", label: "About", href: "/about" },
//   { icon: "🔍", label: "Contact", href: "/contact" },
//   { icon: "🛍️", label: "Forem Shop", href: "/shop" },
// ];

const ListCategories: React.FC<SidebarNavigationProps> = ({ className }) => {
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

  return (
    <nav
      className={clsx(
        "w-auto bg-white dark:bg-[#3825657d] rounded-lg shadow-md",
        // "h-full overflow-y-auto",
        className
      )}
    >
      <div className="py-4">
        <ul className="space-y-1 px-3">
          {categoriesData.length > 0 &&
            categoriesData.map((item, index) => (
              <li key={index}>
                <Link
                  href={`/chu-de/${item.value}`}
                  className={clsx(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    "hover:bg-gray-100 dark:hover:bg-[#3825657d] hover:text-violet-500 dark:hover:text-violet-400",

                    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {/* <span className="mr-3 text-lg">{item.icon}</span> */}
                  <span className="truncate">{item.title}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};

export default ListCategories;
export { ListCategories };
