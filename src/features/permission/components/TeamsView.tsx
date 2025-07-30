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


export default function TeamsView(props: { teams: TeamItemType[] }) {
  const { teams } = props;
  const { t } = useTranslation();


  return (
    <div className="p-4 space-y-4">
      {teams.map((team) => (
        <Drawer key={team._id}>
          <DrawerTrigger asChild>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <p className="text-sm text-muted-foreground">
                {t("teams.createdAt")}: {team.created_at ? new Date(team.created_at).toISOString().split('T')[0] : "N/A"}
              </p>
              <p className="text-sm">
                {t("teams.members")}: {team.members?.map((m) => m.name).join(", ") || t("teams.none")}
              </p>

            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{t("teams.drawerTitle")}</DrawerTitle>
                <DrawerDescription>{t("teams.drawerDescription")}</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("teams.createdAt")}: {team.created_at ? new Date(team.created_at).toISOString().split('T')[0] : "N/A"}
                </p>
                <p className="text-sm">
                  {t("teams.members")}: {team.members?.map((m) => m.name).join(", ") || t("teams.none")}
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
      ))}
    </div>
  );
}
