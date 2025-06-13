export type SpecialistStatusType =
  | "Initially Approved"
  | "Will End soon"
  | "Approval Pending"
  | "Approved"
  | "Previously Rejected";

/**
 * Represents a single specialist record.
 */
export interface SpecialistType {
  id: string;
  unsafeMetadata: any;
  createdAt: any;
  firstName: any;
  _id: string;
  clerkId: string;
  address: string;
  age_categories: string[];
  approval_status: string;
  available: boolean;
  bio: string;
  consultation_method: string[];
  created_at: string;
  cv: string;
  education: string[];
  email: string;
  experience: string;
  fees: string;
  full_name: string;
  language: string[];
  phoneNumber: string;
  profile_picture: string;
  response_time: string;
  specialization: string;
  sub_specialization: string;
  updated_at: string;
}
