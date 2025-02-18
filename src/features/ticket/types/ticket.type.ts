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
  

  export interface ComplaintInfo {
    requestType: string
    complaintNumber: string
    beneficiaryName: string
    requestDate: string
    contactNumber: string
    remainingTime: string
    applicantName: string
    applicantContact: string
    typeOfRequest: string
    description: string
    status: string
    updateDate: string
  }
  
  export interface TrackingEvent {
    date: string
    title: string
    description: string
  }
  
  