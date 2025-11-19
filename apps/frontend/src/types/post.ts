import { z } from "zod"
import { postSchema } from "@/schemas/post"

export type Post = z.infer<typeof postSchema>