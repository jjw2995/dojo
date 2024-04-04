"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import Loading from "../loading";

export default function MemberAuth({
  children,
  storeId,
}: {
  children: React.ReactNode;
  storeId: string;
}) {
  const {
    data: isMember,
    isLoading,
    error,
  } = api.store.isMember.useQuery({
    storeId,
  });

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isMember) {
      router.push("/stores");
    }
  }, [isLoading, router, isMember]);

  if (isLoading || !isMember) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  } else {
    return <>{children}</>;
  }
}
