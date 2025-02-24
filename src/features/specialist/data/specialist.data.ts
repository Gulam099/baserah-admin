import { SpecialistType } from "../types/specialist.type";

export const mockSpecialist: SpecialistType[] = Array.from(
  { length: 50 },
  (_, i) => ({
    id: `emp${i + 1}`,
    name: "Abdullah Al-Abdulrahman",
    jobTitle: "Psychologist",
    date: "2023-12-25",
    qualification: "Bachelor's Degree",
    status: [
      "Initially Approved",
      "Will End soon",
      "Approval Pending",
      "Approved",
      "Previously Rejected",
    ][Math.floor(Math.random() * 5)] as SpecialistType["status"],
  })
);

export const ratings = [
  {
    date: "2023-12-25",
    name: "Abdullah Al-Abdulrahman",
    rating: 99,
    details: {
      punctuality: 100,
      quietEnvironment: 100,
      empathyAndAcceptance: 100,
      respectIdeasAndOpinions: 99,
      listeningAndListening: 100,
      feelingSafeDuringSession: 100,
    },
    comment: "God willing, the doctor was very sympathetic, cooperative",
  },
  {
    date: "2023-12-24",
    name: "Abdullah Al-Abdulrahman",
    rating: 98,
    details: {
      punctuality: 98,
      quietEnvironment: 100,
      empathyAndAcceptance: 99,
      respectIdeasAndOpinions: 98,
      listeningAndListening: 97,
      feelingSafeDuringSession: 100,
    },
    comment: "Excellent session, very helpful",
  },
  {
    date: "2023-12-23",
    name: "Abdullah Al-Abdulrahman",
    rating: 100,
    details: {
      punctuality: 100,
      quietEnvironment: 100,
      empathyAndAcceptance: 100,
      respectIdeasAndOpinions: 100,
      listeningAndListening: 100,
      feelingSafeDuringSession: 100,
    },
    comment: "Perfect experience, highly recommended",
  },
  {
    date: "2023-12-22",
    name: "Abdullah Al-Abdulrahman",
    rating: 97,
    details: {
      punctuality: 95,
      quietEnvironment: 100,
      empathyAndAcceptance: 98,
      respectIdeasAndOpinions: 97,
      listeningAndListening: 96,
      feelingSafeDuringSession: 100,
    },
    comment: "Very professional and understanding",
  },
  {
    date: "2023-12-21",
    name: "Abdullah Al-Abdulrahman",
    rating: 99,
    details: {
      punctuality: 100,
      quietEnvironment: 98,
      empathyAndAcceptance: 100,
      respectIdeasAndOpinions: 99,
      listeningAndListening: 100,
      feelingSafeDuringSession: 98,
    },
    comment: "Great session, felt very comfortable",
  },
  {
    date: "2023-12-22",
    name: "Abdullah Al-Abdulrahman",
    rating: 97,
    details: {
      punctuality: 95,
      quietEnvironment: 100,
      empathyAndAcceptance: 98,
      respectIdeasAndOpinions: 97,
      listeningAndListening: 96,
      feelingSafeDuringSession: 100,
    },
    comment: "Very professional and understanding",
  },
  {
    date: "2023-12-21",
    name: "Abdullah Al-Abdulrahman",
    rating: 99,
    details: {
      punctuality: 100,
      quietEnvironment: 98,
      empathyAndAcceptance: 100,
      respectIdeasAndOpinions: 99,
      listeningAndListening: 100,
      feelingSafeDuringSession: 98,
    },
    comment: "Great session, felt very comfortable",
  },
];
