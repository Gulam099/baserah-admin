"use server";

import Patient from "@/features/user/model/patient.model";
import { PatientType } from "@/features/user/types/patient.type";
import { connect } from "@/lib/db";

// 🔹 Central error handler to keep things clean
const handleDbError = (error: unknown, message: string) => {
  console.error(`${message}:`, error);
  throw new Error(message);
};

// 🔹 Create or update a patient seamlessly
export async function savePatient(patient: Partial<PatientType>) {
  try {
    await connect();

    const savedPatient = await Patient.findOneAndUpdate(
      { clerkId: patient.clerkId },
      { $set: patient }, // Only update provided fields
      { new: true, upsert: true } // Creates if not found
    );

    return JSON.parse(JSON.stringify(savedPatient));
  } catch (error) {
    handleDbError(error, "Failed to save patient");
  }
}

// 🔹 Update patient (strictly for existing patients)
export async function updatePatient(
  patientId: string,
  updateData: Partial<PatientType>
) {
  try {
    await connect();

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedPatient) throw new Error("Patient not found");

    return JSON.parse(JSON.stringify(updatedPatient));
  } catch (error) {
    handleDbError(error, "Patient update failed");
  }
}

// 🔹 Delete patient by Clerk ID
export async function deletePatient(clerkId: string) {
  try {
    await connect();

    const deletedPatient = await Patient.findOneAndDelete({ clerkId });
    if (!deletedPatient) throw new Error("Patient not found");

    return deletedPatient;
  } catch (error) {
    handleDbError(error, "Error deleting patient");
  }
}
