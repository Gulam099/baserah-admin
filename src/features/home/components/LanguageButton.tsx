"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

export default function LanguageButton() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    setLang(storedLang);
    i18n.changeLanguage(storedLang);
    document.documentElement.dir = storedLang === "ar" ? "rtl" : "ltr";
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    // ⬜ Show white screen before reload
    const whiteOverlay = document.createElement("div");
    whiteOverlay.style.position = "fixed";
    whiteOverlay.style.top = "0";
    whiteOverlay.style.left = "0";
    whiteOverlay.style.width = "100vw";
    whiteOverlay.style.height = "100vh";
    whiteOverlay.style.backgroundColor = "white";
    whiteOverlay.style.zIndex = "9999";
    document.body.appendChild(whiteOverlay);

    // 🔁 Reload
    window.location.reload();
  };


  return (
    <Button onClick={toggleLanguage}>
      {lang === "en" ? "Arabic" : "English"}
    </Button>
  );
}
