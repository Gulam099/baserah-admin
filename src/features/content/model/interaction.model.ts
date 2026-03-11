import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Interaction extends Document {
  userId: ObjectId;
  targetId: ObjectId; // ID of the thing being interacted with
  targetType: string; // more as needed
  type: "like" | "view" | "share" ; // interaction action
  createdAt?: Date;
}

const InteractionSchema = new Schema<Interaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "view", "share"],
      required: true,
    },
  },
  { timestamps: true }
);

InteractionSchema.index({ userId: 1, targetId: 1, type: 1 }, { unique: true }); // prevent duplicate likes etc.

const Interaction =
  mongoose.models.Interaction ||
  mongoose.model<Interaction>("Interaction", InteractionSchema, "interactions");

export default Interaction;
