"use client";

import Link from "next/link";

import { LogOut } from "lucide-react";
import CreateStore from "./StoreCreate";

import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { api } from "~/trpc/react";
import BaseAuth from "~/components/auth/base";

export default function Stores() {
  const stores = api.store.get.useQuery();

  return (
    <BaseAuth>
      <div className="mx-2 flex flex-col items-center justify-center">
        <div className="flex w-screen max-w-[40rem] flex-col">
          <div className="sticky top-0 z-10 flex items-end justify-between bg-background p-4">
            <h1 className="text-4xl font-bold tracking-wide">Dojo</h1>

            <Link href={"/api/auth/signout"}>
              <LogOut className="h-7 w-7" />
            </Link>
            {/* <img
            className="h-8 w-8 rounded-full"
            src={ses.data?.user.image ?? undefined}
            alt=""
          /> */}
          </div>

          <ScrollArea>
            <div className="m-4 flex flex-col space-y-2">
              {stores.data ? (
                stores.data.map(({ store }) => {
                  return (
                    <Link href={`/stores/${store.id}/home`} key={store.id}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            {store.name}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })
              ) : (
                <div>create store</div>
              )}
            </div>
          </ScrollArea>
          <CreateStore />
        </div>
      </div>
    </BaseAuth>
  );
}
