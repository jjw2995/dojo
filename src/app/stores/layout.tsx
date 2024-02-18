"use client";

import BaseAuth from "~/components/auth/base";

export default function StoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BaseAuth>{children}</BaseAuth>;
}
