import { z } from "zod";

const postSchema = z.object({
  id: z.number(),
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
    Comment: z.number(),
  }),
});

export { postSchema };
