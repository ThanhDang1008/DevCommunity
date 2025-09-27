"use client";

import { clsx } from "clsx";
import { ChevronDown, ChevronRight, List } from "lucide-react";
import { useState } from "react";

interface TocItem {
  title: string;
  id: string;
  tag: string; // "h2" | "h3" | "h4" | "h5" | "h6"
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
  collapsible?: boolean;
  showIcon?: boolean;
}

export const TableOfContentsSlug: React.FC<TableOfContentsProps> = ({
  items,
  className,
  collapsible = true,
  showIcon = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  const handleItemClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const getIndentLevel = (tag: string): number => {
    switch (tag) {
      case "h2":
        return 0;
      case "h3":
        return 1;
      case "h4":
        return 2;
      case "h5":
        return 3;
      case "h6":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <>
      {items.length > 0 && (
        <div
          className={clsx(
            "bg-white dark:bg-indigo-950 border border-gray-200 dark:border-violet-600 rounded-lg shadow-sm",
            "transition-all duration-200",
            className
          )}
        >
          {/* Header */}
          <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={clsx(
              "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700",
              "bg-gray-100 dark:bg-indigo-900 rounded-lg",
              "shadow-md transition-shadow duration-200",
            )}
          >
            <div className="flex items-center gap-2">
              {showIcon && (
                <List className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Mục lục
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({items.length})
              </span>
            </div>

            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={clsx(
                  "p-1 rounded-md transition-colors",
                  "hover:bg-gray-200 dark:hover:bg-indigo-700",
                  "text-gray-600 dark:text-gray-300"
                )}
                aria-label={isCollapsed ? "Mở rộng mục lục" : "Thu gọn mục lục"}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Content */}
          <div
            className={clsx(
              "transition-all duration-300 overflow-hidden",
              isCollapsed ? "max-h-0" : "max-h-none"
            )}
          >
            {items.length > 0 ? (
              <nav className="p-2">
                <ul className="space-y-1">
                  {items.map((item, index) => {
                    const indentLevel = getIndentLevel(item.tag);
                    const isActive = activeId === item.id;

                    return (
                      <li key={`${item.id}-${index}`}>
                        <button
                          title={item.title}
                          onClick={() => handleItemClick(item.id)}
                          className={clsx(
                            "w-full text-left px-3 py-2 rounded-md transition-all duration-150",
                            "flex items-start gap-2 group",
                            // Indent based on heading level
                            {
                              "ml-0": indentLevel === 0,
                              "ml-4": indentLevel === 1,
                              "ml-8": indentLevel === 2,
                              "ml-12": indentLevel === 3,
                              "ml-16": indentLevel === 4,
                            },
                            // Active state
                            isActive
                              ? "bg-blue-50 dark:bg-indigo-900 text-blue-700 dark:text-cyan-300 border-l-2 border-blue-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-zinc-100 dark:hover:bg-indigo-900 hover:text-gray-900 dark:hover:text-white",
                            // Focus state
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-indigo-800"
                          )}
                        >
                          {/* Bullet point */}
                          <span
                            className={clsx(
                              "flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 transition-colors",
                              isActive
                                ? "bg-blue-500 dark:bg-cyan-500"
                                : "bg-gray-400 dark:bg-gray-500 group-hover:bg-gray-600 dark:group-hover:bg-gray-400"
                            )}
                          />

                          {/* Title */}
                          <span
                            className={clsx(
                              "flex-1 leading-relaxed",
                              // Font size based on heading level
                              {
                                "text-base font-medium": item.tag === "h2",
                                "text-sm":
                                  item.tag === "h3" || item.tag === "h4",
                                "text-xs":
                                  item.tag === "h5" || item.tag === "h6",
                              }
                            )}
                          >
                            {item.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Không có mục lục nào</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
