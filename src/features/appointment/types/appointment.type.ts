export interface AppointmentType {
  userId: any;
  patientId: any;
  program: string;
  _id: string;
  accepted: boolean;
  doctorId: any;
  bookingDate: string;
  time: string;
  date: string;
  createdAt: string;
  duration: string;
  timeSlot: string;
  selectedSlots: string;
  status: "confirmed" | "cancelled" | "upcoming" | "ongoing";
  isImmediate: boolean;
  patient_name: string;
  doctor_name: string;
}
