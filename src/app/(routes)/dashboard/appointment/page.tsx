"use client"

import { AlertTriangle, MoreVertical, FileText, MessageSquare, Ticket, X, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export interface Appointment {
  id: string
  number: string
  name: string
  bookingDate: string
  time: string
  date: string
  type: "tabular" | "immediately"
  status: "Completed" | "Upcoming" | "Ongoing" | "Cancelled"
  isImmediate: boolean
}

export const appointments: Appointment[] = [
  {
    id: "1",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Completed",
    isImmediate: false,
  },
  {
    id: "2",
    number: "187546321",
    name: "Muhammad Al-Khalidi",
    bookingDate: "5-3-2023",
    time: "03:50",
    date: "5-3-2023",
    type: "tabular",
    status: "Upcoming",
    isImmediate: true,
  },
  // Add more mock data as needed...
]


export default function page() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500 text-white"
      case "Upcoming":
        return "bg-yellow-500 text-white"
      case "Ongoing":
        return "bg-blue-500 text-white"
      case "Cancelled":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Alert className="mb-6 border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-600">
          The presence of this symbol means that there is a psychological emergency in the case, for example the
          presence of suicidal thoughts
        </AlertDescription>
      </Alert>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.number}</TableCell>
                <TableCell>{appointment.name}</TableCell>
                <TableCell>{appointment.bookingDate}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    {appointment.isImmediate && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Medical Record
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Customer Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ticket className="mr-2 h-4 w-4" />
                        Open ticket
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <X className="mr-2 h-4 w-4" />
                        Cancel Session Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Change Session Appointment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
