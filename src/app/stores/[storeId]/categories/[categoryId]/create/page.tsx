"use client";

import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import Options from "./options";
import Taxes from "./taxes";
import { RouterOutputs } from "~/trpc/shared";
import { Input } from "~/@/components/ui/input";
import { Label } from "~/@/components/ui/label";
import { Button } from "~/@/components/ui/button";
import { Checkbox } from "~/@/components/ui/checkbox";

type Input = { itemName: string; itemPrice: string };

function useToggle<T extends { id: Number }>() {
  const [arr, setArr] = useState<T[]>([]);
  function toggle(obj: T) {
    const index = arr.findIndex((v) => v.id === obj.id);
    if (index < 0) {
      setArr((pre) => [...pre, obj]);
    } else {
      setArr((pre) => pre.filter((v) => v.id !== obj.id));
    }
  }

  function reset() {
    setArr([]);
  }

  return [arr, toggle, reset] as const;
}

type Station = RouterOutputs["station"]["get"][number];
type Tax = RouterOutputs["tax"]["get"][number];

export default function Page({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const form = useForm<Input>();
  const itemCreate = api.item.create.useMutation();

  const [toggledStations, toggleStation, stationsReset] = useToggle<Station>();
  // const [toggledOptions, toggleOption] = useToggle();
  const [toggledTaxes, toggleTax, taxesReset] = useToggle<Tax>();
  console.log(toggledStations, toggledTaxes);

  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    itemCreate.mutate(
      {
        itemName: data.itemName,
        itemPrice: Number(data.itemPrice),
        taxIds: toggledTaxes.map((r) => r.id),
        stationIds: toggledStations.map((r) => r.id),
        categoryId: Number(params.categoryId),
      },
      {
        onSuccess() {
          void utils.category.get.invalidate();
          stationsReset();
          taxesReset();
          form.reset();
        },
      },
    );
  };

  return (
    <div className="flex h-screen w-full justify-center bg-white text-2xl">
      <div className="w-96 px-4">
        <Button
          onClick={() => {
            window.history.back();
          }}
          className="m-2"
        >
          back
        </Button>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <h1 className="text-center">Create Item</h1>
          <div>
            <Label htmlFor="itemName">Name</Label>
            <Input
              id="itemName"
              placeholder="item name"
              {...form.register("itemName", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="itemPrice">Price</Label>
            <Input
              id="itemPrice"
              placeholder="price"
              type="number"
              step="any"
              {...form.register("itemPrice", {
                required: true,
                // min: 0,
                onBlur: (e: ChangeEvent<HTMLInputElement>) => {
                  form.setValue(
                    "itemPrice",
                    Number(e?.target?.value || "0").toFixed(2),
                  );
                },
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  const str = e.target.value || "";
                  const fixed = Number(str).toFixed(2);
                  if (fixed.length < str.length) {
                    form.setValue("itemPrice", Number(fixed).toString());
                  }
                },
              })}
            />
          </div>

          <PrintTo toggleStation={toggleStation} />

          {/* <div>
            <p>Options</p>
            <Options toggleOption={toggleOption} />
          </div> */}

          <div>
            <Label>Tax</Label>
            <Taxes toggleTax={toggleTax} toggledTaxes={toggledTaxes} />
            {toggledTaxes.map((v) => {
              return (
                <div key={v.id}>
                  {v.name}-{v.percent}
                </div>
              );
            })}
          </div>

          <div className="m-2 flex flex-row justify-around">
            <Button type="submit" disabled={itemCreate.isLoading}>
              create item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PrintTo({ toggleStation }: { toggleStation: (obj: Station) => void }) {
  const stations = api.station.get.useQuery();
  return (
    <div>
      <Label>Print To</Label>
      <div className="flex ">
        {stations.data?.map((v) => (
          <div className="mx-2" key={v.id}>
            {/* <Checkbox /> */}
            <Checkbox
              name=""
              // className="h-6 w-6"
              id={v.id.toString()}
              onClick={(e) => {
                toggleStation(v);
              }}
            />
            <Label htmlFor={v.id.toString()}>{v.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
