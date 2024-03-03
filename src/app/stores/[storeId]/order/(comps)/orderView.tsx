"use client";

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
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  Minus,
  Plus,
  X,
  SplitSquareVertical,
  NotebookPen,
} from "lucide-react";
import { Button } from "~/components/shadcn/button";
import { forwardRef, useEffect, useRef, useState } from "react";
import useClickOuter from "~/components/customHooks/useClickOuter";

export default function OrderView({ children }: { children: React.ReactNode }) {
  const elemRef = useRef(null);
  const isClickedOuterItemList = useClickOuter(elemRef);
  console.log(isClickedOuterItemList);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen m-0 flex h-screen w-screen flex-col gap-0 p-0 lg:flex-row">
        <div className="flex h-full flex-col lg:w-[40%]">
          <div className="h-full bg-sky-200">orderList</div>
          <ActionButtons isClickedOuter={!isClickedOuterItemList} />
        </div>
        <ItemList className="h-full bg-green-300 lg:flex-1" ref={elemRef} />
      </DialogContent>
    </Dialog>
  );
}

function ActionButtons({ isClickedOuter }: { isClickedOuter: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isClickedOuter) {
      setIsOpen(false);
    }
  }, [isClickedOuter]);

  return (
    <div className="w-full bg-red-200 lg:relative lg:block">
      <div className="grid grid-cols-5 gap-2 px-2">
        <Button className="h-[3rem] text-2xl">
          <X />
        </Button>
        <Button className="h-[3rem] text-2xl">
          <Minus />
        </Button>
        <Button className="h-[3rem] text-2xl">
          <Plus />
        </Button>
        <Button className="h-[3rem] text-2xl">
          <SplitSquareVertical />
        </Button>
        <Button className="h-[3rem] text-2xl">
          <NotebookPen />
        </Button>
      </div>
      <Collapsible.Root
        open={isOpen}
        className="fixed w-screen justify-center bg-red-200 lg:relative lg:w-full"
      >
        <Collapsible.Content className="relative">
          <CollapsibleActions />
        </Collapsible.Content>
        <div className="flex w-full items-center justify-center">
          <Collapsible.Trigger
            onClick={() => {
              setIsOpen((r) => !r);
            }}
            className="lg:hidden [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDown />
          </Collapsible.Trigger>
        </div>
      </Collapsible.Root>
    </div>
  );
}

function CollapsibleActions({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-2 px-2 pt-2 ${className}`}>
      <Button className="h-[3rem] text-2xl">split</Button>
      <Button className="h-[3rem] text-2xl">bill</Button>
      <Button className="h-[3rem] text-2xl">payment</Button>
      <Button className="h-[3rem] text-2xl">price edit</Button>
      <Button className="h-[3rem] text-2xl">discount</Button>
      <Button className="h-[3rem] text-2xl">table info</Button>
    </div>
  );
}

const ItemList = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className={className} ref={ref} {...props}>
      itemList
    </div>
  );
});
