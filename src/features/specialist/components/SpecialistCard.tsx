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

interface SpecialistCardProps {
  specialist: SpecialistType;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Initial Approved":
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Will End soon":
        return "bg-red-100 text-red-700";
      case "Approval Pending":
        return "bg-purple-100 text-purple-700";
      case "Previously Rejected":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold">{specialist.full_name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Canceling the contract</DropdownMenuItem>
            <DropdownMenuItem>Contract renewal</DropdownMenuItem>
            <DropdownMenuItem>Approval of the contract</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-[auto,1fr] gap-2">
            <span className="text-sm text-muted-foreground">Job Title:</span>
            <span className="text-sm font-medium">{specialist.specialization}</span>
            <span className="text-sm text-muted-foreground">Date:</span>
            <span className="text-sm font-medium">{specialist.created_at?.$date ? format(new Date(specialist.created_at.$date) , "EEE , dd MMM yyyy") : "NAN"}</span>
            <span className="text-sm text-muted-foreground">
              Qualification:
            </span>
            <span className="text-sm font-medium">
              {specialist.education ? specialist.education?.map((edu:string)=><span key={edu} className="capitalize">{edu},</span>) : "NAN"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                specialist.approval_status
              )}`}
            >
              {specialist.approval_status}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href={`/dashboard/specialist/${specialist._id.$oid}`}>
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
