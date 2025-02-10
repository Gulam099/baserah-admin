import React from "react";

export default function TicketViewPage({
  params,
}: {
  params: { ticket_Id: string };
}) {
  const { ticket_Id } = params;

  return (
    <div>
      <div>My Post: {ticket_Id}</div>
    </div>
  );
}
