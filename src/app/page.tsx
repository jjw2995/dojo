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
      <h1 className="mb-1 text-8xl font-semibold">Dojo</h1>
      <div className="pt-4">
        <div className="h-[20rem] w-[20rem] bg-orange-300"></div>
      </div>
      <div className="mb-8 pt-4">
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
