"use client";

import { type ChangeEvent, useState, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Taxes from "./(comps)/taxes";

type CategoryInput = { itemName?: string; itemPrice?: string };

function useToggle<T extends { id: number }>(init?: T[]) {
  const [arr, setArr] = useState<T[]>(init ? init : []);
  //   console.log(init);

  function toggle(obj: T) {
    const index = arr.findIndex((v) => v.id === obj.id);
    if (index < 0) {
      setArr((pre) => [...pre, obj]);
    } else {
      setArr((pre) => pre.filter((v) => v.id !== obj.id));
    }
  }

  function toggleArrInit(arr: T[]) {
    setArr(arr);
  }

  function reset() {
    setArr([]);
  }

  return [arr, { toggle, toggleArrInit, reset }] as const;
}

type Station = RouterOutputs["station"]["get"][number];
type Tax = RouterOutputs["tax"]["get"][number];

export default function EditItemView({
  itemId,
  detailLink,
}: {
  itemId: number;
  detailLink: string;
}) {
  const details = api.item.get.useQuery({ itemId: Number(itemId) });
  const initItem = details.data;
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<CategoryInput>({
    values: { itemName: initItem?.name, itemPrice: initItem?.price.toString() },
  });

  const itemPatch = api.item.patch.useMutation();

  const [toggledStations, toggleStations] = useToggle<Station>();
  const [toggledTaxes, toggleTaxes] = useToggle<Tax>();

  useEffect(() => {
    if (details.data?.stations) {
      toggleStations.toggleArrInit(details.data?.stations);
    }
    if (details.data?.taxes) {
      toggleTaxes.toggleArrInit(details.data?.taxes);
    }
  }, [details.data]);
  // form.getValues
  console.log({
    id: itemId.toString(),
    // itemName: form.data.itemName,
    // itemPrice: Number(data.itemPrice),
    taxIds: toggledTaxes.map((r) => r.id),
    stationIds: toggledStations.map((r) => r.id),
  });

  const utils = api.useUtils();
  const onSubmit: SubmitHandler<CategoryInput> = (data) => {
    itemPatch.mutate(
      {
        id: itemId.toString(),
        itemName: data.itemName,
        itemPrice: Number(data.itemPrice),
        taxIds: toggledTaxes.map((r) => r.id),
        stationIds: toggledStations.map((r) => r.id),
      },
      {
        onSuccess() {
          void utils.category.get.invalidate();
          //   stationsReset();
          //   taxesReset();
          form.reset();
          router.replace(detailLink);
        },
      },
    );
  };

  return (
    <div className="bg- flex h-screen flex-col bg-background text-2xl">
      <ChevronLeft
        className="m-2 h-8 w-8"
        onClick={() => {
          router.replace(detailLink);
        }}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-4 flex flex-col space-y-2"
      >
        <h1 className="text-center">Edit Item</h1>
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

        <div className="px-4 py-2">
          <PrintTo toggleStation={toggleStations.toggle} />
        </div>

        <div>
          <div className="px-4 py-2">
            <Label>Tax</Label>
            <Taxes toggleTax={toggleTaxes.toggle} toggledTaxes={toggledTaxes} />
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
          <Button type="submit" disabled={itemPatch.isLoading}>
            edit item
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
