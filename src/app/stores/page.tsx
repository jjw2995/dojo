import { useSession } from "next-auth/react";
// import { getServerAuthSession } from "~/server/auth";
// import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";
import Link from "next/link";

import { LogOut } from "lucide-react";
import CreateStore from "./StoreCreate";
import { api } from "~/trpc/server";

export default async function Stores() {
  const stores = await api.store.get.query();
  // const session = await getServerAuthSession();
  // const ses = useSession();

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
        <div className="m-4 flex flex-col">
          {stores ? (
            stores.map((store) => {
              return <Store store={store.store} key={store.store.id} />;
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

type Store = RouterOutputs["store"]["get"][number]["store"];

function Store({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}/home`}
      key={store.id}
      className="m-1 rounded p-2 text-2xl outline"
    >
      {store.name}
    </Link>
  );
}
