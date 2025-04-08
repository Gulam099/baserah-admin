"use server";

import Doctor from "@/features/user/model/doctor.model";
import { DoctorType } from "@/features/user/types/doctor.type";
import { connect } from "@/lib/db";

export async function createUser(user: Partial<DoctorType>) {
  try {
    await connect();
    const existingUser = await Doctor.findOne({ clerkId: user.clerkId });

    if (existingUser) {
      console.log("User already exists — updating instead");
      return await updateUser(existingUser._id, user);
    }

    const newUser = await Doctor.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  userId: string,
  updateData: Partial<DoctorType>
) {
  try {
    await connect();
    const updatedUser = await Doctor.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log("Error updating user:", error);
    throw new Error("User update failed");
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connect();
    const deletedUser = await Doctor.findOneAndDelete({ clerkId });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
