import { ChevronRight, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Customer } from "../types/customer.type";

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const nameInitial = customer.name?.charAt(0).toUpperCase() || "?";
  const hasContactInfo = customer.phoneNumber || customer.email;

  return (
    <Card className="w-full rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-border h-40"> {/* Increased height */}
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start gap-4 flex-grow">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-medium">
              {nameInitial}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col flex-grow min-w-0">
            <h3 className="font-medium text-base text-foreground truncate">
              {customer.name || "No name provided"}
            </h3>

            {hasContactInfo ? (
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                {customer.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{customer.phoneNumber}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-2">No contact info</p>
            )}
          </div>
        </div>

        {/* Action button positioned at bottom right */}
        <div className="flex justify-end mt-auto pt-2">
          <Link href={`/dashboard/customer/${customer._id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/5 flex items-center"
            >
              Show More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}