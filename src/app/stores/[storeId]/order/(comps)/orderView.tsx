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
import useIsScreenLg from "~/components/customHooks/useIsScreenLg";

export default function OrderView({ children }: { children: React.ReactNode }) {
  const elemRef = useRef(null);
  const isClickedOuterItemList = useClickOuter(elemRef);
  console.log(isClickedOuterItemList);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen m-0 flex h-screen max-h-screen w-screen flex-col gap-0 rounded-none p-0 lg:flex-row">
        <div className="flex h-full w-screen flex-col lg:w-[40%]">
          <div className="h-full bg-sky-200">orderList</div>
          <ActionButtons isClickedOuter={!isClickedOuterItemList} />
        </div>
        <ItemList
          className="h-full bg-green-300 pt-12 lg:flex-1 lg:pt-0"
          ref={elemRef}
        />
      </DialogContent>
    </Dialog>
  );
}

function ActionButtons({ isClickedOuter }: { isClickedOuter: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const isScreenLg = useIsScreenLg();

  useEffect(() => {
    if (isClickedOuter) {
      setIsOpen(false);
    }
  }, [isClickedOuter]);

  return (
    <div className="w-full bg-red-200 lg:relative lg:p-2">
      <div className="grid grid-cols-5 gap-2 p-2">
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
        open={isScreenLg ? true : isOpen}
        className="fixed w-screen justify-center lg:relative lg:w-full"
      >
        <Collapsible.Content className="relative grid grid-cols-2 gap-2 bg-red-200 px-2 pb-2">
          <Button className="h-[3rem] text-2xl">split</Button>
          <Button className="h-[3rem] text-2xl">bill</Button>
          <Button className="h-[3rem] text-2xl">payment</Button>
          <Button className="h-[3rem] text-2xl">price edit</Button>
          <Button className="h-[3rem] text-2xl">discount</Button>
          <Button className="h-[3rem] text-2xl">table info</Button>
        </Collapsible.Content>
        <div className="flex w-full items-center justify-center pb-1 ">
          <Collapsible.Trigger
            disabled={isScreenLg}
            onClick={() => {
              setIsOpen((r) => !r);
            }}
            className="lg:hidden [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDown className="h-8 w-8" />
          </Collapsible.Trigger>
        </div>
      </Collapsible.Root>
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
