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
import { useUser } from "@clerk/nextjs";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Approval",
    //   url: "/dashboard/approval",
    //   icon: Gauge,
    // },
    // {
    //   title: "Reports",
    //   url: "/dashboard/report",
    //   icon: Folder,
    // },
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
    // {
    //   title: "Information Bank",
    //   url: "/dashboard/question",
    //   icon: Setting2,
    // },
    // {
    //   title: "Financial",
    //   url: "/dashboard/finance",
    //   icon: EmptyWallet,
    // },
    // {
    //   title: "Permissions",
    //   url: "/dashboard/permission",
    //   icon: Monitor,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const userId = user?.publicMetadata?.dbUserId as string;
  if (!user) {
    return null;
  }
  return (
    <Sidebar variant="inset" {...props} className="bg-blue-100">
      <SidebarHeader className="bg-blue-100">
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        <div className="flex flex-col justify-center items-center gap-3 py-6 ">
          <Avatar className="size-24 border-2 border-neutral-400">
            <Link href="/">
              <AvatarImage src={user.imageUrl} alt={user.fullName + "_avatar"} />
            </Link>
            <AvatarFallback className="bg-primary-800 text-white font-semibold text-2xl uppercase">
              {user.fullName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 justify-center items-center">
            <h3 className="text-base font-semibold">{user.fullName}</h3>
            {/* <p className="text-xs font-medium bg-primary-50/30 px-2 py-1 rounded-xl">
              {userId}
            </p> */}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-blue-100">
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
