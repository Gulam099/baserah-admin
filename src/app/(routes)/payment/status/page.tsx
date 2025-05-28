"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Home,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import PageLoading from "@/components/page-loading";

export default function PaymentStatusPage({
  params,
  searchParams,
}: {
  params: { paymentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const status = searchParams.status as string;
  const message = decodeURIComponent((searchParams.message as string) || "");
  const amount = searchParams.amount;
  const moyasarPaymentId = searchParams.id as string;

  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(true);

  const isSuccess =
    status === "paid" || status === "success" || status === "successful";
  const isFailed = status === "failed";

  const mutation = useMutation({
    mutationFn: async function updatePaymentStatus() {
      await fetch(`/api/payment?paymentId=${params.paymentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moyasarPaymentId,
          status,
          amount,
          paidAt: new Date(),
        }),
      });
    },
  });

  useEffect(() => {
    async function checkAndUpdate() {
      try {
        const res = await fetch(`/api/payment?paymentId=${params.paymentId}`);
        if (!res.ok) throw new Error("Failed to fetch payment data");

        const existingPayment = await res.json();

        if (
          !existingPayment.status ||
          existingPayment.status.toLowerCase() !== status.toLowerCase()
        ) {
          setShouldUpdate(true);
        }
      } catch (err) {
        console.error("Error fetching payment:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAndUpdate();
  }, [params.paymentId, status]);

  useEffect(() => {
    if (!loading && shouldUpdate) {
      mutation.mutate();
    }
  }, [shouldUpdate]);

  if (loading || mutation.isPending) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-none overflow-hidden">
          <div
            className={`h-2 w-full ${
              isSuccess
                ? "bg-emerald-500"
                : isFailed
                ? "bg-rose-500"
                : "bg-amber-500"
            }`}
          />

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

            <h1 className="text-xl font-bold text-center">
              {isSuccess
                ? "Payment Successful"
                : isFailed
                ? "Payment Failed"
                : "Payment Processing"}
            </h1>

            <p className="text-neutral-500 mt-2 text-center text-sm max-w-xs">
              {isSuccess
                ? "Your transaction has been completed successfully."
                : isFailed
                ? `Transaction failed. ${message}`
                : `Status: ${status || "Unknown"}`}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm">Amount</span>
                <span className="font-semibold text-base">{amount} SAR</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm">Payment ID</span>
                <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
                  {params.paymentId || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-500 text-sm">Status</span>
                <Badge
                  className={`${
                    isSuccess
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : isFailed
                      ? "bg-rose-100 text-rose-700 hover:bg-rose-100"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  } , capitalize`}
                >
                  {status || "Unknown"}
                </Badge>
              </div>

              {message && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-sm">Message</span>
                  <p className="text-neutral-700 text-sm mt-1 break-words">
                    {message}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                router.push(`myapp://account/appointment`);
              }}
            >
              Continue
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-neutral-400 text-xs mt-4">
          If you have any questions, please contact our support team.
        </p>
      </motion.div>
    </div>
  );
}
