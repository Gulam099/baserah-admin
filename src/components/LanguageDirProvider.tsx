"use client";

import { useEffect } from "react";

export default function LanguageDirProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    const dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    document.body.classList.remove("rtl", "ltr");
    document.body.classList.add(dir);
  }, []);




  return <>{children}</>;
}
