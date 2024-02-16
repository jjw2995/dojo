"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  ChefHat,
  ClipboardList,
  ClipboardPen,
  CookingPot,
  Soup,
  Store,
} from "lucide-react";

const navRoutes = ["order", "kitchen", "categories"];

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  const curPath = usePathname();
  function isWordInPath(word: string) {
    return curPath.includes(word);
  }

  return (
    <div className="flex lg:flex-row-reverse">
      <div className="w-full">{children}</div>
      <div className="fixed bottom-0 z-20 flex w-[100%] justify-around p-6 text-sm font-medium leading-4 tracking-tight text-muted-foreground decoration-2 underline-offset-2 lg:relative lg:bottom-auto lg:flex lg:w-auto lg:flex-col lg:justify-normal lg:space-y-10 lg:p-8 lg:text-lg lg:leading-4">
        <Link
          className={`flex flex-col items-center text-center`}
          href={`/stores`}
        >
          <Store className="lg:h-8 lg:w-8" />
          stores
        </Link>

        {/* <Link
          className={isWordInPath("home") ? "underline underline-offset-2" : ""}
          href={`/stores/${params.storeId}/home`}
        >
          Home
        </Link> */}
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("order") ? "text-foreground" : ""
          }`}
          href={`/stores/${params.storeId}/order`}
        >
          <ClipboardPen className="lg:h-8 lg:w-8" />
          order
        </Link>
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("kitchen") ? "text-foreground" : ""
          }`}
          href={`/stores/${params.storeId}/kitchen`}
        >
          <CookingPot className="lg:h-8 lg:w-8" />
          cook
        </Link>
        <Link
          className={`flex flex-col items-center text-center ${
            isWordInPath("categories") ? "text-foreground" : ""
          }`}
          href={`/stores/${params.storeId}/categories`}
        >
          <Soup className="lg:h-8 lg:w-8" />
          items
        </Link>
      </div>
    </div>
  );
}

// function Nav({ storeId }: { storeId: string }) {
//   return (
//     <div className="lg:fix fixed bottom-0 right-[50%] flex w-[100%] translate-x-[50%] justify-around outline">
//       <Link className={`m-2 p-2`} href={`/stores/${storeId}/home`}>
//         Home
//       </Link>
//       <Link className={`m-2 p-2`} href={`/stores/${storeId}/order`}>
//         Order
//       </Link>
//       <Link className={`m-2 p-2`} href={`/stores/${storeId}/kitchen`}>
//         Kitchen
//       </Link>
//       <Link className={`m-2 p-2`} href={`/stores/${storeId}/items`}>
//         Items
//       </Link>
//     </div>
//   );
// }
