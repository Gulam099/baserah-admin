import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: "MINI";
}

export default function Logo({ className, variant, height, width }: LogoProps) {
  const LogoImage =
    variant === "MINI" ? "/icon/icon.svg" : "/icon/logo-web.svg";
  return (
    <div className={cn("relative",className)}>
      <Image src={LogoImage} alt="Logo" fill style={{ objectFit: "contain" }} />
    </div>
  );
}
