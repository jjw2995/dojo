"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { MoreVertical, Plus } from "lucide-react";

import { useState } from "react";
// import type { RouterOutputs } from "~/trpc/shared";
import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
// import { Separator } from "~/components/shadcn/separator";

export default function Page({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const a = api.category.get.useQuery();

  return (
    <div className="flex ">
      <div className="no-scrollbar max-h-screen flex-1 overflow-auto">
        <div className="relative mb-20 md:mb-0">
          {a.data?.map((category, idx) => {
            const items = category.items;

            return (
              <Accordion
                className="lg:mx-4"
                key={"cat" + idx.toString()}
                type="multiple"
              >
                <AccordionItem value={"category" + category.id.toString()}>
                  <div className="sticky top-0 bg-background p-2">
                    <AccordionTrigger disabled={items.length < 1} asChild>
                      <div>
                        {category.name}
                        <CategoryMenu
                          categoryId={category.id}
                          storeId={params.storeId}
                        />
                      </div>
                    </AccordionTrigger>
                  </div>
                  {items.map((item, idx) => {
                    return (
                      <Link
                        key={"item" + idx.toString()}
                        href={`/stores/${params.storeId}/categories/${category.id}/items/${item.id}`}
                      >
                        <AccordionContent className="py-2 pl-8 text-lg">
                          {item.name}
                        </AccordionContent>
                      </Link>
                    );
                  })}
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </div>
      <CreateCategory />
      {/* <Separator className="z-30 w-3 bg-slate-950" orientation="vertical" /> */}
      <div className="fixed w-full lg:relative lg:h-full lg:flex-1 lg:border-l-2">
        {children}
      </div>
    </div>
  );
}

type Input = { categoryName: string };

function CreateCategory() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const stationCreate = api.category.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    stationCreate.mutate(
      { name: data.categoryName },
      {
        onSuccess() {
          void utils.category.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 lg:bottom-[2rem] lg:right-[47%]">
          <Plus />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="text-text fixed left-1/2 top-1/2 z-10 w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-background p-2 outline lg:left-1/4">
          <Dialog.Title className="text-center">Add Category</Dialog.Title>
          <form className="py-2" onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              placeholder="Station Name"
              {...form.register("categoryName", { required: true })}
            />
            <div className="mt-2 flex flex-row justify-around">
              <Button type="submit">create</Button>
            </div>
          </form>
          <Dialog.Description />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CategoryMenu({
  categoryId,
  storeId,
}: {
  categoryId: number;
  storeId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center justify-center text-lg"
            href={`/stores/${storeId}/categories/${categoryId}/create`}
          >
            <Plus className="mr-2 h-4 w-4" />
            create item
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
