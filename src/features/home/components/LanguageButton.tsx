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
  };

  return (
    <Button onClick={toggleLanguage}>
      {lang === "en" ? "Arabic" : "English"}
    </Button>
  );
}
