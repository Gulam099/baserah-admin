export interface AppointmentType {
  program: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
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
  patient_name: string;
  doctor_name: string;
}
