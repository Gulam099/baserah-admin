import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    clerk_id: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const EmployeeModel =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
