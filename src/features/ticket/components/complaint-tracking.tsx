import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackingEvent } from "../types/ticket.type";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComplaintTrackingProps {
  status: string;
  updateDate: string;
  events: TrackingEvent[];
}

export function ComplaintTracking({
  status,
  updateDate,
  events,
}: ComplaintTrackingProps) {
  return (
    <div className="space-y-4 h-full">
      <Card className="bg-blue-900 text-white">
        <CardContent className="p-6">
          <h3 className="text-sm mb-2">Current order status</h3>
          <p className="text-lg font-semibold">{status}</p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span>Update date</span>
            <span>{updateDate}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Complaint tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md ">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-24 flex-shrink-0 text-sm text-muted-foreground">
                  {event.date}
                </div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
