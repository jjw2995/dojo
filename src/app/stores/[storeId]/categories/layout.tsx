"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MoreVertical, Plus } from "lucide-react";

import { useState } from "react";
import type { RouterOutputs } from "~/trpc/shared";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "~/@/components/ui/button";
import { Input } from "~/@/components/ui/input";
import { Label } from "~/@/components/ui/label";

export default function Page({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const a = api.category.get.useQuery();
  const searchParams = useSearchParams();
  searchParams.get("id");

  console.log(searchParams.get("id"));

  return (
    <div className="flex">
      <div className="flex-1 lg:relative">
        {/* <div className="flex flex-col"> */}
        {a.data?.map((category) => {
          return (
            <Accordion className="" type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {category.category.name}
                  <CategoryMenu
                    categoryId={category.category.id}
                    storeId={params.storeId}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
      <CreateCategory />
      {/* </div> */}
      <div className="fixed w-full lg:relative lg:flex-1">{children}</div>
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
        <Button
          className="fixed bottom-[10%] left-[85%] -translate-x-1/2 rounded-full p-2 lg:left-[50%]"
          // className="fixed bottom-[10%] left-[90%] m-2 rounded-full p-2 outline lg:left-[45%]"
        >
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white outline">
          <DropdownMenu.Item asChild>
            <Link
              className={`my-2 flex py-2 text-lg`}
              href={`/stores/${storeId}/categories/${categoryId}/create`}
            >
              <Plus />
              create item link
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item>delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
