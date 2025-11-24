import { z } from "zod";

const PostSchema = z.object({
  content: z
    .string()
    .max(250, { error: "You have exceeded the allowed length of characters." }),
  userId: z.number(),
});

export default PostSchema;
