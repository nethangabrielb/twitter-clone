import { z } from "zod";

import { likeSchema, userSchema } from "@/schemas/post";

export const replySchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.number(),
    replyId: z.number(),
    userId: z.number(),
    content: z.string(),
    createdAt: z.date(),
    deleted: z.boolean(),
    user: userSchema,
    _count: z.object({
      Like: z.number(),
      replies: z.number(),
    }),
    Like: z.array(likeSchema),
    replies: z.array(replySchema), // recursive
    reply: replySchema.optional(), // recursive optional
  }),
);
