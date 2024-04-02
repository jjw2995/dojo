"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { MoreVertical, Plus } from "lucide-react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { RouterOutputs } from "~/trpc/shared";
import { useRouter } from "next/navigation";
import ItemDetail from "./itemDetail";
import CreateItem from "./createItem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import EditItemView from "./editItem";
import { useItemPageUrl } from "./(comps)/utils";

type Category = RouterOutputs["category"]["get"][number];

export default function Categories() {
  const categories = api.category.get.useQuery();
  const { createID, itemId, editItemId, getItemDetailUrl } = useItemPageUrl();

  return (
    <div className="flex h-full">
      <Accordion className="no-scrollbar flex-1 overflow-auto" type="multiple">
        <div className="relative md:mx-4 md:mb-0">
          {categories.data?.map((category) => {
            return (
              <Category key={`catId_${category.id}`} category={category} />
            );
          })}
        </div>
      </Accordion>
      <CreateCategory />
      <div className="fixed w-full md:relative md:flex-1 md:border-l-2">
        <RenderOne
          componentArr={[
            createID && <CreateItem categoryId={Number(createID)} />,
            itemId && <ItemDetail itemId={Number(itemId)} />,
            editItemId && (
              <EditItemView
                itemId={Number(editItemId)}
                detailLink={getItemDetailUrl(editItemId)}
              />
            ),
          ]}
          fallback={
            <div className="center hidden h-full items-center justify-center md:flex">
              <span className="text-5xl font-semibold text-slate-300">
                Nothing
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}

function Category({ category }: { category: Category }): React.ReactNode {
  const items = category.items;
  const router = useRouter();
  const { getItemDetailUrl } = useItemPageUrl();

  return (
    <AccordionItem value={"category" + category.id.toString()}>
      <div className="sticky top-0 bg-background p-2">
        <AccordionTrigger disabled={items.length < 1} asChild>
          <div>
            {category.name}
            <CategoryMenu categoryId={category.id} />
          </div>
        </AccordionTrigger>
      </div>

      {items.map((item, idx) => {
        return (
          <AccordionContent
            key={"item" + idx.toString()}
            className="py-2 pl-8 text-lg"
            onClick={() => {
              router.replace(getItemDetailUrl(item.id.toString()));
            }}
          >
            {item.name}
          </AccordionContent>
        );
      })}
    </AccordionItem>
  );
}

function RenderOne({
  componentArr,
  fallback,
}: {
  componentArr: React.ReactNode[];
  fallback: React.ReactNode;
}) {
  const firstNotNullComp = componentArr.find((v) => v !== null);
  if (firstNotNullComp) {
    return firstNotNullComp;
  } else {
    return fallback;
  }
}

function CategoryMenu({ categoryId }: { categoryId: number }) {
  //   const pathname = usePathname();
  const { getCreateCategoryUrl } = useItemPageUrl();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center justify-center text-lg"
            href={getCreateCategoryUrl(categoryId.toString())}
          >
            <Plus className="mr-2 h-4 w-4" />
            create item
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Input = { categoryName: string };

function CreateCategory() {
  const [open, setOpen] = useState(false);
  const form = useForm<Input>();
  const stationCreate = api.category.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<Input> = (data) => {
    stationCreate.mutate(
      { name: data.categoryName },
      {
        onSuccess() {
          void utils.category.get.invalidate();
          form.reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 md:bottom-[3rem] md:right-[50%]">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-center">Add Category</DialogTitle>
        <form className="py-2" onSubmit={form.handleSubmit(onSubmit)}>
          <Input
            placeholder="Station Name"
            {...form.register("categoryName", { required: true })}
          />
          <div className="mt-2 flex flex-row justify-around">
            <Button type="submit">create</Button>
          </div>
        </form>
        <DialogDescription />
      </DialogContent>
    </Dialog>
  );
}
