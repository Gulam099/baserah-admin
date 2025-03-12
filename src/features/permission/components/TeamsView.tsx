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

export default function TeamsView(props: { teams: TeamItemType[] }) {
  const { teams } = props;

  return (
    <div className="p-4 space-y-4">
      {teams.map((team) => (
        <Drawer>
          <DrawerTrigger asChild>
            <div
              key={team._id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <p className="text-sm text-muted-foreground">
                Created At: {team.created_at ?? "N/A"}
              </p>
              <p className="text-sm">
                Members: {team.members?.join(", ") || "None"}
              </p>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              <div
                key={team._id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Created At: {team.created_at ?? "N/A"}
                </p>
                <p className="text-sm">
                  Members: {team.members?.join(", ") || "None"}
                </p>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
