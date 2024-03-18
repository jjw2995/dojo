"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ClipboardPen, CookingPot, Soup, Store } from "lucide-react";

const navRoutes = ["order", "kitchen", "categories"];

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
    <div className="flex md:flex-row-reverse">
      <div className="w-full md:mx-4">{children}</div>
      <div className="fixed bottom-0 z-20 flex w-[100%] justify-around bg-background p-4 text-sm font-medium leading-4 tracking-tight text-muted-foreground decoration-2 underline-offset-2 md:relative md:bottom-auto md:flex md:w-auto md:flex-col md:justify-normal md:space-y-8 md:p-6 md:text-lg md:leading-4">
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
            isWordInPath("kitchen") ? "text-foreground" : ""
          }`}
          href={`/stores/${storeId}/kitchen`}
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
