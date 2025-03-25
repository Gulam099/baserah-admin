import { z } from "zod";
import { patientSchema } from "../schema/patient.schema";

export type PatientType = z.infer<typeof patientSchema>;
