"use client";

import { useState, useEffect } from "react";

export enum ScrollDirection {
  UP = "up",
  DOWN = "down",
}

const useScrollDirection = (height: number) => {
  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Only update isAtTop if its value actually changes to avoid rapid toggling
    const atTop = currentScrollY <= height;
    if (atTop !== isAtTop) {
      setIsAtTop(atTop);
    }

    const scrollDiff = currentScrollY - lastScrollY;
    if (Math.abs(scrollDiff) > height) {
      if (scrollDiff > 0) {
        setScrollDirection(ScrollDirection.DOWN);
      } else {
        setScrollDirection(ScrollDirection.UP);
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, height]);

  return {
    scrollDirection,
    isScrolledDown: scrollDirection === ScrollDirection.DOWN,
    isScrolledUp: scrollDirection === ScrollDirection.UP,
    isAtTop,
  };
};

export default useScrollDirection;
