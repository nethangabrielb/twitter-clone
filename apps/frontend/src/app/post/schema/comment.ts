import { z } from "zod";

export const newComment = z.object({
  content: z
    .string()
    .max(250, { error: "You have exceeded the allowed length of characters." }),
  userId: z.number().optional(),
  replyId: z.number(),
});
