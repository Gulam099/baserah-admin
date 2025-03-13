export type CustomerType = "all" | "vip" | "incomplete" | "forbidden";
export type MedicalType = "all" | "prescription" | "treatment-plans";
export type MetricType =
  | "gad-scales"
  | "mood-scales"
  // | "quality-Life-scales"
  | "depressive-scales";

/**
 * Main interface representing a single patient/customer record.
 */
export interface Customer {
  __v: number;
  _id: string;

  // Address can be a string, an object, or omitted
  address?: string | Address;

  cards: Card[];

  createdAt: string;
  dob?: string; // sometimes "Not selected"
  email?: string;
  family: FamilyMember[];
  favorites: Favorites;

  gender?: string; // e.g. "Male", "Not selected"
  imageUrl?: string | null;
  isAuthenticated: boolean;

  // Last OTP sent time & expiration time in epoch ms
  lastOtpSentTime?: number;
  otpExpirationTime?: number;

  name?: string | null;
  notifications: NotificationItem[];
  passcode?: string | null;

  phoneNumber?: string | null;
  updatedAt?: string;
}

/**
 * If address is stored as an object:
 * e.g. { "line1": "VPO Jindwari", "line2": "Nangal" }
 */
export interface Address {
  line1?: string;
  line2?: string;
}

/**
 * Each card object, e.g.:
 * {
 *   "_id": "678e21cdfb372c1416d9eff2",
 *   "abbreviatedName": "Company Card",
 *   "cardNumber": "6545 4654 6456 4646",
 *   "cvvCode": "545",
 *   "expiryDate": "05/29",
 *   "nameOnCard": "Google"
 * }
 */
export interface Card {
  _id: string;
  abbreviatedName?: string;
  cardNumber?: string;
  cvvCode?: string;
  expiryDate?: string;
  nameOnCard?: string;
}

/**
 * A family member entry, e.g.:
 * {
 *   "_id": "67875ead39af47503a9d8304",
 *   "age": 21,
 *   "fileNo": "546545",
 *   "idNumber": "541545464654",
 *   "name": "Jaideep",
 *   "relationship": "Friend"
 * }
 */
export interface FamilyMember {
  _id?: string;
  age?: number;
  fileNo?: string;
  idNumber?: string;
  name?: string;
  relationship?: string;
}

/**
 * Favorites object, e.g.:
 * {
 *   "culturalContent": ["677ff36762c13a86b58a9eab"],
 *   "doctors": ["67716bee719838006ca2f482"],
 *   "groups": ["6786dd78bc02634288f3af56"],
 *   "programs": ["6786e49c015ee6111e0ac717"]
 * }
 */
export interface Favorites {
  culturalContent?: string[];
  doctors?: string[];
  groups?: string[];
  programs?: string[];
}

/**
 * Notification item, e.g.:
 * {
 *   "_id": "67813c06e5a46b2d0f51ae8c",
 *   "date": "27/12/2003",
 *   "message": "Testing notification."
 * }
 */
export interface NotificationItem {
  _id: string;
  date: string;
  message: string;
}

export interface PaginatedResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
}
