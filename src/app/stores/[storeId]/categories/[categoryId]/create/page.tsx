"use client";

import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import Options from "./options";
import Taxes from "./taxes";
import { RouterOutputs } from "~/trpc/shared";

type Input = { itemName: string; itemPriceInCent: string };

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

  return [arr, toggle] as const;
}

type Station = RouterOutputs["station"]["get"][number];
type Tax = RouterOutputs["tax"]["get"][number];

export default function Page({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  const form = useForm<Input>();
  const stationCreate = api.category.create.useMutation();

  const [toggledStations, toggleStation] = useToggle<Station>();
  // const [toggledOptions, toggleOption] = useToggle();
  const [toggledTaxes, toggleTax] = useToggle<Tax>();
  console.log(toggledStations, toggledTaxes, params);

  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    stationCreate.mutate(
      { name: data.itemName },
      {
        onSuccess() {
          void utils.category.get.invalidate();
          form.reset();
        },
      },
    );
  };

  return (
    <div className="h-screen w-full bg-white text-2xl">
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
              onBlur: (e: ChangeEvent<HTMLInputElement>) => {
                form.setValue(
                  "itemPriceInCent",
                  Number(e?.target?.value || "0").toFixed(2),
                );
              },
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const str = e.target.value || "";
                const fixed = Number(str).toFixed(2);
                if (fixed.length < str.length) {
                  form.setValue("itemPriceInCent", Number(fixed).toString());
                }
              },
            })}
          />

          <PrintTo toggleStation={toggleStation} />

          {/* <div>
            <p>Options</p>
            <Options toggleOption={toggleOption} />
          </div> */}

          <div>
            <p>tax</p>
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

function PrintTo({ toggleStation }: { toggleStation: (obj: Station) => void }) {
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
                toggleStation(v);
              }}
            />
            {v.name}
          </div>
        ))}
      </div>
    </div>
  );
}
