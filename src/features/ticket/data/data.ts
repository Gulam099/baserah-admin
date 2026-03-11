import { Employee, Team, Ticket } from "../types/ticket.type";

export const employees: Employee[] = [
  { id: "1", name: "Muhammad Al-Abdullah", nameAr: "محمد العبدالله" },
  { id: "2", name: "Ahmad Al-Khalidi", nameAr: "احمد الخالدي" },
  { id: "3", name: "Omar Al-Said", nameAr: "عمر السعيد" },
  // Add more employees...
];

export const teams: Team[] = [
  { id: "1", name: "Development team" },
  { id: "2", name: "System administrator" },
  { id: "3", name: "Capacity management team" },
  { id: "4", name: "Database team" },
  { id: "5", name: "Networking team" },
];

export const tickets: any[] = [
  {
    id: "1",
    ticketNumber: "187546321",
    priority: "High",
    subject: "Request",
    employeeId: null,
    teamId: null,
    type: "Technical",
    status: "Closed",
  },
  // Add more tickets...
];
