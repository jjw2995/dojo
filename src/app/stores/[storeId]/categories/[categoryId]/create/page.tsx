"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";

type Input = { itemName: string; itemPriceInCent: string };

function useMultiSelect() {
  const [arr, setArr] = useState<string[]>([]);
  function toggle(id: string) {
    const index = arr.findIndex((v) => v === id);
    if (index < 0) {
      setArr((pre) => [...pre, id]);
    } else {
      setArr((pre) => pre.filter((elem) => elem !== id));
    }
  }

  return [arr, toggle] as const;
}

export default function Page({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const [open, setOpen] = useState(true);
  const form = useForm<Input>();
  const stationCreate = api.category.create.useMutation();

  const [toggledStations, toggleStation] = useMultiSelect();
  const [toggledOptions, toggleOption] = useMultiSelect();
  const [toggledTaxes, toggleTax] = useMultiSelect();

  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    stationCreate.mutate(
      { name: data.itemName },
      {
        onSuccess(data, variables, context) {
          utils.category.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };
  // console.log(form.watch());

  return (
    <div className="text-2xl">
      <button
        onClick={() => {
          window.history.back();
        }}
        className="m-2 rounded p-1 outline"
      >
        back
      </button>
      <div className="">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input
            className="m-2 rounded p-2 outline"
            placeholder="item name"
            {...form.register("itemName", { required: true })}
          />
          <input
            placeholder="price"
            className="m-2 rounded p-2 outline"
            type="number"
            {...form.register("itemPriceInCent", {
              required: true,
              min: 0,
              onBlur: (e) => {
                form.setValue(
                  "itemPriceInCent",
                  Number(e.target.value || "0").toFixed(2),
                );
              },
              onChange: (e) => {
                // console.log(e.target.value);
                const str = (e.target.value as string) || "";
                const fixed = Number(str).toFixed(2);
                if (fixed.length < str.length) {
                  form.setValue("itemPriceInCent", Number(fixed).toString());
                }
              },
            })}
          />

          <PrintTo toggleStation={toggleStation} />

          <Options toggleOption={toggleOption} />

          <div>
            <p>tax</p>
          </div>

          <div className="m-2 flex flex-row justify-around">
            <button className="p-2 outline" type="submit">
              create item
            </button>
          </div>
        </form>
      </div>
      create item
    </div>
  );
}

function PrintTo({ toggleStation }: { toggleStation: (id: string) => void }) {
  const stations = api.station.get.useQuery();
  return (
    <div className="p-2">
      <p>Print To</p>

      <div className="flex ">
        {stations.data?.map((v) => (
          <div className="m-2" key={v.id}>
            <input
              type="checkbox"
              name=""
              className="h-6 w-6"
              id={v.id.toString()}
              onClick={(e) => {
                toggleStation(e.currentTarget.id);
              }}
            />
            {v.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Options({ toggleOption }: { toggleOption: (id: string) => void }) {
  const [] = useState({ numChoices: 1, minSelect: 0, maxSelect: 1 });

  return (
    <div>
      <p>options</p>
      <Dialog.Root
        // open={open}
        onOpenChange={(isOpen) => {
          // abstract dialog & call "confirm close dialog"
        }}
      >
        <Dialog.Trigger asChild>
          <button className=" m-2 rounded-full p-2 text-xl outline">+</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="z-50">
            <Dialog.Content className="fixed left-[50%] top-[50%] z-40 h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-sm bg-white p-2 text-text outline">
              <Tabs.Root defaultValue="tab1">
                <Tabs.List className="flex justify-around">
                  <Tabs.Trigger
                    value="tab1"
                    className="data-[state=active]:underline"
                  >
                    new
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="tab2"
                    className="data-[state=active]:underline"
                  >
                    assign
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="tab1">
                  <OptionCreate />
                </Tabs.Content>

                <Tabs.Content value="tab2">
                  <TaxCreate />
                </Tabs.Content>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

type OptionInput = { optionName: string };
function OptionCreate() {
  const form = useForm<OptionInput>();

  return (
    <div>
      option create
      <input type="text" />
      <input
        className="m-2 rounded p-2 outline"
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />
    </div>
  );
}

type TaxInput = { TaxName: string };
function TaxCreate() {
  const form = useForm<TaxInput>();

  return <div>Tax create</div>;
}
