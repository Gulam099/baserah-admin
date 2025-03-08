import { Card, CardContent } from "@/components/ui/card";
import EditSpecialistDialog from "./edit-specialist-dialog";

export default function CV(props:{specilaistId:string}) {
  const info = [
    { label: "Full Name", value: "Mada Muhammad Al-Muhammad" },
    { label: "Main Specialty", value: "psychology" },
    { label: "Subspecialties", value: "Forensic psychology" },
    {
      label: "File of the latest academic qualification",
      value: "jpg and png file",
    },
    { label: "CV file", value: "jpg and png file" },
    { label: "Number of Years of Experience", value: "17 years" },
  ];

  const briefBiography = `Doctorate in Psychology, Diploma in Cognitive-Behavioral Therapy, Cognitive-Behavioral Therapist, Therapist with Dual Stimulation and Desensitization, Specialist in Treating Psychological Trauma, Disorder of Immediateness, Doctorate in Psychology, Diploma in Cognitive-Behavioral Therapy, Cognitive-Behavioral Therapist, Therapist with Dual Stimulation and Desensitization, Specialized in Treating Psychological Trauma , Disorder of Immediateness, Doctorate of Psychology, Diploma in Cognitive-Behavioral Therapy, Cognitive-Behavioral Therapist, Therapist with Dual Stimulation and Desensitization, Specialist in Treating Psychological Trauma, Disorder of Immediateness, Doctorate of Psychology, Diploma in Cognitive-Behavioral Therapy, Cognitive-Behavioral Therapist, Therapist with Dual Stimulation and Desensitization, Specialized in treating psychological trauma, immediate disorder,`;
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
            <EditSpecialistDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
