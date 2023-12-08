"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Page({ params }: { params: { storeId: string } }) {
  const a = api.category.get.useQuery();
  return (
    <div className="mx-[5%] my-[2%] text-2xl">
      <div className="flex flex-col">
        {a.data?.map((d) => {
          return (
            <div className="m-2 flex justify-between" key={d.id}>
              {d.name}
              <CategoryMenu categoryId={d.id} setCategoryNull={() => {}} />
            </div>
          );
        })}
      </div>
      <CreateCategory />
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
        <button className="fixed bottom-[10%] right-[10%] m-2 rounded-full p-2 text-xl outline">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-10 w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-sm bg-background p-2 text-text outline">
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
  setCategoryNull,
}: {
  categoryId: number;
  setCategoryNull: () => void;
}) {
  const util = api.useUtils();
  const d = api.category.delete.useMutation({
    onSuccess: () => {
      util.category.get.invalidate();
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>...</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white ">
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
          <DropdownMenu.Item
            onClick={() => {
              d.mutate({ categoryId });
              setCategoryNull();
            }}
          >
            add item
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => {
              d.mutate({ categoryId });
              setCategoryNull();
            }}
          >
            delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
