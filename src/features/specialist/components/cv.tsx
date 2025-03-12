"use client";

import { Card, CardContent } from "@/components/ui/card";
import EditSpecialistDialog from "./edit-specialist-dialog";
import Link from "next/link";

export default function CV({ data }: any) {
  // If no data at all, show a fallback
  if (!data) {
    return (
      <div className="p-6">
        <Card className="mt-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No CV data found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safely handle each field with optional chaining or fallback text
  const fullName = data.full_name || "N/A";
  const mainSpecialty = data.specialization || "N/A";
  const subSpecialty = data.sub_specialization || "N/A";
  const educationList = Array.isArray(data.education) ? data.education : [];
  const educationString = educationList.length
    ? educationList.join(", ")
    : "N/A";
  const cvFile = data.cv;
  const experience = data.experience || "N/A";
  const briefBiography = data.bio || "No biography provided.";

  const info = [
    { label: "Full Name", value: fullName },
    { label: "Main Specialty", value: mainSpecialty },
    { label: "Subspecialty", value: subSpecialty },
    {
      label: "File of the latest academic qualification",
      value: educationString,
    },
    {
      label: "CV file",
      value: cvFile ? (
        <Link className="text-primary-200 underline" href={cvFile}>
          CV File
        </Link>
      ) : (
        "N/A"
      ),
    },
    { label: "Number of Years of Experience", value: experience },
  ];

  return (
    <div className="p-6">
      <Card className="mt-6">
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {info.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}

          {/* Brief Biography (span the whole row) */}
          <div className="col-span-3">
            <div className="text-sm text-muted-foreground mb-1">
              Brief biography
            </div>
            <p className="font-medium text-sm leading-relaxed whitespace-pre-line">
              {briefBiography}
            </p>
          </div>

          {/* Edit button at bottom-right */}
          <div className="flex justify-end items-end col-span-3">
            <EditSpecialistDialog data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
