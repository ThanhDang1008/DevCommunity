"use client";

import { useRef, useEffect, useCallback, use } from "react";
import useScrollDirection from "./useScrollDirection.hook";

type InfiniteScrollProps = {
  onIntersection: () => void;
  enabled?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  debounceMs?: number;
  scrollDirection?: "up" | "down" | false; // false means no scroll direction check
  scrollHeight?: number; // Optional, if you want to set a specific scroll height
};

const useInfiniteScroll = ({
  onIntersection,
  enabled = true,
  threshold = 0.1,
  rootMargin = "0px",
  debounceMs = 100,
  scrollDirection = "down",
  scrollHeight = 100, // Default height to consider for scroll direction
}: InfiniteScrollProps) => {
  const { isScrolledDown, isScrolledUp } = useScrollDirection(scrollHeight); // 100px is the height to consider for scroll direction
  const targetRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounceCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onIntersection();
    }, debounceMs);
  }, [onIntersection, debounceMs]);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
            if (
            entry.isIntersecting &&
            (
              scrollDirection === false ||
              (scrollDirection === "down" && isScrolledDown) ||
              (scrollDirection === "up" && isScrolledUp)
            )
            ) {
            debounceCallback();
          }
        });
      },
      {
        rootMargin, //khoảng cách giữa root và target
        threshold, //dùng để xác định khi nào callback sẽ được gọi
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, rootMargin, threshold, debounceCallback, targetRef]);

  return {
    targetRef,
  };
};

export default useInfiniteScroll;
