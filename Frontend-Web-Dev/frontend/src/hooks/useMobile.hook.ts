"use client";

import { useEffect, useState } from "react";

interface UseMobileOptions {
  breakpoint?: number;
  checkUserAgent?: boolean;
  checkTouch?: boolean;
}

export const useMobile = (options: UseMobileOptions = {}) => {
  const {
    breakpoint = 768,
    checkUserAgent = true,
    checkTouch = true,
  } = options;

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      let mobile = false;

      // Check screen width
      if (window.innerWidth <= breakpoint) {
        mobile = true;
      }

      // Check user agent if enabled
      if (checkUserAgent && !mobile) {
        mobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
      }

      // Check touch capability if enabled
      if (checkTouch && !mobile) {
        mobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      }

      setIsMobile(mobile);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, [breakpoint, checkUserAgent, checkTouch]);

  return {
    isMobile,
  };
};
