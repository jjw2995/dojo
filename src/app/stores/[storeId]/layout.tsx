import MemberAuth from "~/components/auth/member";
import Nav from "~/components/nav";

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
