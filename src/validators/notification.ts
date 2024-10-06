import { z } from "zod";
import { UserSchema } from "./user";

export const BaseNotificationSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  message: z.string(),
  is_read: z.boolean().default(false),
  created_at: z.date(),
});

export const NotificationSchema: z.ZodSchema = BaseNotificationSchema.extend({
  user: z.lazy(() => UserSchema),
});

export type Notification = z.infer<typeof NotificationSchema>;
