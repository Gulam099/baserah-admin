"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerPage() {
  const params = useParams();
  const { customer_id } = params;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Customer ID: {customer_id}</p>
          {/* Add more customer details here when connected to real API */}
        </CardContent>
      </Card>
    </div>
  );
}
