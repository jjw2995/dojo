import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import * as RadioGroup from "@radix-ui/react-radio-group";

import { type SubmitHandler, useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

const Kind = [
  { value: "single", desc: "sg desc" },
  { value: "multiple", desc: "ml desc" },
];

type Tax = RouterOutputs["tax"]["get"][number];
export default function Taxes({
  toggleTax,
  toggledTaxes,
}: {
  toggleTax: (tax: Tax) => void;
  toggledTaxes: Tax[];
}) {
  return (
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
              <p className="text-center">Taxes</p>
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
                <TaxCreate />
              </Tabs.Content>
              <Tabs.Content value="tab2">
                {
                  <TaxAssign
                    toggleTax={toggleTax}
                    toggledTaxes={toggledTaxes}
                  />
                }
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type TaxInput = { taxName: string; taxPercent: string };
function TaxCreate() {
  const [] = useState();
  const form = useForm<TaxInput>();
  const taxCreate = api.tax.create.useMutation();

  const onSubmit: SubmitHandler<TaxInput> = (data) => {
    taxCreate.mutate(
      { taxName: data.taxName, taxPercent: Number(data.taxPercent) },
      {
        onSuccess() {
          form.reset();
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor="">Tax Name</label>
        <input
          className="m-2 rounded p-2 outline"
          placeholder="tax name"
          type="text"
          {...form.register("taxName", { required: true })}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="">Tax Percentage</label>
        <input
          className="m-2 rounded p-2 outline"
          placeholder="tax percent"
          type="number"
          {...form.register("taxPercent", {
            required: true,
            min: 0,
          })}
        />
      </div>
      <button className="m-2 rounded p-2 outline" type="submit">
        create tax
      </button>
    </form>
  );
}

function TaxAssign({
  toggleTax,
  toggledTaxes,
}: {
  toggleTax: (tax: Tax) => void;
  toggledTaxes: Tax[];
}) {
  const taxes = api.tax.get.useQuery();
  // const deleteTax = api.tax.delete
  const deleteHandler = (tax: Tax) => {};

  return (
    <div>
      {taxes.data?.map((v) => {
        return (
          <div key={v.id}>
            <input
              onChange={() => {
                toggleTax(v);
              }}
              type="checkbox"
              name=""
              id=""
              checked={!!toggledTaxes.find((r) => r.id === v.id)}
            />
            <p>
              {v.name} - {v.percent}
            </p>
            <button onClick={() => {}}>delete</button>
            <button>edit</button>
          </div>
        );
      })}
    </div>
  );
}
