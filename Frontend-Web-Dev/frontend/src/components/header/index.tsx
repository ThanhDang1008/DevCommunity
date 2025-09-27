"use client";

import "./header.scss";
// import styles from "./header.module.scss";
// import classNames from "classnames/bind";
import { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
import useScrollDirection from "@/hooks/useScrollDirection.hook";

// const cx = classNames.bind(styles);

type HeaderProps = {
  children?: React.ReactNode;
  logo: React.ReactNode;
};

const Header = (props: HeaderProps) => {
  const { isScrolledDown } = useScrollDirection(100);

  const [scrolledDown, setScrolledDown] = useState(false);
  // const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
  //   null
  // );

  useEffect(() => {
    //let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = window.innerHeight * 0.05; // 5%

      // Handle scrolled down state
      if (currentScrollY > threshold && !scrolledDown) {
        setScrolledDown(true);
      } else if (currentScrollY <= threshold && scrolledDown) {
        setScrolledDown(false);
      }

      // Handle scroll direction
      // const scrollDiff = currentScrollY - lastScrollY;
      // if (Math.abs(scrollDiff) > 100) {
      //   if (scrollDiff > 0) {
      //     setScrollDirection("down");
      //   } else {
      //     setScrollDirection("up");
      //   }
      //   lastScrollY = currentScrollY;
      // }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolledDown]);

  //console.log("scrollDirection: ", scrollDirection);

  return (
    <>
      <header
        className={`custom-bg-light-container dark:custom-bg-dark-container site-header`}
      >
        <div className={"header"}>
          <div className={`header-top`}>
            <div className={`container`}>{props.logo}</div>
          </div>
          <div
            style={{
              display: isScrolledDown ? "none" : "block",
            }}
            className={`header-bottom ${scrolledDown ? "is-sticky" : ""}`}
          >
            {props.children}
          </div>
        </div>
      </header>
      {/* <Sidebar /> */}
    </>
  );
};
// export default Header;
