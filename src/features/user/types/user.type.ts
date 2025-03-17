// /types/user.type.ts
import { z } from "zod";
import { UserSchema } from "../schema/user.schema";

export type UserType = z.infer<typeof UserSchema>;