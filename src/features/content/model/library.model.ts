import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Define the interface representing a Library content document in MongoDB
export interface LibraryContent extends Document {
  _id: ObjectId;
  title: string;
  tags: string[]; // e.g., ["mental health", "fitness"]
  slug: string; // for clean URLs
  category: string[];
  description: string;
  thumbnail?: string;
  type: "audio" | "video" | "article";
  url?: string;
  text?: string;
  views: number;
  likes: number;
  shares: number;
  publishedDate: Date;
  authorId: ObjectId; // Link to the author document (Referencing)
  message?: string; // Optional message field
  status: "draft" | "published" | "archived"; // Content status
  isApproved: boolean;
  approvedBy?: ObjectId; // Reference to the user who approved the content
  createdAt?: Date; // Timestamp for when the document was created
  updatedAt?: Date; // Timestamp for when the document was last updated
}

// Define the Library schema
const LibraryContentSchema = new Schema<LibraryContent>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    tags: [String], // e.g., ["mental health", "fitness"]
    slug: { type: String, unique: true }, // for clean URLs
    category: { type: [String], required: true },
    description: { type: String, required: true },
    thumbnail: { type: String},
    type: { type: String, enum: ["audio", "video", "article"], required: true },
    url: { type: String },
    text: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    publishedDate: { type: Date, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true }, // Reference to Author model
    message: { type: String },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to User model
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
