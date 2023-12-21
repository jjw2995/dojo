"use client";

export default function Page({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) {
  // const a = api.category.get.useQuery();
  console.log(params);

  return (
    <div className="mx-[5%] my-[2%] text-2xl">
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
