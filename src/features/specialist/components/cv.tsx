import { Card, CardContent } from "@/components/ui/card";
import EditSpecialistDialog from "./edit-specialist-dialog";
import Link from "next/link";

export default function CV(props: { data: any }) {
  const { data } = props;
  const info = [
    { label: "Full Name", value: data.full_name },
    { label: "Main Specialty", value: data.specialization },
    { label: "Subspecialty", value: data.sub_specialization },
    {
      label: "File of the latest academic qualification",
      value: data.education.join(", "),
    },
    {
      label: "CV file",
      value: (
        <Link className="text-primary-200 underline" href={data.cv}>
          CV File
        </Link>
      ),
    },
    { label: "Number of Years of Experience", value: data.experience },
  ];

  const briefBiography = data.bio;
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
