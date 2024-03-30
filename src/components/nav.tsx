"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClipboardPen, CookingPot, Soup, Store } from "lucide-react";

// const navRoutes = ["order", "kitchen", "categories"];

export default function Nav({
  children,
  storeId,
}: {
  children: React.ReactNode;
  storeId: string;
}) {
  const curPath = usePathname();
  function isWordInPath(word: string) {
    return curPath.includes(word);
  }

  return (
    <div className="flex h-screen flex-col md:flex-row-reverse md:p-2">
      <div className="h-full overflow-auto md:w-full">{children}</div>
      <div className="flex justify-around border-t-[1px] p-3 font-medium leading-4 tracking-tight text-muted-foreground decoration-2 underline-offset-2 md:flex-col md:justify-normal md:space-y-6 md:border-none md:p-4">
        <Link
          className={`flex flex-col items-center text-center`}
          href={`/stores`}
        >
          <Store className="md:h-8 md:w-8" />
          stores
        </Link>

        {/* <Link
          className={isWordInPath("home") ? "underline underline-offset-2" : ""}
          href={`/stores/${storeId}/home`}
        >
          Home
        </Link> */}
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("order") ? "text-foreground" : ""
          }`}
          href={`/stores/${storeId}/order`}
        >
          <ClipboardPen className="md:h-8 md:w-8" />
          order
        </Link>
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("cook") ? "text-foreground" : ""
          }`}
          href={`/stores/${storeId}/cook`}
        >
          <CookingPot className="md:h-8 md:w-8" />
          cook
        </Link>
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("items") ? "text-foreground" : ""
          }`}
          href={`/stores/${storeId}/items`}
        >
          <Soup className="md:h-8 md:w-8" />
          items
        </Link>
      </div>
    </div>
  );
}
