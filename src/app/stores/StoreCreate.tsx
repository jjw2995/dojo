"use client";

import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "~/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Input = { groupName: string };

export default function Main() {
  return <CreateStore />;
}

function CreateStore() {
  // export default function CreateStore() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const storeCreate = api.store.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-[3rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 sm:bottom-[15%] sm:right-[20%]">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Name your new group.
            <br />
            Click create when you&aposre done.
          </DialogDescription>
        </DialogHeader>
        <form
          id="createGroupForm"
          className=""
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="groupName" className="text-right">
                Name
              </Label>
              <Input
                id="groupName"
                className="col-span-3"
                placeholder="Starbucks Downtown"
                {...form.register("groupName", { required: true })}
              />
            </div>
          </div>
        </form>
        <DialogFooter className="justify-center gap-2">
          <Button type="submit" form="createGroupForm">
            Create
          </Button>
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
