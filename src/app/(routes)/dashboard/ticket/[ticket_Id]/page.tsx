"use client";
import { ComplaintForms } from "@/features/ticket/components/complaint-forms";
import { ComplaintInfo } from "@/features/ticket/components/complaint-info";
import { ComplaintTracking } from "@/features/ticket/components/complaint-tracking";
import { tickets } from "@/features/ticket/data/data";
import React, { useState } from "react";

export default function TicketViewPage({
  params,
}: {
  params: { ticket_Id: string };
}) {
  const { ticket_Id } = params;

  const [ticketData, setTicketData] = useState(
    tickets.filter((ticket) => ticket.id === ticket_Id)[0]
  );

  const updateTicket = (field: "employeeId" | "teamId", value: string) => {
    setTicketData({ [field]: value });
  };

  const mockComplaintInfo = {
    requestType: "complaint",
    complaintNumber: "3245255",
    beneficiaryName: "Ahmed Muhammad",
    requestDate: "10/10/2022",
    contactNumber: "0555558874",
    remainingTime: "1 day",
    applicantName: "Mohamed Ahmed",
    applicantContact: "055XXXX299",
    typeOfRequest: "complaint",
    description:
      "This text is an example that can be replaced in the same space.",
    status: "The complaint has been transferred to the technical team",
    updateDate: "2023/01/15",
  };

  const mockTrackingEvents = [
    {
      date: "02/03/2023",
      title: "Raise the request",
      description:
        "This text is an example of text that can be replaced in the same space.",
    },
    {
      date: "02/03/2023",
      title: "Under review by the administrative team",
      description:
        "This text is an example of text that can be replaced in the same space.",
    },
  ];

  if(ticketData === undefined) {
    return <div>No ticket Found with this ID : {ticket_Id}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
        <div className="space-y-6">
          <ComplaintInfo info={mockComplaintInfo} />
          <ComplaintForms onUpdate={updateTicket} ticket={ticketData} />
        </div>
        <ComplaintTracking
          status={mockComplaintInfo.status}
          updateDate={mockComplaintInfo.updateDate}
          events={mockTrackingEvents}
        />
      </div>
    </div>
  );
}
