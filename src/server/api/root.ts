import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { storeRouter } from "./routers/store";
import { stationRouter } from "./routers/station";
import { categoryRouter } from "./routers/category";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  store: storeRouter,
  station: stationRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
