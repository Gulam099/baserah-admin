"use client";
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
import { PasswordInput } from "@/components/ui/password-input";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import LocationSelector from "@/components/ui/location-input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/custom/logo";

const formSchema = z.object({
  phone_number: z.string(),
  email: z.string().optional(),
  cardholder_name: z.string().min(1).min(3),
  credit_card_number: z.string(),
  expiration_date: z.coerce.date(),
  cvv: z.string().min(3).max(4),
  country: z.tuple([z.string(), z.string().optional()]),
  isSaveMethod: z.boolean().default(true).optional(),
});

export default function PaymentForm() {
  const [countryName, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expiration_date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-background rounded-xl max-w-2xl w-full overflow-hidden flex flex-col">
        <div className="flex gap-2 justify-center items-center">
          <Logo variant="MINI" className="size-16" />
          <h1 className="text-2xl font-semibold">Payment</h1>
        </div>
        <div className=" p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 py-4"
            >
              <FormField
                control={form.control}
                name="phone_number"
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
                    <FormDescription>Enter your phone number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardholder_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="credit_card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Card Number</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="expiration_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiration Date</FormLabel>
                        <DatetimePicker
                          {...field}
                          format={[["months", "years"], []]}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV / CVC</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="***" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country / Region</FormLabel>
                    <FormControl>
                      <LocationSelector
                        defaultCountry={"SA"}
                        onCountryChange={(country) => {
                          setCountryName(country?.name || "");
                          form.setValue(field.name, [
                            country?.name || "",
                            stateName || "",
                          ]);
                        }}
                        onStateChange={(state) => {
                          setStateName(state?.name || "");
                          form.setValue(field.name, [
                            form.getValues(field.name)[0] || "",
                            state?.name || "",
                          ]);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSaveMethod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0  py-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Save the payment method</FormLabel>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" size={'lg'} className="w-full">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
