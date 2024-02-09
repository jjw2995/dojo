"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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

      <div className="fixed bottom-0 z-20 flex  w-[100%] justify-around bg-slate-200 p-4 lg:relative lg:bottom-auto lg:flex lg:w-[10%] lg:flex-col lg:justify-normal lg:space-y-5 lg:text-2xl">
        <Link
          // className={isWordInPath("stores") ? "underline underline-offset-4" : ""}
          href={`/stores`}
        >
          stores
        </Link>
        {navRoutes.map((r) => {
          return (
            <Link
              key={r}
              className={isWordInPath(r) ? "underline underline-offset-4" : ""}
              href={`/stores/${params.storeId}/${r}`}
            >
              {r === "categories" ? "items" : r}
            </Link>
          );
        })}
        {/* <Link className={`m-2 p-2`} href={`/stores/${params.storeId}/home`}>
          Home
        </Link>
        <Link className={`m-2 p-2`} href={`/stores/${params.storeId}/order`}>
          Order
        </Link>
        <Link className={`m-2 p-2`} href={`/stores/${params.storeId}/kitchen`}>
          Kitchen
        </Link>
        <Link
          className={`m-2 p-2`}
          href={`/stores/${params.storeId}/categories`}
        >
          Items
        </Link> */}
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
