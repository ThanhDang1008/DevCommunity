"use client";

import { useEffect, useState } from "react";
import { Theme, useTheme } from "../ThemeContext";
import { useMobile } from "@/hooks/useMobile.hook";

interface CursorPosition {
  x: number;
  y: number;
}

const NeonRingCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const { theme } = useTheme();

  const { isMobile } = useMobile({
    breakpoint: 576,
    checkUserAgent: true, // Check user agent for mobile devices
    checkTouch: false,
  });

  const cursorColor = theme === Theme.DARK_MODE ? "#0ff" : "#0070f3";
  const ringBorder =
    theme === Theme.DARK_MODE
      ? "2px solid rgba(0, 255, 255, 0.8)"
      : "2px solid rgba(0, 112, 243, 0.8)";
  const ringShadow =
    theme === Theme.DARK_MODE
      ? "0 0 10px rgba(0, 255, 255, 0.5)"
      : "0 0 10px rgba(0, 112, 243, 0.3)";
  const dotShadow =
    theme === Theme.DARK_MODE
      ? "0 0 10px 2px rgba(0, 255, 255, 0.8), 0 0 20px 6px rgba(0, 255, 255, 0.4)"
      : "0 0 10px 2px rgba(0, 112, 243, 0.5), 0 0 20px 6px rgba(0, 112, 243, 0.2)";

  useEffect(() => {
    // Don't add event listeners if on mobile
    if (isMobile) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible]);

  if (isMobile) {
    return null;
  }

  return (
    <>
      {process.env.NODE_ENV !== "development" && (
        <style jsx global>{`
          body {
            cursor: none !important;
          }
          a,
          button,
          [role="button"],
          [class*="cursor-pointer"] {
            cursor: none !important;
          }
        `}</style>
      )}
      <div
        className={`fixed pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
        }}
      >
        <div
          className="cursor-dot"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: cursorColor,
            borderRadius: "50%",
            boxShadow: dotShadow,
          }}
        ></div>
      </div>

      <div
        className={`fixed pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9998,
          width: isClicking ? "24px" : "30px",
          height: isClicking ? "24px" : "30px",
          borderRadius: "50%",
          border: ringBorder,
          boxShadow: ringShadow,
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s, height 0.2s",
        }}
      ></div>
    </>
  );
};

export default NeonRingCursor;
