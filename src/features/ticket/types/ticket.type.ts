export interface Employee {
    id: string
    name: string
    nameAr: string
  }
  
  export interface Team {
    id: string
    name: string
  }
  
  export interface Ticket {
    id: string
    ticketNumber: string
    priority: "High" | "Average" | "Low"
    subject: string
    employeeId: string | null
    teamId: string | null
    type: "Technical" | "Administrative" | "Financial" | "Report Incident"
    status: "Closed" | "Under Process"
  }
  
  