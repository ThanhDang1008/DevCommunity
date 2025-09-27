"use client";
import { useEffect } from "react";

const AutoScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <></>;
};

export default AutoScrollToTop;
