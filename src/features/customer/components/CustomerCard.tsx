import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Customer } from "../types/customer.type";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="font-semibold">{customer.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile number:</span>
              <span>{customer.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Number:</span>
              <span>{customer.idNumber}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href={`/dashboard/customer/${customer.id}`}>
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
