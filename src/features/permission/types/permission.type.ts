export interface TeamItemType {
    _id: string;
    name: string;
    members: string[];
    created_at: string | null;
    permission?: {};
  }
 export interface EmployeeItemType {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
    permission?: {};
  }