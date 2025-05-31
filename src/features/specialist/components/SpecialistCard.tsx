import { ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SpecialistType } from "../types/specialist.type";
import Link from "next/link";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Import TanStack Query
import { updateDoctor, createDoctor } from "../utils/specialist.util";

interface SpecialistCardProps {
  specialist: SpecialistType;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const queryClient = useQueryClient();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "final_approved":
        return "bg-green-100 text-green-700";
      case "auth_contract":
        return "bg-red-100 text-red-700";
      case "initial_approved":
        return "bg-purple-100 text-purple-700";
      case "contract_send":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Use Mutation for updating approval status
  const mutation = useMutation({
    mutationFn: ({ clerkId, status }: { clerkId: string; status: string }) =>
      updateDoctor(clerkId, { unsafeMetadata: { approval_status: status } }),
    onSuccess: async (data, variables) => {
      const { status, clerkId } = variables;
      console.log("✅ Approval status updated successfully!");

      if (status === "final_approved") {
        try {
          console.log("✅ Creating Doctor!", clerkId);

          // Assuming you have a createDoctor function that calls your Next.js API
          await createDoctor(clerkId);
          console.log("✅ Doctor inserted into DB successfully!");
        } catch (error) {
          console.error("❌ Error inserting doctor into DB:", error);
        }
      }
      console.log("✅ Approval status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["specialists"] });
    },
    onError: (error) => {
      console.error("❌ Error updating approval status:", error);
    },
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold">
          {specialist?.firstName ?? "No Name Found"}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  clerkId: specialist?.id,
                  status: "contract_send",
                })
              }
            >
              Contract Send
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  clerkId: specialist?.id,
                  status: "auth_contract",
                })
              }
            >
              Authenticate Contract
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  clerkId: specialist?.id,
                  status: "initial_approved",
                })
              }
            >
              Initial Approval of the contract
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                mutation.mutate({
                  clerkId: specialist?.id,
                  status: "final_approved",
                })
              }
            >
              Final Approval of the contract
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <span className="text-sm text-muted-foreground">Job Title:</span>
            <span className="text-sm font-medium">
              {specialist?.unsafeMetadata?.specialization ?? "NAN"}
            </span>
            <span className="text-sm text-muted-foreground">Date:</span>
            <span className="text-sm font-medium">
              {specialist?.createdAt
                ? format(new Date(specialist?.createdAt), "EEE , dd MMM yyyy")
                : "NAN"}
            </span>
            <span className="text-sm text-muted-foreground">
              Qualification:
            </span>
            {/* <span className="text-sm font-medium">
              {specialist.education
                ? specialist.education?.map((edu: string) => (
                  <span key={edu} className="capitalize">
                    {edu},
                  </span>
                ))
                : "NAN"}
            </span> */}
          </div>
          <div className="flex items-center justify-between pt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                specialist?.unsafeMetadata?.approval_status
              )}`}
            >
              {specialist.unsafeMetadata?.approval_status?.split("_")?.join(" ") ??
                "No Status Found"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href={`/dashboard/specialist/${specialist.id}`}>
                Show More
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
