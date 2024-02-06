import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
// import {  } from "lucide-react";
import { g } from "@radix-ui/react-icons";

// import { api } from "~/trpc/server";

import { redirect } from "next/navigation";
import { Button } from "~/@/components/ui/button";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  if (session) {
    redirect("/stores");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="m-2 p-2 text-8xl font-semibold tracking-wide">Dojo</h1>
      <div className="h-[30rem] w-[30rem] bg-orange-300"></div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Link href={"/api/auth/signin/google"}>Google Sign In</Link>
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
        <Button variant="secondary" size="lg">
          {}
          <p className="text-xl ">Google Sign In</p>
        </Button>
      </div>
    </main>
  );
}

// async function CrudShowcase() {
//   const session = await getServerAuthSession();
//   if (!session?.user) return null;

//   const latestPost = await api.post.getLatest.query();

//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <div>
//           <p className="truncate">Your most recent post: {latestPost.name}</p>
//           <img src={session.user.image ?? undefined} alt="" />
//         </div>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}

//       <CreatePost />
//     </div>
//   );
// }
