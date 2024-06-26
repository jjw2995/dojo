"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useEffect } from "react";
import Togo from "./_components/togo";

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
  const router = useRouter();
  const pathname = usePathname();

  const setTabParam = (tab: string) => {
    router.replace(`${pathname}?tab=${tab}`);
  };

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setTabParam("togo");
    }
  }, []);

  return (
    <Tabs
      defaultValue={searchParams.get("tab") ? searchParams.get("tab")! : "togo"}
      onValueChange={(value) => {
        setTabParam(value);
      }}
    >
      <div className="sticky top-0 flex justify-center bg-background py-2 md:py-4">
        <TabsList className="w-full md:w-96">
          <TabsTrigger className="text-xl md:text-2xl" value="table" disabled>
            table
          </TabsTrigger>
          <TabsTrigger className="text-xl md:text-2xl" value="togo">
            togo
          </TabsTrigger>
          <TabsTrigger className="text-xl md:text-2xl" value="all">
            all
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="pt-2">
        <TabsContent value="table"></TabsContent>
        <TabsContent value="togo">
          <Togo />
        </TabsContent>
        <TabsContent value="all"></TabsContent>
      </div>
    </Tabs>
  );
}
