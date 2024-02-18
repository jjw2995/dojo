import Link from "next/link";

import { LogOut } from "lucide-react";
import CreateStore from "./StoreCreate";
import { api } from "~/trpc/server";

import { Card, CardHeader, CardTitle } from "~/components/ui/card";

export default async function Stores() {
  const stores = await api.store.get.query();

  return (
    <div className="mx-2 flex flex-col items-center justify-center">
      <div className="flex w-screen max-w-[40rem] flex-col">
        <div className="mx-6 my-4 flex items-end justify-between">
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
        <div className="m-4 flex flex-col space-y-2">
          {stores ? (
            stores.map(({ store }) => {
              return (
                <Link href={`/stores/${store.id}/home`} key={store.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div>create store</div>
          )}
        </div>
        <CreateStore />
      </div>
    </div>
  );
}
