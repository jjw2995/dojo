"use client";

import {
  Dialog,
  DialogClose,
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
import React, { forwardRef, useEffect, useMemo, useState } from "react";
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
import {
  OrderListContextProvider,
  useOrderList,
} from "../../_contexts/orderContext";
import {
  OrderInfoContextProvider,
  useOrderInfo,
} from "../../_contexts/orderInfoContext";
import { type orderMode } from "~/components/enums";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import useScreenSize from "~/components/customHooks/useScreenSize";

type Category = RouterOutputs["category"]["get"][number];
type Order = RouterOutputs["order"]["getOrders"][number];

interface OrderViewProp {
  children: React.ReactNode;
  orderMode: orderMode;
  isCreate?: boolean;
  order?: Order;
}

// TODO: oderview layout cleanup
// export default

export default function OrderView({
  children,
  isCreate = false,
  orderMode,
  order,
}: OrderViewProp) {
  const [isOpen, setIsOpen] = useState(false);
  const closeOrderView = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-screen w-screen max-w-full flex-col rounded-none md:rounded-none">
        <OrderInfoContextProvider>
          <OrderListContextProvider>
            <DialogHeader className="text-start">
              <TitleOrderInfo orderMode={orderMode} startOpen={isCreate} />
            </DialogHeader>
            <div className="flex h-full max-w-full flex-col rounded-none md:flex-row">
              <div className=" flex h-[20rem] flex-col md:h-full md:w-[40%]">
                <OrderList className="h-[20rem] grow" initOrder={order} />
                <ActionButtons
                  type={orderMode}
                  closeOrderView={closeOrderView}
                />
              </div>
              <CategoryList className="flex h-[20rem] overflow-y-auto pt-4 md:mt-0 md:h-full md:flex-1" />
            </div>
          </OrderListContextProvider>
        </OrderInfoContextProvider>
      </DialogContent>
    </Dialog>
  );
}

function OrderList({
  className,
  initOrder,
}: {
  className?: string;
  initOrder?: Order;
}) {
  const order = useOrderList();
  const orderInfo = useOrderInfo();
  const { cursor, list } = order;
  const { onGroup, onItem, onOption } = cursor;

  console.log(list);

  useEffect(() => {
    if (initOrder) {
      order.fn.initialize(initOrder.list);
      orderInfo.fn.setTableName(initOrder.name);
    }
  }, []);

  return (
    // https://github.com/shadcn-ui/ui/issues/1151
    <div className={cn("overflow-y-auto", className)}>
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
                  //   console.log(item.modifiers);

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

                      {item.modifiers?.map((mod, midx) => {
                        return (
                          <TableRow
                            key={`modifier_${midx}`}
                            onClick={(e) => {
                              order.fn.setCursor({ onGroup: gk, onItem: ik });
                            }}
                            data-selected={onGroup === gk && onItem === ik}
                            className="data-[even=true]:bg-yellow-10 border-t-slate-500 data-[selected=true]:bg-muted"
                          >
                            <TableCell></TableCell>
                            <TableCell className="border-l">
                              {mod.name}
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right">
                              {mod.price
                                ? `$${mod.price.toFixed(2)}`
                                : undefined}
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
  closeOrderView,
}: {
  className?: string;
  type: orderMode;
  closeOrderView: () => void;
}) {
  const useScreen = useScreenSize();
  const [isOpen, setOpen] = useState(false);
  const order = useOrderList();
  const info = useOrderInfo();
  const utils = api.useUtils();
  const orderCreate = api.order.create.useMutation({
    onSuccess: () => {
      // order.fn.clearList()
      void utils.order.getTogoOrders.invalidate();
      closeOrderView();
    },
  });

  useEffect(() => {
    if (useScreen.isLg) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [useScreen.isLg]);

  console.log(info.tableName);

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
            disabled={order.isOrderListEmpty || info.tableName.length === 0}
            className="md:h-[3rem] md:text-2xl"
          >
            Save Order
          </Button>
        </Collapsible.Content>
        <div className="flex justify-center">
          <Collapsible.Trigger
            disabled={useScreen.isLg}
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
  const order = useOrderList();

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
              if (!(item.options.length > 0)) {
                order.fn.addItem(item);
              }
            }}
          >
            {item.options.length > 0 ? (
              <OptionsModal item={item} />
            ) : (
              <>
                {item.name}-${item.price}
              </>
            )}
          </AccordionContent>
        );
      })}
    </AccordionItem>
  );
}

