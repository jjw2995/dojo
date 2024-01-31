import { z } from "zod";
import { createTRPCRouter, passcodeProcedure } from "~/server/api/trpc";
import { stations, items, taxes } from "~/server/db/schema";

export const itemRouter = createTRPCRouter({
  create: passcodeProcedure
    .input(
      z.object({
        itemName: z.string().min(1),
        itemPrice: z.number(),
        taxIds: z.array(z.number()),
        stationIds: z.array(z.number()),
      }),
    )
    .mutation(({ ctx, input }) => {
      //   console.log(input);
      ctx.db.transaction((tx) => {
        // tx.
      });
    }),
});
