import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

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
    <div>
      <p>options</p>
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

                <Tabs.Content value="tab2">
                  {/* <OptionAssign /> */}
                </Tabs.Content>
              </Tabs.Root>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

type OptionInput = { optionName: string };
function OptionCreate() {
  const form = useForm<OptionInput>();

  return (
    <div>
      option create
      <input type="text" />
      <input
        className="m-2 rounded p-2 outline"
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />
    </div>
  );
}
