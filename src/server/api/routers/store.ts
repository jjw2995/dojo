import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { stores, members } from "~/server/db/schema";

export const storeRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    // https://orm.drizzle.team/docs/select#select-from-subquery
    const sq = ctx.db
      .select()
      .from(members)
      .where(eq(members.userId, ctx.session.user.id))
      .as("sq");

    return await ctx.db
      .select()
      .from(stores)
      .innerJoin(sq, eq(stores.id, sq.storeId));
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // await ctx.db.transaction(async (tx)=>{
      //   let {insertId} = await tx.insert(stores).values({name: input.name})
      //   let b = await tx.insert(members).values({userId: ctx.session.user.id, storeId:insertId,authority:"owner"})
      // })
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
