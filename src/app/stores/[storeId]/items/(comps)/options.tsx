import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export default function Options() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" m-2 p-2">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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

type OptionInput = {
  optionName: string;
  numChoices: number;
  minSelect: number;
  maxSelect: number;

  options: { name: string; price: number }[];
};
function OptionCreate() {
  const form = useForm<OptionInput>();
  //   error with useFieldArray, it just says string not assignable to
  const options = useFieldArray({ name: "options", control: form.control });

  const numChoices = form.watch("numChoices", 0);

  console.log(form.watch());
  console.log(numChoices);

  function getInteger(strNum: string | undefined | number) {
    if (!strNum) return 0;
    return Number(Number(strNum).toFixed(0));
  }

  return (
    <form className="flex flex-col space-y-2">
      <Input
        placeholder="option name"
        {...form.register("optionName", { required: true })}
      />

      <div className="flex items-center justify-between">
        <Label htmlFor="">number of choices</Label>
        <Input
          type="number"
          className="w-20"
          {...form.register("numChoices", {
            // required: true,
            valueAsNumber: true,
            value: 0,
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="">toggle at least...</Label>
        <Input
          type="number"
          className="w-20"
          {...form.register("minSelect", {
            required: true,
            valueAsNumber: true,
            value: 0,
            disabled: numChoices < 1,
          })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="">toggle at most...</Label>
        <Input
          type="number"
          className="w-20"
          {...form.register("maxSelect", {
            required: true,
            valueAsNumber: true,
            disabled: numChoices < 1,
          })}
        />
      </div>
      <div className="flex h-[10rem] overflow-y-auto">
        <div className="flex-1">
          {/* form.watch("numChoices", 0) CLAIMS its returning a number
          IT IS NOT */}
          {Array(getInteger(numChoices))
            .fill({ name: "name", price: 0 })
            .map((r, i) => {
              return <div>???{i}</div>;
            })}
        </div>
      </div>
    </form>
  );
}
