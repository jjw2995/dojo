import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  if (session) {
    redirect("/stores");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="h-12 w-12 bg-primary"></div>
      <div className="h-12 w-12 bg-secondary"></div>
      <div className="h-12 w-12 bg-accent"></div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {/* {session && <span>Logged in as {session.user?.name}</span>} */}
        </p>
        <Link href={"/api/auth/signin/google"}>Google Sign In</Link>
        {/* <button
          onClick={() => void signIn("google", { callbackUrl: "/group" })}
        ></button> */}
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <div>
          <p className="truncate">Your most recent post: {latestPost.name}</p>
          <img src={session.user.image || undefined} alt="" />
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
