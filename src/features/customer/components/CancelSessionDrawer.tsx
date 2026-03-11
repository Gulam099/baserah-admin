import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "iconsax-react";

export default function CancelSessionDrawer(props: { customer: any }) {
  const { customer } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"destructive"}
          className="rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash />
          <p className="text-xs">Cancel</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Share the file to the client
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row flex-wrap justify-between gap-4 py-6"></div>
        <div className="flex justify-end">
          <Button onClick={(e) => e.stopPropagation()}>
            Share the file to the client
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
