"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";

import { getAllPostByViewPublicNext } from "@/service/api/post/actions";
import type { Post } from "@/service/api/post/types";

type Props = {
  slug: string;
};

const HorizontalScrollingFeaturedArticles = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dataPost, setDataPost] = useState<Omit<Post, "content">[]>([]);

  // Fetch posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPostByViewPublicNext(1, 10);
        if (response.status === 200) {
          setDataPost(
            response?.data?.data.filter((item) => item.slug !== props.slug) ||
              []
          );
        }
      } catch (error) {
        // Handle error silently
      }
    };
    fetchData();
  }, []);

  // Control visibility based on page scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const listEmoji = [
    "🔥",
    "💥",
    "✨",
    "🌟",
    "🚀",
    "🌈",
    "🌠",
    "🌊",
    "🌪️",
    "🌍",
    "🌏",
    "🌌",
    "🎇",
    "🎆",
    "🌞",
    "🌝",
    "🌚",
    "🌜",
    "🌛",
    "⭐",
    "⚡",
    "☄️",
    "🌋",
    "🌀",
    "🌫️",
    "🌬️",
    "☀️",
    "🌤️",
    "🌥️",
    "🌦️",
    "🌧️",
    "🌨️",
    "🌩️",
    "🌪️",
    "🌈",
    "❄️",
    "☃️",
    "⛄",
    "🌊",
    "💧",
    "🔥",
    "🌿",
    "🍃",
    "🍂",
    "🍁",
    "🌾",
    "🌵",
    "🌴",
    "🌳",
    "🌲",
    "🌱",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌹",
    "🌷",
    "🌞",
    "🌝",
    "🌚",
    "🌜",
    "🌛",
    "⭐",
    "⚡",
    "☄️",
    "🌋",
    "🌀",
    "🌫️",
    "🌬️",
    "☀️",
    "🌤️",
    "🌥️",
    "🌦️",
    "🌧️",
    "🌨️",
    "🌩️",
    "🌪️",
    "🌈",
    "❄️",
    "☃️",
    "⛄",
    "🌊",
    "💧",
    "🔥",
    "🌿",
    "🍃",
    "🍂",
    "🍁",
    "🌾",
    "🌵",
    "🌴",
    "🌳",
    "🌲",
    "🌱",
    "🌺",
    "🌸",
    "🌼",
    "🌻",
    "🌹",
    "🌷",
  ];

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
    }
    return array;
  };

  let randomEmoji = shuffleArray(listEmoji);

  return (
    <>
      {dataPost && dataPost.length > 0 && (
        <div
          className={clsx(
            "w-full overflow-hidden",
            // Light mode: gradient từ xanh dương nhạt đến tím nhạt
            "bg-gradient-to-b from-blue-50 to-purple-100",
            // Dark mode: giữ nguyên gradient gốc
            "dark:bg-gradient-to-b dark:from-gray-900 dark:to-indigo-950",
            // Light mode: border xám nhạt
            "border-y border-gray-200",
            // Dark mode: border xám đậm
            "dark:border-y dark:border-gray-800",
            "fixed top-0 left-0 z-50",
            //"sm:hidden", // only show on mobile
            isVisible ? "block" : "hidden",
            "shadow-lg",
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Gradient overlays for fade effect */}
          <div className={clsx(
            "absolute inset-y-0 left-0 w-12 pointer-events-none z-10",
            // Light mode: gradient từ xanh dương nhạt
            "bg-gradient-to-r from-blue-50 to-transparent",
            // Dark mode: gradient từ xám đậm
            "dark:bg-gradient-to-r dark:from-gray-900 dark:to-transparent"
          )} />
          <div className={clsx(
            "absolute inset-y-0 right-0 w-12 pointer-events-none z-10",
            // Light mode: gradient từ xanh dương nhạt
            "bg-gradient-to-l from-blue-50 to-transparent",
            // Dark mode: gradient từ xám đậm
            "dark:bg-gradient-to-l dark:from-gray-900 dark:to-transparent"
          )} />

          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .scroll-container {
              display: inline-flex;
              animation: scroll 90s linear infinite;
            }

            .scroll-container.paused {
              animation-play-state: paused;
            }
          `}</style>

          <div className="overflow-hidden whitespace-nowrap py-1">
            <div className={`scroll-container ${isPaused ? "paused" : ""}`}>
              {/* First set of items */}
              {dataPost.map((article, index) => (
                <div
                  key={`original-${article._id}`}
                  className={clsx(
                    "inline-flex items-center mx-8 text-lg",
                    // Light mode: text màu xám đậm
                    "text-gray-800",
                    // Dark mode: text màu trắng
                    "dark:text-white"
                  )}
                >
                  <span className="text-xl mr-1">{randomEmoji[index]}</span>
                  <Link
                    title={article.title}
                    href={`/${article.slug}`}
                    className={clsx(
                      "inline-flex items-center text-lg",
                      // Light mode: text màu xám đậm
                      "text-gray-800",
                      // Dark mode: text màu trắng
                      "dark:text-white"
                    )}
                  >
                    <span className="mr-2 text-sm">{article.title}</span>
                  </Link>
                  <span className={clsx(
                    "text-sm",
                    // Light mode: text màu xám vừa
                    "text-gray-600",
                    // Dark mode: text màu xám nhạt
                    "dark:text-gray-400"
                  )}>
                    {article.view} <i className="bi bi-eye"></i>
                  </span>
                </div>
              ))}

              {/* Duplicated items to create seamless effect */}
              {dataPost.map((article, index) => (
                <div
                  key={`duplicate-${article._id}`}
                  className={clsx(
                    "inline-flex items-center mx-8 text-lg",
                    // Light mode: text màu xám đậm
                    "text-gray-800",
                    // Dark mode: text màu trắng
                    "dark:text-white"
                  )}
                >
                  <span className="text-xl mr-1">{randomEmoji[index]}</span>
                  <Link
                    title={article.title}
                    href={`/${article.slug}`}
                    className={clsx(
                      "inline-flex items-center text-lg",
                      // Light mode: text màu xám đậm
                      "text-gray-800",
                      // Dark mode: text màu trắng
                      "dark:text-white"
                    )}
                  >
                    <span className="mr-2 text-sm">{article.title}</span>
                  </Link>
                  <span className={clsx(
                    "text-sm",
                    // Light mode: text màu xám vừa
                    "text-gray-600",
                    // Dark mode: text màu xám nhạt
                    "dark:text-gray-400"
                  )}>
                    {article.view} <i className="bi bi-eye"></i>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HorizontalScrollingFeaturedArticles;