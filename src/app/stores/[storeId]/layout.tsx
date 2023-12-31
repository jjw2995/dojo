// "use client";
import Link from "next/link";

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
    <div className="flex w-screen">
      <div className="fixed bottom-0 z-20 flex w-[100%] justify-around outline lg:relative lg:bottom-auto lg:flex lg:w-[10%] lg:flex-col lg:justify-normal">
        <Link className={`m-2 p-2`} href={`/stores/${params.storeId}/home`}>
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
        </Link>
      </div>
      <div className="w-full">{children}</div>
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
