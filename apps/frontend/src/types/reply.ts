import { z } from "zod";

import { replySchema } from "@/schemas/reply";

export type ReplyType = z.infer<typeof replySchema>;
