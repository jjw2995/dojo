import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import * as RadioGroup from "@radix-ui/react-radio-group";

import { type SubmitHandler, useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";

const Kind = [
  { value: "single", desc: "sg desc" },
  { value: "multiple", desc: "ml desc" },
];

export default function Taxes({
  toggleOption,
}: {
  toggleOption: (id: string) => void;
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
              <Tabs.Content value="tab2">{/* <OptionAssign /> */}</Tabs.Content>
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

  // const onSubmit: SubmitHandler<TaxInput> = (data) => {
  //   stationCreate.mutate(
  //     { name: data.itemName },
  //     {
  //       onSuccess() {
  //         // void utils.category.get.invalidate();
  //         form.reset();
  //       },
  //     },
  //   );
  // };

  console.log(form.watch());

  return (
    <form>
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
            // onBlur: (e: ChangeEvent<HTMLInputElement>) => {
            //   form.setValue(
            //     "taxPercent",
            //     Number(e?.target?.value || "0").toFixed(2),
            //   );
            // },
            // onChange: (e: ChangeEvent<HTMLInputElement>) => {
            //   const str = e.target.value || "";
            //   const fixed = Number(str).toFixed(2);
            //   if (fixed.length < str.length) {
            //     form.setValue("taxPercent", Number(fixed).toString());
            //   }
            // },
          })}
        />
      </div>
      <button className="m-2 rounded p-2 outline" type="submit">
        create tax
      </button>
    </form>
  );
}

{
  /* <form onSubmit={form.handleSubmit(onSubmit)}>
            <input
              className="text-black"
              placeholder="Station Name"
              {...form.register("categoryName", { required: true })}
            />
            <div className="m-2 flex flex-row justify-around">
              <button className="p-2 outline" type="submit">
                create
              </button>
              <Dialog.Close asChild>
                <button className="p-2 outline">cancel</button>
              </Dialog.Close>
            </div>
          </form> */
}
