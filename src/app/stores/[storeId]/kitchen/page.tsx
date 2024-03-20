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

type stationType = RouterOutputs["station"]["get"][number];
type StationInput = { stationName: string };

const QPARAM = "stationId";

export default function Page() {
  const orders = api.order.getOrders.useQuery();

  //   console.log(orders.data);

  return (
    <div>
      <div className="m-4 flex flex-row justify-between text-2xl">
        <StationSelect />
        <StationMenu />
      </div>

      <div className=""></div>
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
