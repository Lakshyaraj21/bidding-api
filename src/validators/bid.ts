import { z } from "zod";
import { ItemSchema } from "./item";
import { UserSchema } from "./user";

export const BaseBidSchema = z.object({
  id: z.number().int().positive(),
  itemId: z.number().int().positive(),
  userId: z.number().int().positive(),
  bid_amount: z.number().nonnegative(),
  created_at: z.date(),
});

export const BidSchema: z.ZodSchema = BaseBidSchema.extend({
  item: z.lazy(() => ItemSchema),
  user: z.lazy(() => UserSchema),
});

export type Bid = z.infer<typeof BidSchema>;