function OptionsModal({ item }: { item: Category["items"][number] }) {
  const order = useOrderList();
  const [toggledOptions, setToggledOptions] = useState<number[][]>(
    Array(item.options.length).fill([]),
  );

  const areConstraintsMet = useMemo(() => {
    return item.options.every((opt, idx) => {
      const curOption = toggledOptions[idx];
      if (!curOption || curOption.length < opt.minSelect) {
        return false;
      } else {
        return true;
      }
    });
  }, [toggledOptions]);

  const setChoicesArr = (choicesArr: number[], index: number) => {
    const nextToggledOptions = toggledOptions.map((prev, i) => {
      if (i !== index) {
        return prev;
      }
      return choicesArr;
    });
    setToggledOptions(() => {
      return nextToggledOptions;
    });
  };

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setToggledOptions(Array(item.options.length).fill([]));
        }
      }}
    >
      <DialogTrigger asChild>
        <div>
          {item.name}-${item.price}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>{item.name}</DialogHeader>
        {item.options.map((option, optIdx) => {
          // verify option constraints are met, check b4 addItem
          const setToggles = (arr: number[]) => {
            const arrLen = arr.length;

            if (option.maxSelect < arrLen) {
              setChoicesArr(arr.slice(arrLen - option.maxSelect), optIdx);
            } else {
              setChoicesArr(arr, optIdx);
            }
          };

          return (
            <div key={option.id} className="space-y-2">
              <div
                className="data-[satisfied=false]:text-red-600"
                data-satisfied={
                  toggledOptions[optIdx]!.length >= option.minSelect
                }
              >
                {option.name}
              </div>
              <ToggleGroup
                type="multiple"
                value={toggledOptions[optIdx]?.map((r) => r.toString())}
                className="justify-start gap-6"
                onValueChange={(e) => {
                  setToggles(Array.from(e.values()).map((r) => Number(r)));
                }}
              >
                {option.choices.map((choice, i) => {
                  return (
                    <ToggleGroupItem
                      key={`choice_${i}_${choice.name}`}
                      value={i.toString()}
                      className="flex flex-col"
                      variant="outline"
                    >
                      <span>{choice.name}</span>
                      <span>${choice.price}</span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
          );
        })}

        <Button
          disabled={!areConstraintsMet}
          onClick={() => {
            const modifiers = item.options.flatMap((opt, oidx) => {
              const choices = opt.choices.filter((chc, cidx) => {
                return toggledOptions[oidx]?.includes(cidx);
              });
              return choices.map((r) => {
                return { ...r, optionId: opt.id };
              });
            });
            // flatChoices
            order.fn.addItem({ ...item, modifiers });
          }}
        >
          add item
        </Button>

        <DialogClose
          disabled={!areConstraintsMet}
          onClick={() => {
            const modifiers = item.options.flatMap((opt, oidx) => {
              const choices = opt.choices.filter((chc, cidx) => {
                return toggledOptions[oidx]?.includes(cidx);
              });
              return choices.map((r) => {
                return { ...r, optionId: opt.id };
              });
            });
            // flatChoices
            order.fn.addItem({ ...item, modifiers });
          }}
        >
          add item
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function TitleOrderInfo({
  orderMode,
  startOpen,
}: {
  orderMode: orderMode;
  startOpen: boolean;
}) {
  const orderInfo = useOrderInfo();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTitle className="flex">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
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
      <div className="ml-2 flex flex-1 md:ml-4">
        <div className="flex flex-1 basis-1/3 flex-col gap-1 md:w-[20rem] md:flex-none">
          <span className="text-xs text-muted-foreground">
            {orderMode.toUpperCase()}
          </span>
          <div className="md:text-xl">
            {orderInfo.tableName ? (
              <span>{orderInfo.tableName}</span>
            ) : (
              <span className="text-muted-foreground">table name</span>
            )}
          </div>
        </div>
        {/* <div className="flex flex-1 basis-2/3 flex-col">
            <span>prep by</span>
            <span>created at</span>
          </div> */}
      </div>
    </DialogTitle>
  );
}
