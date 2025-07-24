// models/employee.model.ts

import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String,
    department: String,
    clerk_id: String, // Optional
  },
  { timestamps: true }
);

export const EmployeeModel =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
