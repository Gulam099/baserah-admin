"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertTriangle, Home, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import Link from "next/link";

const moyasarSecretKey = process.env.MOYASAR_TEST_SECRET_KEY;

export default function PaymentStatusPage({
  params,
  searchParams,
}: {
  params: { paymentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const status = searchParams.status; // initial status from query (may change after verifying)
  const message = decodeURIComponent(searchParams.message as string || "");
  const amount = searchParams.amount;
  const moyasarPaymentId = searchParams.id as string;

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string>("");
  const [formattedAmount, setFormattedAmount] = useState<string>("0.00");

  const isSuccess = paymentStatus === "paid" || paymentStatus === "success" || paymentStatus === "successful";
  const isFailed = paymentStatus === "failed";
  const isPending = !isSuccess && !isFailed;

  useEffect(() => {
    async function verifyAndUpdatePayment() {
      if (!moyasarPaymentId) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch Payment Details from Moyasar
        const moyasarRes = await fetch(`https://api.moyasar.com/v1/payments/${moyasarPaymentId}`, {
          headers: {
            Authorization: `Basic ${btoa(`${moyasarSecretKey}:`)}`, 
          },
        });

        if (!moyasarRes.ok) throw new Error("Failed to fetch Moyasar payment details.");

        const paymentData = await moyasarRes.json();

        // 2. Update Payment + Booking in DB via Mutation
        const updateRes = await fetch("/api/payment", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moyasarPaymentId: paymentData.id,
            status: paymentData.status,
            amount: paymentData.amount,
            source : paymentData.source,
            invoiceId : paymentData.invoice_id,
            paidAt: paymentData.captured_at,
          }),
        });

        if (!updateRes.ok) throw new Error("Failed to update payment status.");

        // 3. Update UI State
        setPaymentStatus(paymentData.status);
        setFormattedAmount((Number(paymentData.amount) / 100).toFixed(2));
        setPaymentMessage(paymentData.description || "");

      } catch (err: any) {
        console.error(err.message);
        setPaymentStatus("failed");
        setPaymentMessage(err.message || "Something went wrong while verifying payment.");
      } finally {
        setLoading(false);
      }
    }

    verifyAndUpdatePayment();
  }, [moyasarPaymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className={`h-2 w-full ${isSuccess ? "bg-emerald-500" : isFailed ? "bg-rose-500" : "bg-amber-500"}`} />

          <CardHeader className="pt-8 pb-0 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.2,
              }}
              className={`rounded-full p-4 mb-4 ${
                isSuccess
                  ? "bg-emerald-50 text-emerald-500"
                  : isFailed
                  ? "bg-rose-50 text-rose-500"
                  : "bg-amber-50 text-amber-500"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="size-14" />
              ) : isFailed ? (
                <XCircle className="size-14" />
              ) : (
                <AlertTriangle className="size-14" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-center">
              {isSuccess ? "Payment Successful" : isFailed ? "Payment Failed" : "Payment Processing"}
            </h1>

            <p className="text-slate-500 mt-2 text-center max-w-xs">
              {isSuccess
                ? "Your transaction has been completed successfully."
                : isFailed
                ? `Transaction failed. ${paymentMessage}`
                : `Status: ${paymentStatus || "Unknown"}`}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-lg">{formattedAmount} SAR</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment ID</span>
                <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{moyasarPaymentId || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status</span>
                <Badge
                  className={`${
                    isSuccess
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : isFailed
                      ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {paymentStatus || "Unknown"}
                </Badge>
              </div>

              {paymentMessage && (
                <div className="pt-2">
                  <span className="text-slate-500 text-sm">Message</span>
                  <p className="text-slate-700 text-sm mt-1 break-words">{paymentMessage}</p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Return Home
              </Link>
            </Button>

            <Button
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                router.push(`myapp://account/appointment`); // 👈 Deep link back to your app booking page
              }}
            >
              Continue
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-slate-400 text-xs mt-4">
          If you have any questions, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
}
