import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import SearchInput from "./SearchInput";
import NotificationButton from "./NotificationButton";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 bg-blue-gradient sticky top-0 z-10 ">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <SearchInput />
      </div>
      <div>
        <NotificationButton/>
      </div>
    </header>
  );
}
