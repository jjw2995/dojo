"use client";

import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import Taxes from "./taxes";
import { type RouterOutputs } from "~/trpc/shared";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type CategoryInput = { itemName: string; itemPrice: string };

function useToggle<T extends { id: number }>() {
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
  const router = useRouter();
  const form = useForm<CategoryInput>();
  const itemCreate = api.item.create.useMutation();

  const [toggledStations, toggleStation, stationsReset] = useToggle<Station>();
  const [toggledTaxes, toggleTax, taxesReset] = useToggle<Tax>();
  // console.log(toggledStations, toggledTaxes);

  const utils = api.useUtils();
  const onSubmit: SubmitHandler<CategoryInput> = (data) => {
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
      <ChevronLeft
        className="fixed left-2 top-2 h-8 w-8 lg:hidden"
        onClick={() => {
          router.back();
        }}
      />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-8 mt-4 flex w-full flex-col space-y-4"
      >
        <h1 className="text-center">Create Item</h1>
        <div className="px-4">
          <Label htmlFor="itemName">Name</Label>
          <Input
            id="itemName"
            placeholder="item name"
            {...form.register("itemName", { required: true })}
          />
        </div>
        <div className="px-4">
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

        <div className="px-4">
          <PrintTo toggleStation={toggleStation} />
        </div>

        <div>
          <div className="px-4">
            <Label>Tax</Label>
            <Taxes toggleTax={toggleTax} toggledTaxes={toggledTaxes} />
          </div>
          <div className="no-scrollbar flex overflow-x-scroll px-4">
            {toggledTaxes.map((v) => {
              return (
                <div
                  key={v.id}
                  className="m-1 flex-shrink-0 rounded p-2 outline"
                >
                  {v.name}-{v.percent}%
                </div>
              );
            })}
          </div>
        </div>

        <div className="m-2 flex flex-row justify-around">
          <Button type="submit" disabled={itemCreate.isLoading}>
            create item
          </Button>
        </div>
      </form>
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
          <div
            className="mx-3 flex place-items-center items-center text-center"
            key={v.id}
          >
            {/* <Checkbox /> */}
            <Checkbox
              name=""
              // className="h-6 w-6"
              id={v.id.toString()}
              onClick={() => {
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
