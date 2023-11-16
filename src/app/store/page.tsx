"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";

export default function Store() {
  const aa = api.store.get.useQuery();
  console.log(aa.data);

  return (
    <div>
      <Create />
    </div>
  );
}

type Input = { groupName: string };

function Create() {
  const form = useForm<Input>();
  let storeCreate = api.store.create.useMutation();
  const onSubmit: SubmitHandler<Input> = (data) => {
    console.log(data);
    storeCreate.mutate({ name: data.groupName });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="fixed left-[80%] top-[90%] m-2 translate-x-[-50%] translate-y-[-50%] rounded-full p-2 text-xl leading-none text-text outline">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-[50%] top-[50%] h-[70%] w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-sm text-text outline">
          <div className="m-2">
            <Dialog.Title>create group</Dialog.Title>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <input
                className="text-black"
                placeholder="Group Name"
                {...form.register("groupName", { required: true })}
              />
              <input type="submit" />
            </form>
            <Dialog.Description />
            <Dialog.Close>??</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
