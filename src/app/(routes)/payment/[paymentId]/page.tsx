"use client";

import Logo from "@/components/custom/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PaymentType } from "@/features/finance/types/payment.type";
import { currencyFormatter } from "@/features/home/utils/currencyFormatter.utils";
import { useQuery } from "@tanstack/react-query";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { number } from "zod";

const moyasarPublicKey = process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLIC_KEY;

export default function PaymentPage({
  params,
  searchParams,
}: {
  params: { paymentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { paymentId } = params;
  const { language } = searchParams;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isCardSave, setIsCardSave] = useState(true);

  const {
    data: paymentObj,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
    error: PaymentError,
  } = useQuery({
    queryKey: ["payment", paymentId],
    queryFn: async () => {
      const res = await fetch(`/api/payment?paymentId=${paymentId}`);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    data: bookingObj,
    isLoading: isBookingLoading,
    isError: isBookingError,
    error: BookingError,
  } = useQuery({
    queryKey: ["booking", paymentId],
    queryFn: async () => {
      const res = await fetch(`/api/booking?paymentId=${paymentId}`);
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  if (isPaymentLoading || isBookingLoading) {
    return <div>Loading...</div>;
  }
  const payment: any = paymentObj?.data;
  const doctor = payment?.doctorId;
  const patient = payment?.patientId;
  const booking = bookingObj?.data;
  // console.log(payment);

  if (isPaymentError || isBookingError) {
    return (
      <div className="min-h-screen bg-background flex  items-center justify-center ">
        <div className="bg-background rounded-xl max-w-sm w-full overflow-hidden flex flex-col gap-6 p-4">
          <div className="flex gap-2 justify-center items-center">
            <Logo variant="MINI" className="size-16" />
            <h1 className="text-2xl font-semibold">Payment </h1>
          </div>
          <div>
            <p className="text-center text-muted-foreground">
              {PaymentError?.message} or {BookingError?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }
  // @ts-ignore
  const moyasarInit = async () => {
    // @ts-ignore
    await Moyasar.init({
      element: containerRef.current,
      amount: payment.amount * 100,
      currency: payment.currency,
      description: payment.description,
      publishable_api_key: moyasarPublicKey,
      callback_url: `https://localhost:3000/payment/${payment._id}/status`,
      methods: ["creditcard", "stcpay"],
      language: language,
      credit_card: {
        save_card: isCardSave,
      },
      metadata: {
        payment_id: payment._id,
        booking_id: booking?._id,
      },
    });
  };
  // useEffect(() => {
  //   moyasarInit();
  // }, [isCardSave]);

  return (
    <>
      <Script
        src="https://cdn.moyasar.com/mpf/1.15.0/moyasar.js"
        onLoad={moyasarInit}
      />
      <link
        rel="stylesheet"
        href="https://cdn.moyasar.com/mpf/1.7.3/moyasar.css"
      />
      <div className="min-h-screen bg-background flex  items-center justify-center ">
        <div className="bg-background rounded-xl max-w-sm w-full overflow-hidden flex flex-col gap-6 p-4">
          <div className="flex gap-2 justify-center items-center">
            <Logo variant="MINI" className="size-16" />
            <h1 className="text-2xl font-semibold">Payment</h1>
          </div>
          <div className="border rounded-xl px-4 py-4">
            <div className="flex gap-4 items-start">
              <Avatar className="size-14">
                <AvatarImage src={doctor.profile_picture} />
                <AvatarFallback>{doctor.full_name.split(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="text-base font-semibold">{doctor.full_name}</p>

                <p className="text-xs flex flex-col gap-1">
                  {doctor.specialization}
                </p>
                <div className="text-sm py-2">
                  <p>
                    Session Fees :{" "}
                    {currencyFormatter(payment.amount, 0, payment.currency)}
                  </p>
                  <p>Description : {payment?.description}</p>
                  <p>Booking id : {booking?._id}</p>
                </div>
              </div>
            </div>
          </div>
          <div ref={containerRef} />
          <div className="flex items-center justify-center space-x-2">
            <Switch
              checked={isCardSave}
              onCheckedChange={setIsCardSave}
              id="save-card"
            />
            <Label htmlFor="save-card">Save card details</Label>
          </div>
        </div>
      </div>
    </>
  );
}
