"use client";

import { ChevronLeft, Edit, MoreVertical, Trash } from "lucide-react";
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
import OptionModal from "../_components/options";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useItemPageUrl } from "../_components/utils";

type Details = RouterOutputs["item"]["get"];

export default function ItemDetail({ itemId }: { itemId: number }) {
  const router = useRouter();
  const details = api.item.get.useQuery({ itemId: Number(itemId) });
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col bg-background md:h-full">
      <div className="flex justify-between md:justify-end">
        <ChevronLeft
          className="m-2 h-8 w-8 md:hidden"
          onClick={() => {
            router.replace(pathname);
          }}
        />
        <ItemMenu className="m-2 h-8 w-8" itemId={itemId} />
      </div>
      <h1 className="my-2 text-center text-2xl">Item</h1>
      {details.data ? <Item item={details.data} /> : null}
    </div>
  );
}

function Item({ item }: { item: Details }) {
  if (!item) {
    return null;
  }
  return (
    <div className="mx-4 flex flex-col space-y-2">
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
      <Taxes taxes={item.taxes} />
      <Stations stations={item.stations} />
      <div className="px-4">
        <Label htmlFor="itemPrice">Options</Label>
        <OptionModal itemId={item.id} />
        <Options options={item.options} />
      </div>
    </div>
  );
}

function Taxes({ taxes }: { taxes: Details["taxes"] }) {
  return (
    <div className="flex h-full w-full flex-col px-4 py-2">
      <Label>Taxes</Label>
      {/* fix overflow behavior... or change scroll orientation */}
      <div className="no-scrollbar flex overflow-x-scroll">
        {[...taxes].map(({ id, name, percent }, idx) => {
          return (
            <Card
              className="m-1 flex-shrink-0"
              key={"tax" + id?.toString() + idx}
            >
              <CardHeader className="w-[4rem] p-4">
                <CardTitle>{name}</CardTitle>
                <CardDescription className="text-right">
                  {percent}%
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Options({ options }: { options: Details["options"] }) {
  return (
    <div>
      {options.map((r) => {
        return <div>{r.name}</div>;
      })}
    </div>
  );
}

function Stations({ stations }: { stations: Details["stations"] }) {
  return (
    <div className="flex w-full flex-col px-4 py-2">
      <Label>Stations</Label>
      {/* fix overflow behavior... or change scroll orientation */}
      <div className="no-scrollbar flex overflow-x-scroll">
        {[...stations].map(({ id, name }, idx) => {
          return (
            <Card
              className="m-1 flex-shrink-0"
              key={"tax" + id?.toString() + idx}
            >
              <CardHeader className="w-[4rem] p-4 text-center">
                <CardTitle>{name}</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ItemMenu({
  itemId,
  className,
}: {
  itemId: number;
  className?: string;
}) {
  const { getEditItemUrl } = useItemPageUrl();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Delete itemId={itemId} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="flex items-center"
            href={getEditItemUrl(itemId.toString())}
          >
            <Edit className="mr-2 h-4 w-4" />
            edit item
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Delete({ itemId }: { itemId: number }) {
  const deleteItem = api.item.delete.useMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center px-2 py-1.5 text-sm">
        <Trash className="mr-2 h-4 w-4" />
        delete
      </AlertDialogTrigger>
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
              deleteItem.mutate({ itemId: itemId });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
