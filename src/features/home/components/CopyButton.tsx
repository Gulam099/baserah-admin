import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, CopySuccess } from "iconsax-react";
import React, { useState } from "react";

export default function CopyButton(props: {
  text: string;
  className?: string;
  title?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const copyClickHandler = () => {
    navigator.clipboard.writeText(props.text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <Button
      variant={"secondary"}
      size={"sm"}
      className={cn("flex items-center gap-2", props.className)}
      onClick={(e) => {
        e.stopPropagation();
        copyClickHandler;
      }}
    >
      {isCopied ? <CopySuccess /> : <Copy />}
      {props.title ? props.title : "Copy"}
    </Button>
  );
}
