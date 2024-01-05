"use client";

import { type ChangeEvent, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import Options from "./options";

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
  const form = useForm<Input>();
  const stationCreate = api.category.create.useMutation();

  const [toggledStations, toggleStation] = useMultiSelect();
  const [toggledOptions, toggleOption] = useMultiSelect();
  // const [toggledTaxes, toggleTax] = useMultiSelect();
  console.log(toggledStations, params);

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
    <div className="w-full bg-white text-2xl">
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

// type TaxInput = { taxName: string };
// function TaxCreate() {
//   const form = useForm<TaxInput>();

//   return (
//     <div>
//       tax create
//       <input type="text" />
//       <input
//         className="m-2 rounded p-2 outline"
//         placeholder="option name"
//         {...form.register("taxName", { required: true })}
//       />
//     </div>
//   );
// }
