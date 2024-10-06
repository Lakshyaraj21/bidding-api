import { z } from "zod";
import { ItemSchema } from "./item";
import { BidSchema } from "./bid";
import { NotificationSchema } from "./notification";

export const RoleSchema = z.enum(["USER", "ADMIN"]);
export type Role = z.infer<typeof RoleSchema>;

export const BaseUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const LoginUserSchema = BaseUserSchema.pick({
  username: true,
  password: true,
});

export const UserSchema: z.ZodSchema = BaseUserSchema.extend({
  items: z.array(z.lazy(() => ItemSchema)),
  bids: z.array(z.lazy(() => BidSchema)),
  notifications: z.array(z.lazy(() => NotificationSchema)),
});

export type User = z.infer<typeof UserSchema>;
