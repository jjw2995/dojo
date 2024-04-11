import { createTRPCRouter } from "~/server/api/trpc";
import { storeRouter } from "./routers/store";
import { stationRouter } from "./routers/station";
import { categoryRouter } from "./routers/category";
import { taxRouter } from "./routers/tax";
import { itemRouter } from "./routers/item";
import { orderRouter } from "./routers/order";
import { optionRouter } from "./routers/option";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  store: storeRouter,
  station: stationRouter,
  category: categoryRouter,
  tax: taxRouter,
  item: itemRouter,
  order: orderRouter,
  option: optionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
