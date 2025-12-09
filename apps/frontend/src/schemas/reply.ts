import { z } from "zod";

export const replySchema = z.object({
  id: z.number(),
  replyId: z.number(),
  userId: z.number(),
  content: z.string(),
  createdAt: z.date(),
  deleted: z.boolean(),
  user: z.object({
    avatar: z.string(),
    username: z.string(),
    name: z.string(),
    id: z.number(),
  }),
  _count: z.object({
    Like: z.number(),
    replies: z.number(),
  }),
  Like: z.array(
    z.object({
      userId: z.number(),
    }),
  ),
  replies: z.array(
    z.object({
      id: z.number(),
      replyId: z.number(),
      userId: z.number(),
      content: z.string(),
      createdAt: z.date(),
      deleted: z.boolean(),
      user: z.object({
        avatar: z.string(),
        username: z.string(),
        name: z.string(),
      }),
      _count: z.object({
        Like: z.number(),
        replies: z.number(),
      }),
      Like: z.array(
        z.object({
          userId: z.number(),
        }),
      ),
    }),
  ),
});
