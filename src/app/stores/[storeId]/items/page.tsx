"use client";

import { api } from "~/trpc/react";
import { CategoryView } from "./clientComps";

export default function Items({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  const categories = api.category.get.useQuery();
  return (
    <CategoryView params={params} categories={categories.data || []}>
      {children}
    </CategoryView>
  );
}
