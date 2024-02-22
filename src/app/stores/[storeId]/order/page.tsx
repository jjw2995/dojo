"use client";

import { Plus, ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "~/components/shadcn/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/shadcn/tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/shadcn/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/shadcn/accordion";

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

  // console.log(searchParams.get("tab"));

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
    <OrderView>
      <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 lg:bottom-[6rem] lg:right-[6rem] lg:h-[4rem] lg:w-[4rem]  ">
        <Plus />
      </Button>
    </OrderView>
  );
}

function OrderView({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen m-0 h-screen w-screen gap-0 p-0">
        <div className="mt-12"></div>
        <div className="flex h-screen w-screen flex-col lg:flex-row">
          <div
            className="flex-1 flex-col"
            onBlur={() => {
              // console.log("focus out");
            }}
          >
            <div className="h-[50%] bg-orange-200 lg:h-[50%]">orderList</div>
            <div>actionButtons</div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex-1 bg-green-300">itemList</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
