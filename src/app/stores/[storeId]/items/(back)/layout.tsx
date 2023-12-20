"use client";

export default function Page({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  return (
    <div className="fixed h-4/5 w-screen bg-white lg:relative lg:block lg:w-fit lg:flex-1">
      {children}
    </div>
  );
}
