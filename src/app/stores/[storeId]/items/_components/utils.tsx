"use client";

import { usePathname, useSearchParams } from "next/navigation";

const QUERY_PARAM = {
	itemId: "id",
	createItemCategoryId: "create_item_category_id",
	editItemId: "edit_item_id",
};

export function useItemPageUrl() {
	const searchParams = useSearchParams();

	const itemId = searchParams.get(QUERY_PARAM.itemId);
	const createId = searchParams.get(QUERY_PARAM.createItemCategoryId);
	const editItemId = searchParams.get(QUERY_PARAM.editItemId);

	const pathname = usePathname();

	function getCreateCategoryUrl(catId: string) {
		return `${pathname}?${QUERY_PARAM.createItemCategoryId}=${catId}`;
	}
	function getItemDetailUrl(itemId: string) {
		return `${pathname}?${QUERY_PARAM.itemId}=${itemId}`;
	}

	function getEditItemUrl(itemId: string) {
		return `${pathname}?${QUERY_PARAM.editItemId}=${itemId}`;
	}

	return {
		itemId,
		createId,
		editItemId,
		getCreateCategoryUrl,
		getItemDetailUrl,
		getEditItemUrl,
	};
}
