"kse client";

import { use } from "react";
import MemberAuth from "~/components/auth/member";
import Nav from "~/components/nav";
// import { api } from "~/trpc/react";

export default function StoreLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		storeId: string;
	};
}) {
	return (
		<MemberAuth storeId={params.storeId}>
			<Nav storeId={params.storeId}>{children}</Nav>
		</MemberAuth>
	);
}
