import { z } from "zod";

const modifierSchema = z.object({
  name: z.string(),
  price: z.number(),
});

const taxSchema = z.object({
  id: z.number(),
  name: z.string(),
  percent: z.number(),
});

const stationSchema = z.object({
  id: z.number(),
  name: z.string(),
  isDone: z.boolean().default(false),
});

const orderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  qty: z.number(),
  isPaid: z.boolean().default(false),
  isServed: z.boolean().default(false),
  stations: z.array(stationSchema),
  taxes: z.array(taxSchema),
  modifiers: z.array(modifierSchema),
});

const orderItemListSchema = z.array(z.array(orderItemSchema));

// type OrderItem = typeof orderItemSchema._type;

const orderTypeSchema = z.enum(["TABLE", "TODO", "ONLINE"]);

export {
  taxSchema,
  modifierSchema,
  stationSchema,
  orderItemSchema,
  orderItemListSchema,
  orderTypeSchema,
};
// export type { Tax, Option, OrderItem, Station };
