"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  Minus,
  Plus,
  X,
  SplitSquareVertical,
  NotebookPen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import React, { forwardRef, useEffect, useState } from "react";
import useIsScreenLg from "~/components/customHooks/useIsScreenLg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { cn } from "~/components/lib/utils";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { OrderContextProvider, useOrder } from "../(contexts)/orderContext";
import {
  OrderInfoContextProvider,
  useOrderInfo,
} from "../(contexts)/orderInfoContext";
import { type orderMode } from "~/components/enums";

type Category = RouterOutputs["category"]["get"][number];

// TODO: oderview layout cleanup
export default function OrderView({
  children,
  orderMode,
}: {
  children: React.ReactNode;
  orderMode: orderMode;
}) {
  // TODO: something wrong with how orderList is interacting with orderButtons

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col rounded-none md:rounded-none">
        <OrderInfoContextProvider>
          <OrderContextProvider>
            <DialogHeader className="text-start">
              <TitleOrderInfo orderMode={orderMode} />
            </DialogHeader>
            {/* come back werid lg screen */}
            <div className="flex h-full max-w-full flex-col rounded-none md:flex-row">
              <div className="flex h-[20rem] flex-col md:h-[52rem] md:w-[45%]">
                {/* <div className="flex h-[20rem] flex-col outline md:h-[50rem] md:w-[45%]"> */}
                <OrderList className="flex-1" />
                <ActionButtons type={orderMode} />
              </div>
              <CategoryList className="flex h-[20rem] overflow-y-scroll md:mt-0 md:h-full md:flex-1" />
            </div>
          </OrderContextProvider>
        </OrderInfoContextProvider>
      </DialogContent>
    </Dialog>
  );
}

