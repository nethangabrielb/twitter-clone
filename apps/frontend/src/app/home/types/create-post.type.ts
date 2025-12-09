import PostSchema from "@/app/home/schema/create-post.schema";
import { z } from "zod";

export type NewPost = z.infer<typeof PostSchema>;
