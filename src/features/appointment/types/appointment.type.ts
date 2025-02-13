export interface AppointmentType {
    id: string;
    number: string;
    name: string;
    bookingDate: string;
    time: string;
    date: string;
    type: "tabular" | "immediately";
    status: "Completed" | "Upcoming" | "Ongoing" | "Cancelled";
    isImmediate: boolean;
  }