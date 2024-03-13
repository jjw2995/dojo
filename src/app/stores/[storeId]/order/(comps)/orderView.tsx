"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  TableCaption,
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
import { SubmitHandler, useForm } from "react-hook-form";
import { OrderContextProvider, useOrder } from "./orderListContext";
import { OrderInfoContextProvider } from "./orderInfoContext";

type Category = RouterOutputs["category"]["get"][number];

type Item = Category["items"][number];

type OrderItem = Item & { qty: number };
type OrderList = Map<number, OrderItem[]>;

type OrderType = "togo" | "table";

export default function OrderView({
  children,
  orderMode,
}: {
  children: React.ReactNode;
  orderMode: OrderType;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col rounded-none">
        <OrderInfoContextProvider>
          <OrderContextProvider>
            <DialogHeader>
              <DialogTitle>
                <TitleOrderInfo orderMode={orderMode} />
              </DialogTitle>
            </DialogHeader>
            {/* come back werid lg screen */}
            <div className="flex h-full max-w-full flex-col rounded-none lg:flex-row">
              <div className="h-[20rem] lg:h-full lg:w-[40%]">
                <OrderList className="h-[75%] lg:h-[70%]" />
                <ActionButtons />
              </div>
              <CategoryList className="flex h-[20rem] overflow-y-scroll bg-secondary lg:mt-0 lg:h-full lg:flex-1" />
            </div>
          </OrderContextProvider>
        </OrderInfoContextProvider>
      </DialogContent>
    </Dialog>
  );
}

type OrderInfoInput = { orderMode: OrderType; orderName: string };

function TitleOrderInfo({ orderMode }: { orderMode: OrderType }) {
  const form = useForm<OrderInfoInput>({ defaultValues: { orderMode } });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xl">
          TOGO: Sean 1253
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-full max-w-md rounded-none sm:max-w-[425px] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>TOGO: Sean</DialogTitle>
        </DialogHeader>
        <form
          id="createGroupForm"
          className=""
          //   onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderName" className="text-right">
                Name
              </Label>
              <Input
                id="orderName"
                className="col-span-3"
                placeholder="Starbucks Downtown"
                {...form.register("orderName", { required: true })}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function OrderList({ className }: { className?: string }) {
  const order = useOrder();
  const { onGroup, onItem, onOption } = order.data.cursor;
  const { cursor, list } = order.data;
  console.log(list);
  console.log(cursor);

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
            return listGroup.map((item, ik) => {
              return (
                <React.Fragment key={`${gk}_${ik}`}>
                  <TableRow
                    onClick={(e) => {
                      order.fn.setCursor({ onGroup: gk, onItem: ik });
                    }}
                    className={`${
                      onGroup === gk && onItem === ik ? "bg-muted" : ""
                    }`}
                    // data-selected={
                    //   onGroup === gk && onItem === ik ? "selected" : ""
                    // }
                  >
                    <TableCell>{ik}</TableCell>
                    <TableCell className="border-l">{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {/* {[0, 1].map((r, i) => {
                          return (
                            <TableRow key={`${gk}_${ik}_${i}`}>
                              <TableCell></TableCell>
                              <TableCell className="border-l">
                                {item.name}
                                {i}
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell className="text-right"></TableCell>
                            </TableRow>
                          );
                        })} */}
                </React.Fragment>
              );
            });
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ActionButtons({ className }: { className?: string }) {
  const isScreenLg = useIsScreenLg();
  const [isOpen, setOpen] = useState(false);
  const order = useOrder();

  useEffect(() => {
    if (isScreenLg) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isScreenLg]);

  return (
    <div className={cn("bg-background pt-2 lg:relative lg:p-2", className)}>
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
        className="fixed left-0 right-0 z-10 justify-center px-6 lg:static lg:px-0"
      >
        <Collapsible.Content className="relative grid grid-cols-2 gap-2 border-b-2 bg-background pt-2 data-[state=open]:pb-2 lg:static lg:border-0">
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
          <Button disabled className="md:h-[3rem] md:text-2xl">
            Save Order
          </Button>
        </Collapsible.Content>
        <div className="flex justify-center">
          <Collapsible.Trigger
            disabled={isScreenLg}
            onClick={() => {
              setOpen((r) => !r);
            }}
            className="rounded-b-full bg-background data-[state=open]:fixed data-[state=open]:h-screen data-[state=open]:w-screen data-[state=open]:bg-slate-600 data-[state=open]:opacity-20 lg:hidden [&[data-state=open]>svg]:rotate-180"
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

  return (
    <div className={className} ref={ref} {...props}>
      <Accordion className="no-scrollbar flex-1" type="multiple">
        <div className="relative md:mb-0 lg:mx-4">
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
