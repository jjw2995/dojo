import { ChevronLeft } from "lucide-react";
import { getServerAuthSession } from "~/server/auth";
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
  const session = await getServerAuthSession();
  const asd = await api.item.get.query({ itemId: Number(params.itemId) });
  // console.log(params);

  return (
    <div className="block h-screen bg-background">
      <ChevronLeft className="h-8 w-8 lg:hidden" />
      <div>{params.itemId}</div>
      {/* <div>{asd}</div> */}
    </div>
  );
}
