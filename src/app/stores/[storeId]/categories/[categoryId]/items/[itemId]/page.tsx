"use client";

import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/react";

export default function Page({
  params,
}: {
  params: {
    storeId: string;
    categoryId: string;
    itemId: string;
  };
}) {
  // export default function Page({ params }: { params: { storeId: string } }) {
  // api.item.
  const item = api.item.get.useQuery({ itemId: Number(params.itemId) });
  // console.log(params);
  console.log(item.data);

  return (
    <div className="block h-screen bg-background">
      <ChevronLeft className="h-8 w-8 lg:hidden" />
      {/* {item.data?.map((r, i) => {
        return (
          <div key={i}>
            <div>{r.item.name} </div>
          </div>
        );
      })} */}
    </div>
  );
}
