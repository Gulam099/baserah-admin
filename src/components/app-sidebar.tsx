"use client";

import * as React from "react";
import {
  BookOpen,
  Bookmark,
  Bot,
  Briefcase,
  Command,
  Folder,
  Frame,
  Gauge,
  LifeBuoy,
  Map,
  Monitor,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logo from "./custom/logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EmptyWallet, People, Profile2User, Setting2 } from "iconsax-react";
import { useAuth } from "@/providers/AuthProvider";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Approval",
      url: "/dashboard/approval",
      icon: Gauge,
    },
    {
      title: "Reports",
      url: "/dashboard/report",
      icon: Folder,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointment",
      icon: Briefcase,
    },
    // {
    //   title: "Tickets",
    //   url: "/dashboard/ticket",
    //   icon: People,
    // },
    {
      title: "Contracts and Specialists",
      url: "/dashboard/specialist",
      icon: Bookmark,
    },
    {
      title: "Customers",
      url: "/dashboard/customer",
      icon: Profile2User,
    },
    {
      title: "Information Bank",
      url: "/dashboard/question",
      icon: Setting2,
    },
    // {
    //   title: "Financial",
    //   url: "/dashboard/finance",
    //   icon: EmptyWallet,
    // },
    {
      title: "Permissions",
      url: "/dashboard/permission",
      icon: Monitor,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex flex-col justify-center items-center gap-3 py-12">
          <Avatar className="size-24 border-2 border-neutral-400">
            <AvatarImage src={"https://avatar.iran.liara.run/public/34"} alt={user.name + "_avatar"} />
            <AvatarFallback className="bg-primary-800 text-white font-semibold text-2xl uppercase">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 justify-center items-center">
            <h3 className="text-base font-semibold">{user.name}</h3>
            <p className="text-sm">{user._id}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
