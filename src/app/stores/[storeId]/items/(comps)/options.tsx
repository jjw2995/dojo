import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { type ChangeEvent } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Edit, Plus, X } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { z } from "zod";

export default function OptionModal({ itemId }: { itemId: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" m-2 p-2">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs defaultValue="create">
          <DialogTitle>Options</DialogTitle>
          <TabsList className="w-full">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="h-[30rem]">
            <OptionCreate itemId={itemId} />
          </TabsContent>
          <TabsContent value="edit" className="h-[30rem]">
            <OptionEdit itemId={itemId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function OptionEdit({ itemId }: { itemId: number }) {
  const useUtil = api.useUtils();
  const options = api.option.getByItemId.useQuery({ itemId });
  const deleteOption = api.option.deleteOption.useMutation({
    onSuccess: (data, variables) => {
      useUtil.option.getByItemId.setData({ itemId }, (prev) => {
        return prev?.filter((opt) => {
          return opt.id !== variables.optionId;
        });
      });
    },
  });

  return (
    <div className="h-[30rem] w-full space-y-2 overflow-y-auto">
      {options.data?.map((option, idx) => {
        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md p-2 shadow-sm outline -outline-offset-2 outline-slate-200"
          >
            <Label className="w-[60%] overflow-hidden text-ellipsis">
              {option.name}
            </Label>
            <div className="space-x-2">
              <Button disabled size="sm" variant="ghost" onClick={() => {}}>
                <Edit />
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  deleteOption.mutate({ optionId: option.id });
                }}
              >
                <X />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const optionInputSchema = z.object({
  name: z.string(),
  minSelect: z.number(),
  maxSelect: z.number(),
  choices: z.array(z.object({ name: z.string(), price: z.number() })),
});

type OptionInputType = typeof optionInputSchema._type;

function OptionCreate({ itemId }: { itemId: number }) {
  const form = useForm<OptionInputType>();
  const optionCreate = api.option.create.useMutation({
    onSuccess(data, variables, context) {
      form.reset();
    },
  });
  //   error with useFieldArray, it just says string not assignable to
  const choices = useFieldArray({ name: "choices", control: form.control });

  const choicesArr = form.watch("choices", []);

  return (
    <div className="mt- flex flex-col space-y-3">
      <div className="mx-2 flex items-center justify-between">
        <Label htmlFor="">option name</Label>
        <Input
          className="w-60 text-end"
          placeholder="option name"
          {...form.register("name", { required: true })}
        />
      </div>
      <div className="mx-2 flex items-end justify-between">
        <div className="text-center">
          <Label htmlFor="">min select</Label>
          <Input
            type="number"
            className="w-20 text-end"
            {...form.register("minSelect", {
              required: true,
              valueAsNumber: true,
              disabled: choicesArr.length < 1,
              onChange(e: ChangeEvent<HTMLInputElement>) {
                if (e.target.value !== "") {
                  e.target.value = Math.min(
                    Math.max(0, Number(e.target.value)),
                    choicesArr.length,
                  ).toString();

                  if (
                    form.getValues("maxSelect") &&
                    form.getValues("maxSelect").toString() !== ""
                  ) {
                    form.setValue(
                      "maxSelect",
                      Math.max(
                        Number(e.target.value),
                        form.getValues("maxSelect"),
                      ),
                    );
                  }
                }
              },
            })}
          />
        </div>

        <div className="text-center">
          <Label htmlFor="">max select</Label>
          <Input
            type="number"
            className="w-20 text-end"
            {...form.register("maxSelect", {
              required: true,
              valueAsNumber: true,
              disabled: choicesArr.length < 1,
              onChange(e) {
                if (e.target.value !== "") {
                  e.target.value = Math.min(
                    Math.max(
                      form.getValues("minSelect"),
                      Number(e.target.value),
                    ),
                    choicesArr.length,
                  ).toString();
                }
              },
            })}
          />
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            choices.append({ name: "", price: 0 });
          }}
        >
          add
          <br />
          choice
        </Button>
      </div>

      <div className="py-2">
        <div className="h-[18rem] overflow-y-auto">
          {choices.fields.map((field, index) => {
            let onFocus = false;
            return (
              <Card key={field.id} className="relative m-2 p-4">
                <Button
                  variant="ghost"
                  className="absolute left-1 top-1 m-0 flex h-6 w-6 rounded-full p-0 focus:bg-red-600 focus:text-accent"
                  onBlur={() => {
                    onFocus = false;
                  }}
                  onClick={() => {
                    if (onFocus) {
                      choices.remove(index);
                    }
                    onFocus = true;
                  }}
                >
                  <X className="h-4 w-4 translate-x-[0.5px]" />
                </Button>
                <CardContent className="ml-4 space-y-1 p-0">
                  <div className="flex items-center justify-between tracking-tight">
                    <Label className="text-sm leading-tight">selectable</Label>
                    <Input
                      {...form.register(`choices.${index}.name` as const, {
                        required: true,
                      })}
                      className="w-36"
                      placeholder="name"
                    />
                  </div>
                  <div className="flex items-center justify-between tracking-tight">
                    <Label className="text-sm leading-tight">price</Label>
                    <Input
                      type="number"
                      placeholder="price"
                      {...form.register(`choices.${index}.price` as const, {
                        required: true,
                        valueAsNumber: true,
                      })}
                      className="w-36"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Button
        onClick={() => {
          optionCreate.mutate({ ...form.getValues(), itemId: itemId });
        }}
      >
        create option
      </Button>
    </div>
  );
}
