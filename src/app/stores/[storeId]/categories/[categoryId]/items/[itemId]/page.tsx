"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
// import Link from "next/link";
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
  const router = useRouter();
  const details = api.item.get.useQuery({ itemId: Number(params.itemId) });

  return (
    <div className="flex h-screen w-screen bg-background">
      <ChevronLeft
        className="m-2 h-8 w-8 lg:hidden"
        onClick={() => {
          router.back();
        }}
      />
      {details.data ? (
        <div>
          <Label className="text-2xl">{details.data.item?.name}</Label>
          <Label className="text-2xl">{details.data.item?.price}</Label>
          <Label className="text-2xl">{details.data.item?.name}</Label>
        </div>
      ) : null}
      {/* <Label>{item.data? item.data.i.name}</Label> */}

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
