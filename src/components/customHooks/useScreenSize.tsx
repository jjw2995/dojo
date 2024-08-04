"use client";
import { useEffect, useState } from "react";

const SCREEN_THREASH_HOLD = { LG: 768, MD: 576 };

export default function useScreenSize() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function isLg() {
    return width >= SCREEN_THREASH_HOLD.LG;
  }

  function isMd() {
    return SCREEN_THREASH_HOLD.LG > width && width >= SCREEN_THREASH_HOLD.MD;
  }

  function isSm() {
    return width < SCREEN_THREASH_HOLD.MD;
  }

  return { isLg: isLg(), isMd: isMd(), isSm: isSm() };
}
