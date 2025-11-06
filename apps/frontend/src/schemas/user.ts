import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string(),
  avatar: z.string(),
  onboarded: z.boolean(),
});

export { userSchema };
