"use client";

import { Button } from "@/components/ui/button";
import { TeamItemType } from "../types/permission.type";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslation } from "react-i18next";

export default function TeamsView({ teams }: { teams: TeamItemType[] }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className={`p-4 space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
      {teams.map((team) => {
        const createdAt = team.created_at
          ? new Date(team.created_at).toISOString().split("T")[0]
          : t("teams.notAvailable");

        const members = team.members?.length
          ? team.members.map((m) => m.name).join(", ")
          : t("teams.none");

        return (
          <Drawer key={team._id}>
            <DrawerTrigger asChild>
              <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition">
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("teams.createdAt")}: {createdAt}
                </p>
                <p className="text-sm">
                  {t("teams.members")}: {members}
                </p>
              </div>
            </DrawerTrigger>

            <DrawerContent>
              <div className="mx-auto w-full max-w-sm p-4 space-y-4">
                <DrawerHeader>
                  <DrawerTitle>{t("teams.drawerTitle")}</DrawerTitle>
                  <DrawerDescription>{t("teams.drawerDescription")}</DrawerDescription>
                </DrawerHeader>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold">{team.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("teams.createdAt")}: {createdAt}
                  </p>
                  <p className="text-sm">
                    {t("teams.members")}: {members}
                  </p>
                </div>

                <DrawerFooter>
                  <Button>{t("teams.submit")}</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">{t("teams.cancel")}</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        );
      })}
    </div>
  );
}
