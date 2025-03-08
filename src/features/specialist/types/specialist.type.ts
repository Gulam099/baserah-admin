export type SpecialistStatusType =
  | "Initially Approved"
  | "Will End soon"
  | "Approval Pending"
  | "Approved"
  | "Previously Rejected";

  export interface Oid {
    $oid: string
  }
  
  /**
   * Represents a single specialist record.
   */
  export interface SpecialistType {
    _id: Oid
    address: string
    age_categories: string[]
    approval_status: string
    available: boolean
    bio: string
    consultation_method: string[]
    created_at: {
      $date: string // e.g. "2025-02-22T01:08:09.081Z"
    }
    cv: string
    education: string[]
    email: string
    experience: string
    fees: string
    full_name: string
    is_authenticated: boolean
    language: string[]
    phoneNumber: string
    profile_picture: string
    response_time: string
    specialization: string
    sub_specialization: string
    updated_at: {
      $date: string // e.g. "2025-03-07T06:53:15.223Z"
    }
  }
  
