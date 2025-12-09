import { newComment } from "@/app/post/schema/comment";
import { z } from "zod";

export type Comment = z.infer<typeof newComment>;
