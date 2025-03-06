export interface AppointmentType {
  _id: string;
  user: string;
  doctor: string;
  bookingDate: string;
  time: string;
  date: string;
  createdAt: string;
  duration: string;
  timeSlot: string;
  status: "confirmed" | "cancelled" | "upcoming" | "ongoing";
  isImmediate: boolean;
}
