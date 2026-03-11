"use server";

import User from "@/features/user/model/user.model";
import { UserType } from "@/features/user/types/user.type";
import { connect } from "@/lib/db";

export async function createUser(user: Partial<UserType>) {
  try {
    await connect(); // Ensure that the database connection is established
    const newUser = await User.create(user); // Create a new user in the database
    return JSON.parse(JSON.stringify(newUser)); // Return the newly created user as a plain object
  } catch (error) {
    console.error("Error creating user:", error); // Log any errors for debugging
    throw new Error("Failed to create user"); // Throw an error to be handled by the caller
  }
}

export async function updateUser(userId: string, updateData: Partial<UserType>) {
  try {
    await connect();
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log("Error updating user:", error);
    throw new Error("User update failed");
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connect();
    const deletedUser = await User.findOneAndDelete({ clerkId });
    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}