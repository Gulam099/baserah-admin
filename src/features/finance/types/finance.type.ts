export type TransactionType = "Inward" | "Outward";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  administrator: string;
  isEmployee: boolean;
  walletAmount: number;
}

export type IncomeType = "Debtor" | "Creditor";
export type SourceType = "consultation" | "Cyber security" | "program";

export interface FinancialRecord {
  id: string;
  specialist: string;
  administrator: string;
  isEmployee: boolean;
  date: string;
  source: SourceType;
  amount: number;
  incomeType: IncomeType;
}

export interface PaginatedResponse {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Specialist {
  id: string;
  name: string;
  joinDate: string;
  discountPercentage: number;
  numberOfSessions: number;
  specialistRatio: number;
  taxRate: number;
  grossIncome: number;
  totalTax: number;
  status: string;
  paidStatus: "Paid" | "Unpaid";
  month: string;
}

export interface BankDetails {
  idNumber: string;
  name: string;
  clientType: string;
  amount: number;
  bankStatement: string;
  note?: string;
}