function TitleOrderInfo({ orderMode }: { orderMode: orderMode }) {
  const orderInfo = useOrderInfo();

  return (
    <DialogTitle className="flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            // className=""
            size="sm"
            //   className="text- decoration-slate-400 underline-offset-2"
          >
            Table Info
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Table Info</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderMode" className="text-right">
                OrderMode
              </Label>
              <Input
                id="orderMode"
                className="col-span-3"
                disabled
                value={orderMode}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderName" className="text-right">
                Name
              </Label>
              <Input
                id="orderName"
                className="col-span-3"
                placeholder="uber #2145"
                value={orderInfo.tableName}
                onChange={(e) => {
                  orderInfo.fn.setTableName(e.target.value);
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="ml-2 flex flex-1">
        <div className="flex flex-1 basis-1/3 flex-col md:w-[20rem] md:flex-none">
          <span>
            {orderInfo.tableName ? orderInfo.tableName : "uber #1253"}
          </span>
          <span className="text-sm">{orderMode.toUpperCase()}</span>
        </div>
        <div className="flex flex-1 basis-2/3 flex-col">
          <span>prep by</span>
          <span>created at</span>
        </div>
      </div>
    </DialogTitle>
  );
}

function OrderList({ className }: { className?: string }) {
  const order = useOrder();
  const { cursor, list } = order;
  const { onGroup, onItem, onOption } = cursor;

  return (
    // https://github.com/shadcn-ui/ui/issues/1151
    <div className={cn("overflow-y-scroll", className)}>
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="pointer-events-none">
            <TableHead className="w-8">#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="w-6">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((listGroup, gk) => {
            return (
              <React.Fragment key={`subgroup_${gk}`}>
                {listGroup.map((item, ik) => {
                  return (
                    <React.Fragment key={`item_${ik}`}>
                      <TableRow
                        onClick={(e) => {
                          order.fn.setCursor({ onGroup: gk, onItem: ik });
                        }}
                        data-even={gk % 2 === 0}
                        data-selected={onGroup === gk && onItem === ik}
                        className="data-[even=true]:bg-yellow-10 border-t-slate-500 data-[selected=true]:bg-muted"
                      >
                        <TableCell>{ik}</TableCell>
                        <TableCell className="border-l">{item.name}</TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
                <TableRow className="border-2 border-slate-900" />
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ActionButtons({
  className,
  type,
}: {
  className?: string;
  type: orderMode;
}) {
  const isScreenLg = useIsScreenLg();
  const [isOpen, setOpen] = useState(false);
  const order = useOrder();
  const info = useOrderInfo();
  const utils = api.useUtils();
  const orderCreate = api.order.create.useMutation({
    onSuccess: () => {
      // order.fn.clearList()
      void utils.order.getTogoOrders.invalidate();
    },
  });
  //   console.log(order.list);

  useEffect(() => {
    if (isScreenLg) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isScreenLg]);

  return (
    <div className={cn("bg-background pt-2 md:static", className)}>
      <div className="grid grid-cols-5 gap-2">
        <Button disabled className="md:h-[3rem] md:text-2xl">
          <X />
        </Button>
        <Button
          onClick={() => {
            order.fn.decCursor();
          }}
          className="md:h-[3rem] md:text-2xl"
        >
          <Minus />
        </Button>
        <Button
          onClick={() => {
            order.fn.incCursor();
          }}
          className="md:h-[3rem] md:text-2xl"
        >
          <Plus />
        </Button>
        <Button
          onClick={() => {
            order.fn.addGroup();
          }}
          className="md:h-[3rem] md:text-2xl"
        >
          <SplitSquareVertical />
        </Button>
        <Button disabled className="md:h-[3rem] md:text-2xl">
          <NotebookPen />
        </Button>
      </div>
      <Collapsible.Root
        open={isOpen}
        className="fixed left-0 right-0 z-10 justify-center px-6 md:static md:px-0"
      >
        <Collapsible.Content className="relative grid grid-cols-2 gap-2 border-b-2 bg-background pt-2 data-[state=open]:pb-2 md:static md:border-0">
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Split
          </Button>
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Bill
          </Button>
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Payment
          </Button>
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Price Edit
          </Button>
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Discount
          </Button>
          <Button
            onClick={() => {
              void orderCreate.mutate({
                dedupeId: Date.now(),
                list: order.list,
                name: info.tableName,
                type,
              });
            }}
            disabled={order.isOrderListEmpty}
            className="md:h-[3rem] md:text-2xl"
          >
            Save Order
          </Button>
        </Collapsible.Content>
        <div className="flex justify-center">
          <Collapsible.Trigger
            disabled={isScreenLg}
            onClick={() => {
              setOpen((r) => !r);
            }}
            className="rounded-b-full bg-background data-[state=open]:fixed data-[state=open]:h-screen data-[state=open]:w-screen data-[state=open]:bg-slate-600 data-[state=open]:opacity-20 md:hidden [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDown className="h-8 w-8" />
          </Collapsible.Trigger>
        </div>
      </Collapsible.Root>
    </div>
  );
}

const CategoryList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const categories = api.category.get.useQuery();
  //   console.log(categories.data);

  return (
    <div className={className} ref={ref} {...props}>
      <Accordion className="no-scrollbar flex-1" type="multiple">
        <div className="relative md:mx-4 md:mb-0">
          {categories.data?.map((category) => {
            return (
              <Category key={`catId_${category.id}`} category={category} />
            );
          })}
        </div>
      </Accordion>
    </div>
  );
});

CategoryList.displayName = "CategoryList";

function Category({ category }: { category: Category }): React.ReactNode {
  const items = category.items;
  const order = useOrder();

  console.log(order.cursor);

  return (
    <AccordionItem value={"category" + category.id.toString()}>
      <div className="sticky top-0 bg-background p-2">
        <AccordionTrigger disabled={items.length < 1} asChild>
          <div>
            {category.id}-{category.name}
            {/* <CategoryMenu categoryId={category.id} /> */}
          </div>
        </AccordionTrigger>
      </div>

      {items.map((item, idx) => {
        return (
          <AccordionContent
            key={`${item.id}_${idx.toString()}`}
            className="py-2 pl-8 text-lg"
            onClick={(e) => {
              order.fn.addItem(item);
            }}
          >
            {item.name}-${item.price}
          </AccordionContent>
        );
      })}
    </AccordionItem>
  );
}
