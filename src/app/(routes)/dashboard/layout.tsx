import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/home/components/Header";
import { dir } from "i18next";
import { getLocale } from "@/lib/get-locale"; // We'll define this helper

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale(); // returns 'en' or 'ar'
  const direction = dir(locale); // returns 'ltr' or 'rtl'

  return (
    <SidebarProvider>
      <div className={`flex w-full gap-2 ${direction === "rtl" ? "flex-row-reverse" : "flex-row"}`}>
        <AppSidebar />
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
