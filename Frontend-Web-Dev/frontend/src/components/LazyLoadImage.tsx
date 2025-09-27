"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { URL } from "@/constants/Common";

type LazyLoadImageProps = {
  options: any;
  height: string;
  width: string;
  isLoading?: boolean;
};

export default function LazyLoadImage(props: LazyLoadImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Chỉ quan sát một lần
        }
      },
      { threshold: 0.1 } // Khi 10% ảnh xuất hiện thì load
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (props.isLoading) {
    return (
      <div
        className={clsx(
          `flex justify-center items-center ${props.width} ${props.height} bg-gray-200 animate-pulse`
        )}
      >
        <i className="bi bi-image text-gray-400 text-4xl" />
      </div>
    );
  }

  return (
    <div ref={imgRef}>
      {isVisible ? (
        <>
          <Image {...props.options} />
        </>
      ) : (
        <div
          className={clsx(
            `flex justify-center items-center ${props.width} ${props.height} bg-gray-200 animate-pulse`
          )}
        >
          <i className="bi bi-image text-gray-400 text-4xl" />
        </div>
      )}
    </div>
  );
}
