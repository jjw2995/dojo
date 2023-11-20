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
    <>
      {children}
      <Nav storeId={params.storeId} />
    </>
  );
}

function Nav({ storeId }: { storeId: string }) {
  return (
    <div className="fixed bottom-0 right-[50%] flex w-[100%] translate-x-[50%] justify-around">
      <Link className={`m-2 p-2 text-lg`} href={`/stores/${storeId}/home`}>
        Home
      </Link>
      <Link className={`m-2 p-2 text-lg`} href={`/stores/${storeId}/order`}>
        Order
      </Link>
      <Link className={`m-2 p-2 text-lg`} href={`/stores/${storeId}/kitchen`}>
        Kitchen
      </Link>
      <Link className={`m-2 p-2 text-lg`} href={`/stores/${storeId}/items`}>
        Items
      </Link>
    </div>
  );
}
