import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface representing a Library content document in MongoDB
export interface LibraryContent extends Document {
  _id: ObjectId;
  title: string;
  category: string;
  description: string;
  type: string;
  duration: string;
  thumbnail: string;
  mediaUrl: string;
  seenCount: number;
  rating: number;
  likes: number;
  shares: number;
  publishedDate: string;
  author_id: ObjectId; // Link to the author document (Referencing)
  message?: string; // Optional message field
  isApproved: boolean;
}

// Define the Library schema
const LibraryContentSchema = new Schema<LibraryContent>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    thumbnail: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    seenCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    publishedDate: { type: String, required: true },
    author_id: { type: Schema.Types.ObjectId, ref: "Doctor", required: true }, // Reference to Author model
    message: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false, // allow old documents through
  }
);

// Create and export the Library model
const LibraryContent =
  mongoose.models.LibraryContent ||
  mongoose.model<LibraryContent>(
    "LibraryContent",
    LibraryContentSchema,
    "culturalcontents"
  );

export default LibraryContent;
