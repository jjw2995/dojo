import { getServerAuthSession } from "~/server/auth";

import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default async function Landing() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/stores");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="pr-2 text-7xl font-bold text-slate-800">Dojo</h1>
      <div className="py-16 pb-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-hand-platter h-[16rem] w-[16rem] stroke-1 text-slate-600"
        >
          <path d="M12 3V2" />
          <path d="M5 10a7.1 7.1 0 0 1 14 0" />
          <path d="M4 10h16" />
          <path d="M2 14h12a2 2 0 1 1 0 4h-2" />
          <path d="m15.4 17.4 3.2-2.8a2 2 0 0 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2L5 18" />
          <path d="M5 14v7H2" />
        </svg>
      </div>
      <div className="">
        <form action="/api/auth/signin/google" method="post">
          <Button
            variant="outline"
            size="lg"
            type="submit"
            className="text-center"
          >
            <img
              loading="lazy"
              height="24"
              width="24"
              id="provider-logo"
              className="mr-4"
              src="https://authjs.dev/img/providers/google.svg"
            ></img>
            <p className="text-xl">Sign in with Google</p>
          </Button>
        </form>
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
