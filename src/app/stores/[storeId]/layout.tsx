"use client";

import { use } from "react";
import MemberAuth from "~/components/auth/member";
import Nav from "~/components/nav";
// import { api } from "~/trpc/react";

export default function StoreLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{
		storeId: string;
	}>;
}) {
	const { storeId } = use(params);
	return (
		<MemberAuth storeId={storeId}>
			<Nav storeId={storeId}>{children}</Nav>
		</MemberAuth>
	);
}
