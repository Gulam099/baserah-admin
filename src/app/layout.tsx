import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import PageLoading from "@/components/page-loading";
import { TanstackProvider } from "@/components/providers/tanstack-provider";
import { I18nClientProvider } from "@/components/i18n-client-provider";
import LanguageDirProvider from "@/components/LanguageDirProvider";



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
            <I18nClientProvider>
              <TanstackProvider>
                <LanguageDirProvider>{children}</LanguageDirProvider>
              </TanstackProvider>
            </I18nClientProvider>
          </ClerkLoaded>
          <Toaster position={"top-right"} />
        </body>
      </html>
    </ClerkProvider>
  );
}
