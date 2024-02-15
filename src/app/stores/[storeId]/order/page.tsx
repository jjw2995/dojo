"use client";

import { Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

/**
 * order
 * - type [table, togo]
 * - isPaid
 *
 *
 * ?tab= &
 *  new=1 &
 *  orderId=125
 *
 * order is togo | table
 * orderID exists | NULL
 *
 * https://nextjs.org/docs/app/api-reference/functions/use-search-params
 * https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams/set
 */

export default function Page({ params }: { params: { storeId: string } }) {
  const searchParams = useSearchParams();
  // const router = useRouter();
  // console.log(router.);

  console.log(searchParams.get("tab"));

  return (
    <Tabs
      defaultValue={searchParams.get("tab") ? searchParams.get("tab")! : "togo"}
    >
      <div className="mt-2 flex justify-center lg:mt-4">
        <TabsList className="w-full lg:w-96">
          <TabsTrigger className="text-xl lg:text-2xl" value="table" disabled>
            table
          </TabsTrigger>
          <TabsTrigger className="text-xl lg:text-2xl" value="togo">
            togo
          </TabsTrigger>
          <TabsTrigger className="text-xl lg:text-2xl" value="all">
            all
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="table"></TabsContent>
      <TabsContent value="togo">
        <Togo />
      </TabsContent>
      <TabsContent value="all"></TabsContent>
    </Tabs>
  );
}

function Togo() {
  return (
    <div>
      <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 lg:bottom-[2rem] lg:right-[47%]">
        <Plus />
      </Button>
    </div>
  );
}

function OrderScreen() {
  return <div>OrderScreen</div>;
}
