'use client'
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { api } from "~/trpc/react";

export default function Group() {
return <div>
  <Create/>
</div>
}

type Input = {groupName: string}

function Create() {

  const form = useForm<Input>()
  let storeCreate = api.store.create.useMutation()
  const onSubmit: SubmitHandler<Input> = (data) => {console.log(data)
    storeCreate.mutate({name:data.groupName})
  }

  


  return (
    <Dialog.Root >
      <Dialog.Trigger asChild>
        <button className="text-text text-xl outline rounded-full leading-none p-2 m-2 fixed top-[90%] left-[80%] translate-x-[-50%] translate-y-[-50%]">+</button>
      </Dialog.Trigger>

      <Dialog.Portal >
        <Dialog.Overlay />
        <Dialog.Content className="text-text outline fixed h-[70%] rounded-sm w-[70%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="m-2">

          <Dialog.Title>create group</Dialog.Title>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input className="text-black" placeholder="Group Name" {...form.register("groupName",{required:true})} />
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
