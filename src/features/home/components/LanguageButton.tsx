"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function LanguageButton() {
  const [lang, setLang] = useState("English");
  return (
    <Button
      onClick={() =>
        lang === "English" ? setLang("Arabic") : setLang("English")
      }
    >
      {lang}
    </Button>
  );
}
