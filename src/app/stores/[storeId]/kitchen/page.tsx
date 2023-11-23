"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

export default function Page({ params }: { params: { storeId: string } }) {
  const kitchen = api.kitchen.get.useQuery();
  return (
    <div>
      {kitchen.data?.map((v) => {
        return <div key={v.id}>{v.name}</div>;
      })}
      <Create />
    </div>
  );
}

type Input = { stationName: string };

function Create() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const kitchenCreate = api.kitchen.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    // console.log(data);
    kitchenCreate.mutate(
      { name: data.stationName },
      {
        onSuccess(data, variables, context) {
          utils.kitchen.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed left-[10%] top-[5%] z-10 m-2 translate-x-[-50%] translate-y-[-50%] p-2 text-xl">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-10 w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-sm bg-background p-2 text-text outline">
          <Dialog.Title>add station</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              className="text-black"
              placeholder="Station Name"
              {...form.register("stationName", { required: true })}
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
