import { api } from "~/trpc/server";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  const a = await api.post.hello.query({ text: "??????" });
  const b = await api.station.get.query();
  const c = await api.category.get.query();
  // console.log(b);
  // console.log(c);

  return (
    <div>
      test
      {a.greeting}
    </div>
  );
}
