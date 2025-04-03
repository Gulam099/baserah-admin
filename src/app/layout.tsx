import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import PageLoading from "@/components/page-loading";
import { TanstackProvider } from "@/components/providers/tanstack-provider";

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baserah",
  description: "Appointment Booking App",
};
// Create a client

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-title" content="Baserah" />
        </head>
        <body className={` ${notoKufiArabic.variable} antialiased`}>
          <ClerkLoading>
            <PageLoading />
          </ClerkLoading>
          <ClerkLoaded>
            <TanstackProvider>{children}</TanstackProvider>
          </ClerkLoaded>
          <Toaster position={"top-right"} />
        </body>
      </html>
    </ClerkProvider>
  );
}
