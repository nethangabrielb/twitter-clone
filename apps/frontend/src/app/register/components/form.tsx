import { useForm } from "react-hook-form";
import * as z from "zod";

import { authApi } from "@/lib/api/auth";

// define zod schema
const registerSchema = z
  .object({
    name: z.string().refine((val) => val.trim().length >= 1, {
      message: "Name is required",
    }),
    username: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        message: "Username is required",
      })
      .refine(
        async (val) => {
          const isUnique = await authApi.checkPropertyUnique(val, "username");
          return isUnique;
        },
        { message: "This username is already taken" },
      ),
    email: z
      .email()
      .refine((val) => val.trim().length >= 1, {
        message: "Email is required",
      })
      .refine(
        async (val) => {
          const isUnique = await authApi.checkPropertyUnique(val, "email");
          return isUnique;
        },
        { message: "This email is already taken" },
      ),
    password: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        message: "Password is required",
      })
      .min(12)
      .refine((val) => /(?=.*[A-Z])(?=.*[^A-Za-z0-9])/.test(val)),
    confirmPassword: z
      .string()
      .refine((val) => val.trim().length >= 1, {
        message: "Password is required",
      })
      .min(12)
      .refine((val) => /(?=.*[A-Z])(?=.*[^A-Za-z0-9])/.test(val)),
    avatar: z
      .file()
      .refine((file) => {
        if (file) {
          return (
            file.size <= 5 * 1024 * 1024,
            {
              error: "Image exceeds the 5MB limit.",
            }
          );
        }
      })
      .nullable(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
  });

// apply zod schema to ts interface

const RegisterForm = () => {
  return <></>;
};

export default RegisterForm;
