"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export default function Stores() {
  const stores = api.store.get.useQuery();
  // const session = await getServerAuthSession();
  const ses = useSession();

  return (
    <div>
      <div className="flex flex-col items-center">
        <img src={ses.data?.user.image ?? undefined} alt="" />
        {stores.data ? (
          stores.data.map((store) => {
            return <Store store={store.store} key={store.store.id} />;
          })
        ) : (
          <div className="m-2">create store</div>
        )}
      </div>
      <Create />
    </div>
  );
}

type Input = { groupName: string };

type Store = RouterOutputs["store"]["get"][number]["store"];

function Store({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}/home`}
      key={store.id}
      className="m-2 w-[80%] rounded p-2 outline"
    >
      {store.name}
    </Link>
  );
}

function Create() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const storeCreate = api.store.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    // console.log(data);
    storeCreate.mutate(
      { name: data.groupName },
      {
        onSuccess() {
          void utils.store.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="fixed left-[80%] top-[90%] z-10 m-2 translate-x-[-50%] translate-y-[-50%] rounded-full bg-background p-2 leading-none text-text outline">
          +
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-10 w-[70%] translate-x-[-50%] translate-y-[-50%] rounded-sm bg-background p-2 text-text outline">
          <Dialog.Title>create group</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              className="text-black"
              placeholder="Group Name"
              {...form.register("groupName", { required: true })}
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
