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

interface SpecialistCardProps {
  specialist: SpecialistType;
}

export function SpecialistCard({ specialist }: SpecialistCardProps) {
  const getStatusColor = (status: SpecialistType["status"]) => {
    switch (status) {
      case "Initially Approved":
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
        <h3 className="font-semibold">{specialist.name}</h3>
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
            <span className="text-sm font-medium">{specialist.jobTitle}</span>
            <span className="text-sm text-muted-foreground">Date:</span>
            <span className="text-sm font-medium">{specialist.date}</span>
            <span className="text-sm text-muted-foreground">
              Qualification:
            </span>
            <span className="text-sm font-medium">
              {specialist.qualification}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                specialist.status
              )}`}
            >
              {specialist.status}
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
