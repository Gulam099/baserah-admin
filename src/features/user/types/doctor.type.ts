// /types/user.type.ts
import { z } from "zod";
import DoctorSchema from "../schema/doctor.schema";

export type DoctorType = z.infer<typeof DoctorSchema>;