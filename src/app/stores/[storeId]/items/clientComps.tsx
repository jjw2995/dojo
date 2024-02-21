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

import { useCallback, useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RouterOutputs } from "~/trpc/shared";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Category = RouterOutputs["category"]["get"][number];
type Item = Category["items"][number];

function CategoryView({
  categories,
  children,
  params,
}: {
  categories: Category[];
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const addQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  const cateId = searchParams.get("itemId");
  const createID = searchParams.get("itemCreateCategoryId");

  return (
    <div className="flex">
      <Accordion
        className="no-scrollbar max-h-screen flex-1 overflow-auto"
        type="multiple"
      >
        <div className="relative mb-20  md:mb-0 lg:mx-4">
          {categories.map((category, idx) => {
            const items = category.items;
            return (
              <AccordionItem
                key={idx}
                value={"category" + category.id.toString()}
              >
                <div className="sticky top-0 bg-background p-2">
                  <AccordionTrigger disabled={items.length < 1} asChild>
                    <div>
                      {category.id}-{category.name}
                      <CategoryMenu
                        categoryId={category.id}
                        storeId={params.storeId}
                      />
                    </div>
                  </AccordionTrigger>
                </div>

                {items.map((item, idx) => {
                  return (
                    <AccordionContent
                      key={"item" + idx.toString()}
                      className="py-2 pl-8 text-lg"
                      onClick={() => {
                        router.replace(`${pathname}?itemId=${item.id}`);
                      }}
                    >
                      {item.name}
                    </AccordionContent>
                  );
                })}
              </AccordionItem>
            );
          })}
        </div>
      </Accordion>
      <CreateCategory />
      <div className="fixed w-full lg:relative lg:h-full lg:flex-1 lg:border-l-2">
        cateId-{cateId}
        createID-{createID}
      </div>
    </div>
  );
}

function CategoryMenu({
  categoryId,
  storeId,
}: {
  categoryId: number;
  storeId: string;
}) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center justify-center text-lg"
            href={`${pathname}?itemCreateCategoryId=${categoryId}`}
          >
            <Plus className="mr-2 h-4 w-4" />
            create item
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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

export { CategoryView, CategoryMenu, CreateCategory };
