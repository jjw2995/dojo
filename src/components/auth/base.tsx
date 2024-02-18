"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "../loading";

export default function BaseAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  if (status !== "authenticated") {
    return <Loading />;
  } else {
    return <>{children}</>;
  }
}
