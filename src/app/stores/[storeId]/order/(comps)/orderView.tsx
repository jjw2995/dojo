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
import { forwardRef, useEffect, useState } from "react";
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

type Category = RouterOutputs["category"]["get"][number];

type Item = Category["items"][number];

export default function OrderView({
  children,
  orderMode,
}: {
  children: React.ReactNode;
  orderMode: "togo" | "table";
}) {
  const [orderList, setOrderList] = useState<Map<number, Item[]>>(new Map());
  const [curIndex, setCurIndex] = useState<{
    onGroup: number;
    onItem: number;
    onOption: number;
  }>({
    onGroup: 0,
    onItem: -1,
    onOption: -1,
  });

  // check empty, start subgroupId 0
  // check exist, append to cur
  const appendItem = (item: Item) => {
    setOrderList((ol) => {
      console.log(ol);

      if (ol.has(curIndex.onGroup)) {
        return new Map(ol).set(curIndex.onGroup, [
          ...ol.get(curIndex.onGroup)!,
          item,
        ]);
      } else {
        return new Map(ol).set(curIndex.onGroup, [item]);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col rounded-none">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex h-screen max-w-full flex-col rounded-none lg:flex-row">
          <div className="h-[50%] lg:h-full lg:w-[40%]">
            <OrderList orderList={orderList} className="h-[75%] lg:h-[70%]" />
            <ActionButtons />
          </div>
          <CategoryList
            className="flex h-[50%] overflow-y-scroll bg-secondary lg:mt-0 lg:h-full lg:flex-1"
            appendItem={appendItem}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrderList({
  orderList,
  className,
}: {
  orderList: Map<number, Item[]>;
  className?: string;
}) {
  return (
    <div className={cn("overflow-y-scroll", className)}>
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="w-6">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(orderList).map(([nm, listGroup], gk) => {
            return (
              <>
                {listGroup.map((item, ik) => {
                  return (
                    <>
                      <TableRow key={`${gk}_${ik}`} onClick={(e) => {}}>
                        <TableCell>{ik}</TableCell>
                        <TableCell className="border-l">{item.name}</TableCell>
                        <TableCell>qty</TableCell>
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
                    </>
                  );
                })}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ActionButtons({ className }: { className?: string }) {
  const isScreenLg = useIsScreenLg();
  const [isOpen, setOpen] = useState(false);

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
        <Button className="md:h-[3rem] md:text-2xl">
          <X />
        </Button>
        <Button className="md:h-[3rem] md:text-2xl">
          <Minus />
        </Button>
        <Button className="md:h-[3rem] md:text-2xl">
          <Plus />
        </Button>
        <Button className="md:h-[3rem] md:text-2xl">
          <SplitSquareVertical />
        </Button>
        <Button className="md:h-[3rem] md:text-2xl">
          <NotebookPen />
        </Button>
      </div>
      <Collapsible.Root
        open={isOpen}
        className="fixed left-0 right-0 z-10 justify-center px-6 lg:relative lg:px-0"
      >
        <Collapsible.Content className="relative grid grid-cols-2 gap-2 border-b-2 bg-background pt-2 data-[state=open]:pb-2">
          <Button className="md:h-[3rem] md:text-2xl">split</Button>
          <Button className="md:h-[3rem] md:text-2xl">bill</Button>
          <Button className="md:h-[3rem] md:text-2xl">payment</Button>
          <Button className="md:h-[3rem] md:text-2xl">price edit</Button>
          <Button className="md:h-[3rem] md:text-2xl">discount</Button>
          <Button className="md:h-[3rem] md:text-2xl">table info</Button>
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
  React.HTMLAttributes<HTMLDivElement> & { appendItem: (item: Item) => void }
>(({ className, children, appendItem, ...props }, ref) => {
  const categories = api.category.get.useQuery();

  return (
    <div className={className} ref={ref} {...props}>
      <Accordion className="no-scrollbar flex-1" type="multiple">
        <div className="relative md:mb-0 lg:mx-4">
          {categories.data?.map((category) => {
            return (
              <Category
                key={`catId_${category.id}`}
                category={category}
                appendItem={appendItem}
              />
            );
          })}
        </div>
      </Accordion>
    </div>
  );
});

function Category({
  category,
  appendItem,
}: {
  category: Category;
  appendItem: (item: Item) => void;
}): React.ReactNode {
  const items = category.items;

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
            key={"item" + idx.toString()}
            className="py-2 pl-8 text-lg"
            onClick={(e) => {
              appendItem(item);
            }}
          >
            {item.name}-${item.price}
          </AccordionContent>
        );
      })}
    </AccordionItem>
  );
}
