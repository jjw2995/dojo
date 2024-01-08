import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import * as RadioGroup from "@radix-ui/react-radio-group";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";

const Kind = [
  { value: "single", desc: "sg desc" },
  { value: "multiple", desc: "ml desc" },
];

export default function Options({
  toggleOption,
}: {
  toggleOption: (id: string) => void;
}) {
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
  // minSelect 0 === not mandatory
  const [option, setOption] = useState({
    numChoices: 1,
    minSelect: 0,
    maxSelect: 1,
  });
  const form = useForm<OptionInput>();

  return (
    <form>
      <input type="text" />
      <input
        className="m-2 rounded p-2 outline"
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />

      {/* modifier mode select */}
      <RadioGroup.Root
        className=""
        onValueChange={(v) => {
          console.log(v);
        }}
      >
        {Kind.map((v) => {
          return (
            <div className="flex items-center" key={v.value}>
              <RadioGroup.Item value={v.value} className="flex" id={v.value}>
                <RadioGroup.Indicator className="absolute z-50 h-4 w-4 bg-black" />
              </RadioGroup.Item>
              <label className="pl-10" htmlFor={v.value}>
                {v.value}
              </label>
            </div>
          );
        })}
      </RadioGroup.Root>

      <div>
        <label htmlFor="">number of choices</label>
        <input
          type="number"
          value={option.numChoices}
          name=""
          id=""
          className="m-2 rounded p-2 outline"
        />
      </div>

      <div>
        <label htmlFor="">min selection</label>
        <input
          type="number"
          value={option.minSelect}
          name=""
          id=""
          className="m-2 rounded p-2 outline"
        />
      </div>

      <div>
        <label htmlFor="">max selection</label>
        <input
          type="number"
          value={option.maxSelect}
          name=""
          id=""
          className="m-2 rounded p-2 outline"
        />
      </div>

      {/*  */}
    </form>
  );
}

{
  /* <RadioGroup.Item
          className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black outline-none cursor-default"
          value="default"
          id="r1"
        >
          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-violet11" />
        </RadioGroup.Item>
        <label className="text-white text-[15px] leading-none pl-[15px]" htmlFor="r1">
          Default
        </label> */
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
