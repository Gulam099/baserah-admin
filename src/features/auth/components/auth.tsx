"use client";
import React, { useEffect } from "react";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";
import { appName } from "../../../../const";
import Logo from "@/components/custom/logo";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/providers/AuthProvider";
import { sendOtp } from "../utils/otp.util";

// Schema for phone number step
const phoneFormSchema = z.object({
  phone: z.string().min(8, "Please enter a valid phone number"),
});

// Schema for OTP verification step
const otpFormSchema = z.object({
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP cannot exceed 6 digits"),
});

export default function AuthPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { login } = useAuth();

  // Form for phone number step
  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Form for OTP verification step
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Handle phone number submission
  async function onPhoneSubmit(values: z.infer<typeof phoneFormSchema>) {
    setIsLoading(true);
    try {
      setPhoneNumber(values.phone);
      await sendOtp(values.phone);
      toast.success(`OTP sent to ${values.phone}`);
      setStep("otp");
    } catch (error) {
      console.error("Failed to send OTP", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle OTP verification
  async function onOtpSubmit(values: z.infer<typeof otpFormSchema>) {
    setIsLoading(true);
    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await login({
        _id: "875475743798455",
        name: "Zahid Ansari",
        mobile_number: phoneNumber,
        role: "super admin",
        email: "zahjid@hhi.oo",
      });

      toast.success("OTP verified successfully");
      router.push("/dashboard/approval");
    } catch (error) {
      console.error("OTP verification error", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    setIsLoading(true);
    try {
      await sendOtp(phoneNumber);
      toast.success("OTP resent successfully");
      // Lock the button for 60s
      setSecondsLeft(60);
    } catch (error) {
      // 'sendOtp' already shows a toast error
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Go back to phone number step
  function handleBack() {
    setStep("phone");
    otpForm.reset();
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex items-center justify-center rounded-md">
            <Logo variant="MINI" className="size-32 relative" />
          </div>
          <span className="sr-only">{appName}</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to {appName}</h1>
        <div className="text-center text-sm">
          Admin Panel for managing your {appName} account.
        </div>
      </div>

      {step === "phone" ? (
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="Enter your phone number"
                        {...field}
                        defaultCountry="SA"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Request OTP"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  OTP sent to {phoneNumber}
                </p>
              </div>
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl className="w-full ">
                      {/* <Input
                          placeholder="Enter OTP"
                          {...field}
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        /> */}
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Enter the verification code sent to your phone
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              <Button
                variant="outline"
                className="text-xs"
                onClick={handleResend}
                disabled={isLoading || secondsLeft > 0}
              >
                Didn't receive the code?{" "}
                {secondsLeft > 0
                  ? `Resend OTP in ${secondsLeft}s`
                  : "Resend OTP"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
