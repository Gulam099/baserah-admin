"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmployeeSelect } from "./employee-select";
import { Ticket } from "../types/ticket.type";
import { TeamSelect } from "./team-select";

export function ComplaintForms(props: {
  onUpdate: (field: "employeeId" | "teamId", value: string) => void;
  ticket: Ticket;
}) {
  const [activeTab, setActiveTab] = useState("transfer");

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Complaint Details</h2>
        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-muted-foreground">applicant's name</Label>
              <p className="font-medium">Mohamed Ahmed</p>
            </div>
            <div>
              <Label className="text-muted-foreground">contact number</Label>
              <p className="font-medium">055XXXX299</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type of Request</Label>
              <p className="font-medium">complaint</p>
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">
              Complaint Description
            </Label>
            <p className="text-sm">
              This text is an example that can be replaced in the same
              space.This text is an example that can be replaced in the same
              space.This text is an example that can be replaced in the same
              space.This text is an example that can be replaced in
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transfer">Transfer Complaint</TabsTrigger>
            <TabsTrigger value="response">Send Response</TabsTrigger>
          </TabsList>
          <TabsContent value="transfer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2 flex flex-col">
                <Label>Person Transferred to</Label>
                <EmployeeSelect
                  value={props.ticket.employeeId || undefined}
                  onChange={(value) => props.onUpdate("employeeId", value)}
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label>Team Transferred to</Label>
                <TeamSelect
                  value={props.ticket.teamId || undefined}
                  onChange={(value) => props.onUpdate("teamId", value)}
                />
              </div>
            </div>
            <div className="space-y-2 ">
              <Label>Respond to the complaint</Label>
              <Textarea placeholder="Enter Note" className="min-h-[100px]" />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button>Transfer Complaint</Button>
            </div>
          </TabsContent>
          <TabsContent value="response" className="space-y-4">
            <div className="space-y-2">
              <Label>Respond to the complaint</Label>
              <Textarea placeholder="Enter Note" className="min-h-[100px]" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button>Send Response to Customer</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
