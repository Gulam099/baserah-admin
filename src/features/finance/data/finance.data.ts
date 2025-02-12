import {
  FinancialRecord,
  PaginatedResponse,
  Transaction,
} from "../types/finance.type";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Inward",
    amount: 2049,
    date: "5-3-2023",
    administrator: "customer name",
    isEmployee: false,
    walletAmount: 300,
  },
  {
    id: "2",
    type: "Outward",
    amount: 298,
    date: "5-3-2023",
    administrator: "Employee Name",
    isEmployee: true,
    walletAmount: 20,
  },
  {
    id: "3",
    type: "Outward",
    amount: 200,
    date: "5-3-2023",
    administrator: "customer name",
    isEmployee: false,
    walletAmount: 93,
  },
  // Add more mock transactions...
];

export async function fetchTransactions(
  page: number,
  pageSize: number
): Promise<PaginatedResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: mockTransactions.slice(start, end),
    total: mockTransactions.length,
    page,
    pageSize,
  };
}

const mockFinancialRecords: FinancialRecord[] = [
  {
    id: "1",
    specialist: "Abdullah Al-Abdullah",
    administrator: "customer name",
    isEmployee: false,
    date: "5-3-2023",
    source: "consultation",
    amount: 2049,
    incomeType: "Debtor",
  },
  {
    id: "2",
    specialist: "Abdullah Al-Abdullah",
    administrator: "Employee Name",
    isEmployee: true,
    date: "5-3-2023",
    source: "Cyber security",
    amount: 298,
    incomeType: "Creditor",
  },
  {
    id: "3",
    specialist: "Abdullah Al-Abdullah",
    administrator: "customer name",
    isEmployee: false,
    date: "5-3-2023",
    source: "consultation",
    amount: 200,
    incomeType: "Debtor",
  },
  // Add more mock records...
];

export async function fetchFinancialRecords(
  page: number,
  pageSize: number
): Promise<PaginatedResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: mockFinancialRecords.slice(start, end),
    total: mockFinancialRecords.length,
    page,
    pageSize,
  };
}
