"use client";

export default function Page({ params }: { params: { storeId: string } }) {
  // const a = api.category.get.useQuery();

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
