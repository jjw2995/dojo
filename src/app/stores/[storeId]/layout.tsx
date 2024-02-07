// "use client";
import Link from "next/link";

const navRoutes = ["home", "order", "kitchen", "categories"];

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  return (
    <div className="flex lg:flex-row-reverse">
      <div className="w-full">{children}</div>

      <div className="fixed bottom-0 z-20 flex w-[100%] justify-around bg-background p-2 outline lg:relative lg:bottom-auto lg:flex lg:w-[10%] lg:flex-col lg:justify-normal lg:space-y-4">
        {/* <div className="fixed bottom-0 z-20 flex w-[100%] justify-around bg-background outline lg:relative lg:bottom-auto lg:flex lg:w-[10%] lg:flex-col lg:justify-normal"> */}
        <Link className="active:bg-slate-500" href={`/stores`}>
          Stores
        </Link>
        {navRoutes.map((r) => {
          return (
            <Link
              key={r}
              className="active:bg-slate-500"
              href={`/stores/${params.storeId}/${r}`}
            >
              {r}
            </Link>
          );
        })}
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
