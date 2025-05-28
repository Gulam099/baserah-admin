export interface AppointmentType {
  userId: any;
  program: string;
  _id: string;
  doctor: string;
  bookingDate: string;
  time: string;
  date: string;
  createdAt: string;
  duration: string;
  timeSlot: string;
  status: "confirmed" | "cancelled" | "upcoming" | "ongoing";
  isImmediate: boolean;
  patient_name: string;
  doctor_name: string;
}
