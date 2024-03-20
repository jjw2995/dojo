"use client";

import { ChevronLeft, MoreVertical } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
} from "~/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
// import Link from "next/link";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";
import Options from "./options";
import { Input } from "~/components/ui/input";

type Details = RouterOutputs["item"]["get"];

export default function ItemView({ itemId }: { itemId: string }) {
  const router = useRouter();
  const details = api.item.get.useQuery({ itemId: Number(itemId) });
  const pathname = usePathname();

  return (
    <div className="h-screen flex-col bg-background">
      <div className="flex justify-between md:justify-end">
        <ChevronLeft
          className="m-2 h-8 w-8 md:hidden"
          onClick={() => {
            router.replace(pathname);
          }}
        />
        <ItemMenu className="m-2 h-8 w-8" itemId={itemId} />
      </div>
      <h3 className="text-center text-2xl font-semibold">Item</h3>
      {details.data ? (
        <div className="mx-4 mt-4 flex flex-col space-y-2">
          <Item item={details.data.item} />
          <Taxes taxes={details.data.taxes} />
          <Options />
        </div>
      ) : null}
    </div>
  );
}

function Item({ item }: { item: Details["item"] }) {
  if (!item) {
    return null;
  }
  return (
    <div className="flex flex-col space-y-4">
      {/* <Label>{item.name}</Label>
      <Label>${item.price}</Label> */}
      <div className="px-4">
        <Label htmlFor="itemName">Name</Label>
        <Input id="itemName" placeholder="item name" value={item.name} />
      </div>
      <div className="px-4">
        <Label htmlFor="itemPrice">Price</Label>
        <Input
          id="itemName"
          type="number"
          step="any"
          placeholder="item price"
          value={Number(item.price).toFixed(2)}
        />
      </div>
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

function Delete({ itemId }: { itemId: string }) {
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
