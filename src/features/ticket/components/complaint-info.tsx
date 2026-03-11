import { Card, CardContent } from "@/components/ui/card"

interface ComplaintInfo {
  requestType: string
  complaintNumber: string
  beneficiaryName: string
  requestDate: string
  contactNumber: string
  remainingTime: string
}

interface ComplaintInfoProps {
  info: ComplaintInfo
}

export function ComplaintInfo({ info }: ComplaintInfoProps) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6">
        <h2 className="font-semibold mb-4">Complaint Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Request Type</p>
            <p className="font-medium">{info.requestType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Complaint Number</p>
            <p className="font-medium">{info.complaintNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Beneficiary Name</p>
            <p className="font-medium">{info.beneficiaryName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Request Date</p>
            <p className="font-medium">{info.requestDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium">{info.contactNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining Time to Process Complaint</p>
            <p className="font-medium">{info.remainingTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

