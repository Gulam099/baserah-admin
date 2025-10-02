// utils/groupPayments.ts
import { groupBy } from "lodash";

export function groupPaymentsByDoctor(payments: any[]) {
  // group using lodash or manually
  const grouped = groupBy(payments, (p) => p.doctorId?._id || "Unknown Doctor");

  return Object.entries(grouped).map(([doctorId, doctorPayments]) => {
    const totalAmount = doctorPayments.reduce(
      (sum, p: any) => sum + Number(p.amount || 0),
      0
    );

    const sessionCount = doctorPayments.reduce((sum, payment) => {
      return sum + Number(payment.sessionCount || 0);
    }, 0);
    return {
      doctorId,
      doctor: doctorPayments[0]?.doctorId || { full_name: "Unknown Doctor" },
      totalAmount,
      payments: doctorPayments,
      sessionCount,
    };
  });
}
