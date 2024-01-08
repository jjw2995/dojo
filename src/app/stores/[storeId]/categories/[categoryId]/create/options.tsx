import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import * as RadioGroup from "@radix-ui/react-radio-group";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

export default function Options({
  toggleOption,
}: {
  toggleOption: (id: string) => void;
}) {
  const [] = useState({ numChoices: 1, minSelect: 0, maxSelect: 1 });

  const [container, setContainer] = useState(null);
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
              <p className="text-center">Options</p>
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
              <Tabs.Content value="tab2">{/* <OptionAssign /> */}</Tabs.Content>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

type OptionInput = { optionName: string };
function OptionCreate() {
  const form = useForm<OptionInput>();

  return (
    <form>
      <input type="text" />
      <input
        className="m-2 rounded p-2 outline"
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />

      <RadioGroupDemo />
    </form>
  );
}

const RadioGroupDemo = () => (
  <form>
    <RadioGroup.Root
      className="flex flex-col gap-2.5"
      defaultValue="default"
      aria-label="View density"
      onValueChange={(e) => {
        console.log(e);
      }}
    >
      <div className="flex items-center">
        <RadioGroup.Item
          className="shadow-blackA4 hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="default"
          id="r1"
        >
          <RadioGroup.Indicator className="after:bg-violet11 relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-[15px] text-[15px] leading-none" htmlFor="r1">
          Default
        </label>
      </div>
      <div className="flex items-center">
        <RadioGroup.Item
          className="shadow-blackA4 hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="comfortable"
          id="r2"
        >
          <RadioGroup.Indicator className="after:bg-violet11 relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-[15px] text-[15px] leading-none" htmlFor="r2">
          Comfortable
        </label>
      </div>
      <div className="flex items-center">
        <RadioGroup.Item
          className="shadow-blackA4 hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="compact"
          id="r3"
        >
          <RadioGroup.Indicator className="after:bg-violet11 relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:content-['']" />
        </RadioGroup.Item>
        <label className="pl-[15px] text-[15px] leading-none" htmlFor="r3">
          Compact
        </label>
      </div>
    </RadioGroup.Root>
  </form>
);

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
