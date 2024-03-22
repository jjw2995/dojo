"use client";

import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MoreVertical, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type stationType = RouterOutputs["station"]["get"][number];
type StationInput = { stationName: string };

const QPARAM = "stationId";

export default function Page() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row justify-between p-4 text-2xl">
        <StationSelect />
        <StationMenu />
      </div>
      <OrderList />
    </div>
  );
}

function OrderList() {
  const orders = api.order.getOrders.useQuery();

  return (
    <div className="grid flex-1 snap-x grid-flow-col grid-rows-1 gap-4 overflow-x-scroll px-8 pb-4 md:flex-1 md:grid-flow-row md:grid-cols-4 md:grid-rows-2 md:overflow-hidden">
      {/* <div className="bg-pink- my-2 grid flex-1 grid-cols-4 grid-rows-2 gap-4"> */}
      {[0, 1, 2, 3, 4, 5, 6].map((r) => {
        return (
          <Card
            key={r}
            className="h- w-[20rem] snap-center md:h-auto md:w-auto md:basis-1/4"
          >
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

function useQueryParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stationId = searchParams.get(QPARAM);

  function resetQueryParam() {
    router.replace(pathname);
  }

  function setQueryParam(val: string) {
    router.replace(`${pathname}?${QPARAM}=${val}`);
  }

  return { resetQueryParam, setQueryParam, stationId };
}

function StationSelect() {
  const useQP = useQueryParam();
  const stations = api.station.get.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (!useQP.stationId) {
      setValue(null);
    }
  }, [useQP.stationId]);

  function setSelectValue(val: string) {
    setValue(() => {
      if (val === "_") {
        useQP.resetQueryParam();
        return null;
      }
      useQP.setQueryParam(val);
      return val;
    });
  }

  return (
    <>
      <Select
        onValueChange={(value) => {
          setSelectValue(value);
        }}
        defaultValue="_"
      >
        <SelectTrigger className="font-semibol w-[180px] text-xl">
          <SelectValue placeholder="station">
            {value && stations.data
              ? stations.data.find((r) => r.id === Number(value))?.name
              : "All"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_">All</SelectItem>
          {stations.data?.map((station) => {
            return (
              <SelectItem key={station.id} value={`${station.id}`}>
                {station.name}
              </SelectItem>
            );
          })}
          <div
            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-muted-foreground outline-none"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            + add station
          </div>
        </SelectContent>
      </Select>
      <Create isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

function Create({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const form = useForm<StationInput>();
  const stationCreate = api.station.create.useMutation();
  const utils = api.useUtils();
  const onSubmit: SubmitHandler<StationInput> = (data) => {
    stationCreate.mutate(
      { name: data.stationName },
      {
        onSuccess() {
          void utils.station.get.invalidate();
          form.reset();
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Create Station</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stationName" className="text-right">
                Name
              </Label>
              <Input
                className="col-span-3"
                id="stationName"
                placeholder="Station Name"
                {...form.register("stationName", { required: true })}
              />
            </div>
          </div>
        </form>
        <DialogFooter className="justify-center gap-2">
          <DialogClose asChild>
            <Button variant="destructive">cancel</Button>
          </DialogClose>
          <Button type="submit">create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// function StationMenu({ stationId }: { stationId: number }) {
function StationMenu() {
  const useQP = useQueryParam();
  const util = api.useUtils();
  const d = api.station.delete.useMutation({
    onSuccess: async () => {
      await util.station.get.invalidate();
      useQP.resetQueryParam();
    },
  });

  if (!useQP.stationId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end">
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
          <DropdownMenuItem
            onClick={() => {
              d.mutate({ stationId: Number(useQP.stationId) });
            }}
          >
            delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
