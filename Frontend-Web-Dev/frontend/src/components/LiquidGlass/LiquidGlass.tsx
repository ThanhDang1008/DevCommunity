"use client";
import "./LiquidGlassEffect.scss";

import React, { useRef, useEffect, useState } from "react";

const LiquidGlassComponent = ({ children }: { children: React.ReactNode }) => {
  const glassRef = useRef<any>(null);
  const feTurbulenceRef = useRef<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      // Lấy vị trí chuột tương đối với phần tử .glass
      if (glassRef.current) {
        const rect = glassRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setMousePosition({ x: mouseX, y: mouseY });
      }
    };

    const glassElement = glassRef.current;
    if (glassElement) {
      glassElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (glassElement) {
        glassElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    // Điều chỉnh thuộc tính 'baseFrequency' của feTurbulence để tạo hiệu ứng biến dạng
    // dựa trên vị trí chuột.
    // Điều này tạo ra một hiệu ứng 'sóng' cục bộ khi di chuột.
    if (feTurbulenceRef.current) {
      // Chúng ta có thể điều chỉnh tần số nhiễu theo vị trí chuột
      // hoặc một giá trị animation time để tạo hiệu ứng chảy
      // Ở đây, tôi sẽ dùng mousePosition để làm ví dụ tạo hiệu ứng cục bộ.
      // Bạn có thể thêm animation timer để làm nó "chảy" liên tục.

      // Ví dụ đơn giản: thay đổi tần số nhỏ dựa vào vị trí chuột
      // Điều này chỉ là một cách tiếp cận, bạn cần thử nghiệm để có hiệu ứng mong muốn.
      const maxFrequency = 0.05;
      const minFrequency = 0.01;
      const rect = glassRef.current.getBoundingClientRect();

      // Normalize mouse position to [0, 1] relative to the element
      const normalizedX = mousePosition.x / rect.width;
      const normalizedY = mousePosition.y / rect.height;

      // Calculate frequency based on mouse proximity to center (example)
      // Or you can create a ripple effect by moving the origin of turbulence
      // For a "liquid" effect, you might continuously animate the baseFrequency
      // or the seed attribute.

      // Let's try animating the 'seed' attribute for a continuous flow
      // or change 'baseFrequency' based on a time variable for continuous flow
      // For a "distort on hover/mouse move" effect:
      // You might change the 'scale' attribute of feDisplacementMap,
      // or dynamically change the baseFrequency for a localized ripple effect.

      // Simple animation of 'seed' for continuous flow (not directly tied to mouse position for 'distortion map')
      const animationTime = Date.now() * 0.0001; // Scale time for slow animation
      feTurbulenceRef.current.setAttribute(
        "baseFrequency",
        `${0.01 + Math.sin(animationTime) * 0.005} ${
          0.01 + Math.cos(animationTime) * 0.005
        }`
      );
      feTurbulenceRef.current.setAttribute("seed", animationTime * 100);

      // For more direct mouse distortion, you'd likely use the mouse position
      // to offset the feTurbulence's origin or control feDisplacementMap's scale more directly.
      // This part would need more complex shader-like logic to create localized ripples.
    }

    // Request animation frame for continuous updates, if needed
    const animationFrameId = requestAnimationFrame(() => {
      // Re-run this effect for continuous animation (if you want flow)
      // For simple hover distortion, this useEffect might only run once on hover.
      // This is a simplified example.
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePosition]); // Re-run effect when mousePosition changes or for continuous animation

  return (
    <div className="liquid-glass-container">
      {/* Các hình ảnh phía dưới, sẽ bị biến dạng */}
      <div className="background-images">
        <img
          src="https://via.placeholder.com/200x150/FF5733/FFFFFF?text=Image+1"
          alt="Background 1"
        />
        <img
          src="https://via.placeholder.com/200x150/33FF57/FFFFFF?text=Image+2"
          alt="Background 2"
        />
        <img
          src="https://via.placeholder.com/200x150/3357FF/FFFFFF?text=Image+3"
          alt="Background 3"
        />
      </div>

      <div className="glass-overlay-wrapper">
        <div
          ref={glassRef}
          className="glass"
          style={{ filter: "url(#liquidGlassFilter)" }}
        >
          {children}
          <h2 className="overlay-text">Hiệu ứng Kính Lỏng</h2>
          <button className="btn-glass">Thử Click</button>
        </div>
      </div>

      {/* SVG Filters Definition */}
      <svg width="0" height="0" className="svg-filters">
        <filter id="liquidGlassFilter">
          {/* Tạo nhiễu dùng làm bản đồ dịch chuyển */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01" // Tần số cơ bản của nhiễu. Có thể thay đổi bằng JS.
            numOctaves="3"
            seed="0" // Seed để tạo mẫu nhiễu. Có thể thay đổi để tạo animation.
            result="noise"
            ref={feTurbulenceRef} // Tham chiếu đến feTurbulence
          />
          {/* Làm mờ nhiễu để có hiệu ứng mượt mà hơn */}
          <feGaussianBlur in="noise" stdDeviation="0.5" result="blurNoise" />
          {/* Áp dụng bản đồ dịch chuyển */}
          <feDisplacementMap
            in="SourceGraphic" // Áp dụng lên chính phần tử HTML
            in2="blurNoise" // Sử dụng kết quả nhiễu đã làm mờ làm bản đồ dịch chuyển
            scale="10" // Mức độ dịch chuyển pixel. Có thể thay đổi bằng JS.
            xChannelSelector="R" // Kênh màu Đỏ của nhiễu ảnh hưởng đến dịch chuyển X
            yChannelSelector="G" // Kênh màu Xanh lá của nhiễu ảnh hưởng đến dịch chuyển Y
          />
        </filter>
      </svg>
    </div>
  );
};

export default LiquidGlassComponent;
