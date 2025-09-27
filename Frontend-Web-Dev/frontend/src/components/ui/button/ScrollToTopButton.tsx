"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import clsx from "clsx";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  // Xử lý hiển thị nút khi người dùng cuộn xuống đủ xa và xác định hướng cuộn
  useEffect(() => {
    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hiển thị nút khi cuộn xuống đủ xa
      if (currentScrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Handle scroll direction
      const scrollDiff = currentScrollY - lastScrollY;
      if (Math.abs(scrollDiff) > 100) {
        if (scrollDiff > 0) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý event khi click vào nút
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={clsx(
            "fixed p-3 rounded-full bg-purple-700 bg-opacity-80 hover:bg-purple-600 shadow-lg shadow-purple-900/50 backdrop-blur-sm text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group z-40",
            "right-6 bottom-6"
          )}
        >
          <ArrowUp size={18} className={clsx("group-hover:animate-bounce")} />
          <span className="sr-only">Scroll to top</span>
        </button>
      )}
    </>
  );
}
