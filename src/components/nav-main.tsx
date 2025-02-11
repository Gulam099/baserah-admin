"use client";

import { type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Icon } from "iconsax-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon | Icon;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {items.map((item, index) => {
          const isActive: boolean = pathname.includes(item.url);
          return (
            <Link
              key={item.url + index}
              href={item.url}
              className={cn(
                "flex items-center justify-start gap-4 rounded-lg flex-row p-4",
                isActive
                  ? " bg-primary-100 text-primary-600"
                  : " bg-white text-neutral-500"
              )}
            >
              <item.icon size={24} />
              <p className="text-xs font-semibold">{item.title}</p>
            </Link>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
