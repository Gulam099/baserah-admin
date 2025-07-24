// models/team.model.ts

import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    created_at: { type: Date, default: Date.now },
    permission: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const TeamModel =
  mongoose.models.Team || mongoose.model("Team", teamSchema);
