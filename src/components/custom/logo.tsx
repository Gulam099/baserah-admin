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
  // const LogoImage =
  //   variant === "MINI" ? "/icon/final_logo.png" : "/icon/final_logo.png";
  const LogoImage = "/icon/final_logo.png";

  return (
    <div
      className={cn("relative", className)}
    // style={{ height: 80, width: 80 }} // You can adjust these dimensions
    >
      <Image src={LogoImage} alt="Logo" fill style={{ objectFit: "contain" }} />
    </div>

  );
}
