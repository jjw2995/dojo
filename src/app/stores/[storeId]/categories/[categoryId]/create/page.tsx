"use client";

export default function Page({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  // const a = api.category.get.useQuery();
  console.log(params);

  return (
    <div className="text-2xl">
      <button
        onClick={() => {
          window.history.back();
        }}
      >
        {" "}
        back{" "}
      </button>
      create item
    </div>
  );
}
