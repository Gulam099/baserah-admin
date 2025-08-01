"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/home/components/Header";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    setIsRTL(lang === "ar");
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className={`flex w-full gap-2}`}>
        <AppSidebar side={isRTL ? "right" : "left"} />
        <div className="flex flex-col w-full gap-2">
          <Header />
          <SidebarInset>
            <main className="p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}