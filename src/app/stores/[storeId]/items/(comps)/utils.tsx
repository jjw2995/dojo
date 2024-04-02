"use client";

import { usePathname, useSearchParams } from "next/navigation";

const QPARAM = {
  itemId: "id",
  createItemCategoryId: "create_item_category_id",
  editItemId: "edit_item_id",
};

export function useItemPageUrl() {
  const searchParams = useSearchParams();

  const itemId = searchParams.get(QPARAM.itemId);
  const createID = searchParams.get(QPARAM.createItemCategoryId);
  const editItemId = searchParams.get(QPARAM.editItemId);

  const pathname = usePathname();

  function getCreateCategoryUrl(catId: string) {
    return `${pathname}?${QPARAM.createItemCategoryId}=${catId}`;
  }
  function getItemDetailUrl(itemId: string) {
    return `${pathname}?${QPARAM.itemId}=${itemId}`;
  }

  function getEditItemUrl(itemId: string) {
    return `${pathname}?${QPARAM.editItemId}=${itemId}`;
  }

  return {
    itemId,
    createID,
    editItemId,
    getCreateCategoryUrl,
    getItemDetailUrl,
    getEditItemUrl,
  };
}
