import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const Kind = [
  { value: "single", desc: "sg desc" },
  { value: "multiple", desc: "ml desc" },
];

export default function Options() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="h-[60%]">
        <Tabs defaultValue="create">
          <DialogTitle className="mb-2">Options</DialogTitle>
          <TabsList className="w-full">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <OptionCreate />
          </TabsContent>
          <TabsContent value="edit">Change your password here.</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
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
      <Input
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />

      {/* modifier mode select */}
      {/* <RadioGroup.Root
        onValueChange={(v) => {
          console.log(v);
        }}
        value={Kind[0]!.value}
      >
        {Kind.map((v) => {
          return (
            <div className="flex items-center" key={v.value}>
              <RadioGroup.Item value={v.value} className="flex" id={v.value}>
                <RadioGroup.Indicator className="absolute z-50 h-4 w-4 bg-black" />
              </RadioGroup.Item>
              <Label className="pl-10" htmlFor={v.value}>
                {v.value}
              </Label>
            </div>
          );
        })}
      </RadioGroup.Root> */}

      <div>
        <Label htmlFor="">number of choices</Label>
        <Input type="number" value={option.numChoices} name="" id="" />
      </div>

      <div>
        <Label htmlFor="">min selection</Label>
        <Input type="number" value={option.minSelect} name="" id="" />
      </div>

      <div>
        <Label htmlFor="">max selection</Label>
        <Input type="number" value={option.maxSelect} name="" id="" />
      </div>

      {/*  */}
    </form>
  );
}
