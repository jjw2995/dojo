"use client";
import { useEffect, useState } from "react";

export default function useClickOuter(ref: React.RefObject<HTMLElement>) {
  const [isClickedOuter, setIsClickedOuter] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsClickedOuter(true);
      } else {
        setIsClickedOuter(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return isClickedOuter;
}
