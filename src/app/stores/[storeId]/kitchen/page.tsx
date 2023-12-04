"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

export default function Page({ params }: { params: { storeId: string } }) {
  const [curStationId, setCurStationId] = useState<String | null>(null);
  // const station = api.station.get.useQuery(undefined, {
  //   enabled: curStationId !== null,
  // });

  const setCurrentStation = (stationId: String) => {
    setCurStationId(stationId);
  };

  return (
    <div>
      <div className="mx-[5%] my-[2%] flex flex-row justify-between text-2xl">
        <StationSelect setStation={setCurrentStation} />

        {curStationId ? <StationMenu stationId={curStationId} /> : null}
      </div>
      {curStationId}
    </div>
  );
}

type Input = { stationName: string };

function Create() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const stationCreate = api.station.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    stationCreate.mutate(
      { name: data.stationName },
      {
        onSuccess(data, variables, context) {
          utils.station.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="m-2 p-2 text-xl">+</button>
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

function StationMenu({ stationId }: { stationId: String }) {
  const util = api.useUtils();
  const d = api.station.delete.useMutation({
    onSuccess: () => {
      util.station.get.invalidate();
    },
  });

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>...</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
          <DropdownMenu.Item
            onClick={() => {
              d.mutate({ stationId: Number(stationId) });
            }}
          >
            delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function StationSelect({ setStation }: { setStation: (id: String) => void }) {
  const kitchen = api.station.get.useQuery();

  return (
    <Select.Root onValueChange={setStation}>
      <Select.Trigger>
        <div className="underline underline-offset-4">
          ??
          {/* <Select.Value placeholder={kitchen.data ? "select" : "create"} /> */}
        </div>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Create></Create>
            {kitchen.data?.map((val, idx) => {
              return (
                <Select.Item value={String(val.id)} key={idx}>
                  <Select.ItemText>{val.name}</Select.ItemText>
                </Select.Item>
              );
            })}

            <Select.Separator />
          </Select.Viewport>
          <Select.ScrollDownButton />
          {/* <Select.Arrow /> */}
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
