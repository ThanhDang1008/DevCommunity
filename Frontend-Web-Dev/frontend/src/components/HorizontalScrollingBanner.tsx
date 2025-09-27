"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const HorizontalScrollingBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollStart, setScrollStart] = useState(0);

  const bannerItems = [
    { id: 1, icon: "👋", text: "Welcome to my website" },
    { id: 2, icon: "👨🏼‍💻", text: "Proudly crafted by the devlogik team" },
    { id: 3, icon: "🚀", text: "A Passionate Web Developer" },
    { id: 4, icon: "📚", text: "Specialized in Information Technology" },
    { id: 5, icon: "💻", text: "Focused on Frontend Development" },
    { id: 6, icon: "☁️", text: "Exploring DevOps and Cloud Technologies" },
    { id: 7, icon: "🗄️", text: "Experienced in Backend Development" },
    { id: 8, icon: "🌐", text: "devlogik.minwandev.io.vn" },
    { id: 10, icon: "📈", text: "Optimizing Performance and Scalability" },
    { id: 11, icon: "🔧", text: "Building Robust Applications" },
    { id: 12, icon: "🌟", text: "Striving for Excellence in Every Project" },
  ];

  // Duplicate items for seamless scrolling
  const duplicatedItems = [...bannerItems, ...bannerItems];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const innerContainer = containerRef.current;
    if (!scrollContainer || !innerContainer) return;

    let animationId: number;
    let startTime: number | null = null;
    const containerWidth = innerContainer.clientWidth;

    const scroll = (timestamp: number) => {
      if (isHovering) {
        cancelAnimationFrame(animationId);
        return;
      }

      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Adjust speed by changing this value
      const scrollSpeed = 30;
      const scrollPos = scrollStart + (elapsed * scrollSpeed) / 1000;

      // Reset when we reach the end of first set of items
      if (containerWidth && scrollPos >= containerWidth) {
        startTime = timestamp;
        setScrollStart(0);
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = scrollPos;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isHovering, scrollStart]);

  const handleMouseEnter = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      setScrollStart(scrollContainer.scrollLeft);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className={clsx(
        "w-full overflow-hidden",
        "bg-gradient-to-b from-blue-50 to-purple-100 dark:from-gray-900 dark:to-indigo-950",
        "border-y border-gray-200 dark:border-gray-800"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Optional gradient overlay for fade effect on edges */}
      {/* Light mode gradients */}
      {/* <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-blue-50 dark:from-gray-900 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-purple-100 dark:from-gray-900 to-transparent pointer-events-none z-10" /> */}

      <div
        ref={scrollRef}
        className="flex whitespace-nowrap py-4 overflow-x-hidden"
      >
        <div ref={containerRef} className="flex items-center">
          {duplicatedItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="inline-flex items-center mx-6 text-lg text-gray-800 dark:text-white"
            >
              <span className="mr-2 text-xl">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollingBanner;
