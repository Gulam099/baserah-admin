"use client";

import Logo from "@/components/custom/logo";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const moyasarPublicKey = process.env.NEXT_PUBLIC_MOYASAR_TEST_PUBLIC_KEY;

export default function PaymentPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isCardSave, setIsCardSave] = useState(true);

  const moyasarInit = async () => {
    // @ts-ignore
    await Moyasar.init({
      element: containerRef.current,
      amount: 10000,
      currency: "SAR",
      description: "Test API",
      publishable_api_key: moyasarPublicKey,
      callback_url: "http://www.baserah.sa/payment/status",
      methods: ["creditcard", "stcpay"],
      language: "EN",
      credit_card: {
        save_card: isCardSave,
      },
    });
  };
  useEffect(() => {
    moyasarInit();
  }, [isCardSave]);

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
