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
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import useClickOuter from "~/components/customHooks/useClickOuter";
import useIsScreenLg from "~/components/customHooks/useIsScreenLg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/shadcn/accordion";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type Category = RouterOutputs["category"]["get"][number];

type Item = Category["items"][number];

type OrderList = (Item & { subgroupId: number })[];

export default function OrderView({ children }: { children: React.ReactNode }) {
  const elemRef = useRef(null);
  const isClickedOuterItemList = useClickOuter(elemRef);
  const [isCollapButtonsOpen, setCollapButtonsOpen] = useState(false);

  const [orderList, setOrderList] = useState<{
    curIndex: number;
    orderList?: OrderList;
  }>({ curIndex: -1 });

  // check empty, start subgroupId 0
  // check exist, append to cur
  const appendItem = (item: Item) => {
    setOrderList((ol) => {
      if (ol.orderList) {
        const curItem = ol.orderList[ol.curIndex]!;
        let orderList = ol.orderList;
        const newIndex = ol.curIndex + 1;

        return {
          curIndex: ol.curIndex + 1,
          orderList: [
            ...orderList.slice(0, newIndex),
            { ...item, subgroupId: curItem.subgroupId },
            ...orderList.slice(newIndex),
          ],
        };
      } else {
        return { curIndex: 0, orderList: [{ ...item, subgroupId: 0 }] };
      }
    });
  };

  /**
   * u0
   *  item0 {}
   *
   */

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-screen m-0 flex h-screen max-h-screen w-screen flex-col gap-0 rounded-none p-0 lg:flex-row">
        <div className="flex h-full w-screen flex-col lg:w-[40%]">
          <OrderList orderList={orderList.orderList} />
          <ActionButtons
            setOpen={setCollapButtonsOpen}
            isClickedOuter={!isClickedOuterItemList}
            isCollapseOpen={isCollapButtonsOpen}
          />
        </div>
        <CategoryList
          data-disabled={isCollapButtonsOpen}
          className="mt-8 flex h-full overflow-auto bg-secondary data-[disabled=true]:pointer-events-none lg:mt-0 lg:flex-1"
          appendItem={appendItem}
          ref={elemRef}
        />
      </DialogContent>
    </Dialog>
  );
}

function OrderList({ orderList }: { orderList?: OrderList }) {
  return (
    <div className="h-full bg-background">
      <div>
        {orderList?.map((r, k) => {
          return (
            <div key={k}>
              <div>{`${r.name}_${r.price}_${r.subgroupId}`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionButtons({
  isClickedOuter,
  setOpen,
  isCollapseOpen,
}: {
  isClickedOuter: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isCollapseOpen: boolean;
}) {
  const isScreenLg = useIsScreenLg();

  useEffect(() => {
    if (isClickedOuter) {
      setOpen(false);
    }
  }, [isClickedOuter]);

  return (
    <div className="w-full bg-background pt-2 lg:relative lg:p-2">
      <div className="grid grid-cols-5 gap-2 px-4">
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
        open={isScreenLg ? true : isCollapseOpen}
        className="fixed z-10 w-screen justify-center lg:relative lg:w-full"
      >
        <Collapsible.Content className="relative grid grid-cols-2 gap-2 border-b-2 bg-background px-4 pt-2 data-[state=open]:pb-2">
          <Button className="h-[3rem] text-2xl">split</Button>
          <Button className="h-[3rem] text-2xl">bill</Button>
          <Button className="h-[3rem] text-2xl">payment</Button>
          <Button className="h-[3rem] text-2xl">price edit</Button>
          <Button className="h-[3rem] text-2xl">discount</Button>
          <Button className="h-[3rem] text-2xl">table info</Button>
        </Collapsible.Content>
        <div className="flex w-full items-center justify-center">
          <Collapsible.Trigger
            disabled={isScreenLg}
            onClick={() => {
              setOpen((r) => !r);
            }}
            className="rounded-b-full bg-background lg:hidden [&[data-state=open]>svg]:rotate-180"
          >
            <ChevronDown className="h-10 w-10" />
          </Collapsible.Trigger>
        </div>
      </Collapsible.Root>
    </div>
  );
}

// TODO: disable click - when collapsibleButtons open
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
            onClick={() => appendItem(item)}
          >
            {item.name}-${item.price}
          </AccordionContent>
        );
      })}
    </AccordionItem>
  );
}
