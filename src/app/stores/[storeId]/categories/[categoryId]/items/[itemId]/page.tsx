"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/shadcn/alert-dialog";
import { Button } from "~/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/shadcn/dropdown-menu";
import { Label } from "~/components/shadcn/label";
// import Link from "next/link";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import Options from "../../../../items/options";

export default function Page({
  params,
}: {
  params: {
    storeId: string;
    categoryId: string;
    itemId: string;
  };
}) {
  const router = useRouter();
  const details = api.item.get.useQuery({ itemId: Number(params.itemId) });

  return (
    <div className="h-screen w-full flex-col bg-background">
      <div className="flex justify-between lg:justify-end">
        <ChevronLeft
          className="m-2 h-8 w-8 lg:hidden"
          onClick={() => {
            router.back();
          }}
        />
        <ItemMenu className="m-2 h-8 w-8" itemId={params.itemId} />
      </div>
      <h3 className="text-center text-2xl font-semibold">Item</h3>
      {details.data ? (
        <div>
          <Item item={details.data.item} />
          <Taxes taxes={details.data.taxes} />
          <Options />
        </div>
      ) : null}
    </div>
  );
}

type Details = RouterOutputs["item"]["get"];
function Item({ item }: { item: Details["item"] }) {
  if (!item) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div>{item.name}</div>
      <div>${item.price}</div>
    </div>
  );
}

function Taxes({ taxes }: { taxes: Details["taxes"] }) {
  return (
    <div className="no-scrollbar flex overflow-x-scroll px-4">
      {taxes.map(({ id, name, percent }) => {
        return (
          <div
            className="m-1 flex-shrink-0 rounded p-2 outline"
            key={"tax" + id?.toString()}
          >
            {name}-{percent}%
          </div>
        );
      })}
    </div>
  );
}

function ItemMenu({
  itemId,
  className,
}: {
  itemId: string;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <MoreVertical className="" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Delete itemId={itemId} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Delete({ itemId, className }: { itemId: string; className?: string }) {
  const deleteItem = api.item.delete.useMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger>delete</AlertDialogTrigger>
      <AlertDialogContent className="w-80">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-bold">item</span> and its{" "}
            <span className="font-bold">options</span>
            <br />
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteItem.mutate({ itemId: Number(itemId) });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
