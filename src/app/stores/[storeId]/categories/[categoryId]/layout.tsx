"use client";

export default function Page({
  children,
  params,
}: {
  params: { storeId: string };
  children: React.ReactNode;
}) {
  return (
    <div className="fixed h-screen w-screen bg-white outline lg:relative lg:flex lg:h-auto lg:w-fit">
      {children}
    </div>
  );
}
