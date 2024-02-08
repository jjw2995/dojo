import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

// import { Tabs as Tb, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

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
    // onOpenChange={(isOpen) => {
    //   // abstract dialog & call "confirm close dialog"
    // }}
    >
      <Dialog.Trigger asChild>
        <Button className=" m-2 p-2 text-xl">+</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50">
          <Dialog.Content className="text-text fixed left-[50%] top-[50%] z-40 h-[70%] w-[90%] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-sm bg-white p-2 outline sm:w-96">
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
                <TaxAssign toggleTax={toggleTax} toggledTaxes={toggledTaxes} />
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
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="">Tax Name</Label>
          <Input
            placeholder="tax name"
            type="text"
            {...form.register("taxName", { required: true })}
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="">Tax Percentage</Label>
          <Input
            placeholder="tax percent"
            type="number"
            {...form.register("taxPercent", {
              required: true,
              min: 0,
            })}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit">create tax</Button>
        </div>
      </div>
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
  const deleteHandler = (tax: Tax) => {
    console.log(tax);
  };

  // console.log(toggledTaxes);

  return (
    <div>
      {taxes.data?.map((v) => {
        return (
          <div key={v.id}>
            <Checkbox
              onCheckedChange={() => {
                toggleTax(v);
              }}
              id={"tax" + v.id}
              checked={!!toggledTaxes.find((r) => r.id === v.id)}
            />
            <Label htmlFor={"tax" + v.id}>
              {v.name} - {v.percent}
            </Label>
            <button
              className="m-2 rounded p-2 outline"
              onClick={() => deleteHandler(v)}
            >
              {/* dialog to tell user items referencing will lose it */}
              delete
            </button>
            <button className="m-2 rounded p-2 outline">edit</button>
            {/* <div className="flex justify-around"></div> */}
          </div>
        );
      })}
    </div>
  );
}
