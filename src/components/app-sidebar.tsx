"use client";

import * as React from "react";
import {
  BookOpen,
  Bookmark,
  Briefcase,
  Folder,
  Gauge,
  Monitor,
} from "lucide-react";
import {
  EmptyWallet,
  Profile2User,
  Setting2,
} from "iconsax-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logo from "./custom/logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  side?: "left" | "right";
}

// Define nav items separately
const NAV_ITEMS = [
  {
    key: "appointments",
    titleKey: "sidebar.appointments",
    url: "/dashboard/appointment",
    icon: Briefcase,
  },
  {
    key: "approval",
    titleKey: "sidebar.approval",
    url: "/dashboard/approval",
    icon: Gauge,
  },
  {
    key: "reports",
    titleKey: "sidebar.reports",
    url: "/dashboard/report",
    icon: Folder,
  },
  {
    key: "specialization",
    titleKey: "sidebar.specialization",
    url: "/dashboard/specialization",
    icon: BookOpen,
  },
  {
    key: "contractsSpecialists",
    titleKey: "sidebar.contractsSpecialists",
    url: "/dashboard/specialist",
    icon: Bookmark,
  },
  {
    key: "customers",
    titleKey: "sidebar.customers",
    url: "/dashboard/customer",
    icon: Profile2User,
  },
  {
    key: "infoBank",
    titleKey: "sidebar.infoBank",
    url: "/dashboard/question",
    icon: Setting2,
  },
  {
    key: "financial",
    titleKey: "sidebar.financial",
    url: "/dashboard/payments",
    icon: EmptyWallet,
  },
  {
    key: "permissions",
    titleKey: "sidebar.permissions",
    url: "/dashboard/permission",
    icon: Monitor,
  },

];

export function AppSidebar({ side, ...props }: AppSidebarProps) {
  const { user } = useUser();
  const { t } = useTranslation();
  console.log("user", user);

  if (!user) return null;

  const userPermissions = (user.unsafeMetadata?.permissions || []) as string[];

  console.log("userpermissions>>", userPermissions);


  const filteredNavMain = NAV_ITEMS.filter((item) =>
    userPermissions.length > 0 ? userPermissions.includes(item.key) : true
  ).map((item) => ({
    ...item,
    title: t(item.titleKey),
  }));

  return (
    <Sidebar variant="inset" side={side} {...props} className="bg-blue-100">
      <SidebarHeader className="bg-blue-100">
        <div className="flex items-center justify-center bg-transparent">
          <Link href="/">
            <Logo className="h-32 w-32 object-contain" />
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 pb-6">
          <Avatar className="size-24 border-2 border-neutral-400">
            <Link href="/">
              <AvatarImage
                src={user.imageUrl}
                alt={user.fullName + "_avatar"}
              />
            </Link>
            <AvatarFallback className="bg-primary-800 text-white font-semibold text-2xl uppercase">
              {user.fullName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 justify-center items-center">
            <h3 className="text-base font-semibold">{user.fullName}</h3>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-blue-100">
        <NavMain items={filteredNavMain} />
      </SidebarContent>
    </Sidebar>
  );
}
