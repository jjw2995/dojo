"use client";

import { api } from "~/trpc/react";
import OrderView from "./orderView";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type RouterOutputs } from "~/trpc/shared";
import { getTimeString } from "~/utils";

// RouterOutputs
type OrderList = RouterOutputs["order"]["getTogoOrders"];
type Order = OrderList[number];

export default function Togo() {
  const togoOrders = api.order.getTogoOrders.useQuery();

  return (
    <div className="mx-4 mb-[6rem]">
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4">
        {togoOrders.data?.map((order, ind) => {
          return <Order order={order} key={`${order.id}_${ind}`} />;
        })}
      </div>
      <OrderView orderMode="TOGO" isCreate>
        <Button className="fixed bottom-[6rem] right-[1rem] h-[3rem] w-[3rem] -translate-x-1/2 rounded-full p-2 lg:bottom-[6rem] lg:right-[6rem]">
          <Plus />
        </Button>
      </OrderView>
    </div>
  );
}

function Order({ order }: { order: Order }) {
  return (
    <OrderView orderMode="TOGO" order={order}>
      <Card>
        <CardHeader className="flex flex-col p-4">
          <CardTitle>{order.name}</CardTitle>
          <CardDescription className="flex justify-between">
            <span>{order.type}</span>
            <span className="">{getTimeString(new Date(order.createdAt))}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </OrderView>
  );
}
