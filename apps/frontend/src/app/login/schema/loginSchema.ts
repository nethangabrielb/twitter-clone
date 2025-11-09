import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().refine((val) => val.trim().length >= 1, {
    message: "Username is required",
  }),

  password: z.string().refine((val) => val.trim().length >= 1, {
    error: "Password is required",
  }),
});
