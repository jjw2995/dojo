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
  const { data: isMember, isLoading } = api.store.isMember.useQuery({
    storeId,
  });

  const router = useRouter();

  useEffect(() => {
    if (isMember === false) {
      router.push("/stores");
    }
  }, [isLoading, router]);

  if (isLoading || !isMember) {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
