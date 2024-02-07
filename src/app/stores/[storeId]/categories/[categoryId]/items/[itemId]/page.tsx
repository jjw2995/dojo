import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";

export default async function Page({
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
  api.item.get.query({ itemId: Number(params.itemId) });
  console.log(params);

  return (
    <div className="block h-screen bg-background">
      <ChevronLeft className="h-8 w-8 lg:hidden" />
      <div>{params.itemId}</div>
    </div>
  );
}
