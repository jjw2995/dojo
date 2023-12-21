"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { RouterOutputs } from "~/trpc/shared";
import CreateItem from "./itemCreate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { param } from "drizzle-orm";

export default function Page({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const a = api.category.get.useQuery();

  return (
    <div className="flex">
      <div className="flex-1 lg:relative">
        <div className="flex flex-col">
          {a.data?.map((category) => {
            return (
              <Category
                storeId={params.storeId}
                category={category}
                key={category.id}
              />
            );
          })}
        </div>
        <CreateCategory />
      </div>
      <div className="fixed lg:relative lg:flex-1">{children}</div>
      {/* {children} */}
    </div>
  );
}

type Category = RouterOutputs["category"]["get"][number];
function Category({
  category,
  storeId,
}: {
  category: Category;
  storeId: string;
}) {
  const [addItemModOpen, setAddItemModOpen] = useState(false);
  const openAddItemMod = () => {
    setAddItemModOpen(true);
  };
  const closeAddItemMod = () => {
    setAddItemModOpen(false);
  };

  return (
    <div className="m-2 flex justify-between" key={category.id}>
      {category.name}
      <CategoryMenu
        categoryId={category.id}
        storeId={storeId}
        openAddItemMod={openAddItemMod}
      />
      {addItemModOpen && (
        <CreateItem
          closeAddItemMod={closeAddItemMod}
          categoryId={category.id}
        />
      )}
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
        onSuccess(data, variables, context) {
          utils.category.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed bottom-[10%] left-[90%] m-2 rounded-full p-2 outline lg:left-[45%]">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 rounded-sm bg-background p-2 text-text outline lg:left-1/4">
          <Dialog.Title>add category</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              className="text-black"
              placeholder="Station Name"
              {...form.register("categoryName", { required: true })}
            />
            <div className="m-2 flex flex-row justify-around">
              <button className="p-2 outline" type="submit">
                create
              </button>
              <Dialog.Close asChild>
                <button className="p-2 outline">cancel</button>
              </Dialog.Close>
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
  openAddItemMod,
  storeId,
}: {
  categoryId: number;
  storeId: string;
  openAddItemMod: () => void;
}) {
  const util = api.useUtils();
  const d = api.category.delete.useMutation({
    onSuccess: () => {
      util.category.get.invalidate();
    },
  });

  // const a = usePathname();

  // console.log(a);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>...</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white ">
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
          <DropdownMenu.Item
            onClick={() => {
              openAddItemMod();
            }}
          >
            add item
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              className={`m-2 p-2 text-lg`}
              href={`/stores/${storeId}/categories/${categoryId}/create`}
            >
              create item link
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => {}}>delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
