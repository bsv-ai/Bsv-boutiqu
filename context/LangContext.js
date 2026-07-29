"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DICT } from "@/lib/i18n";

const LangContext = createContext(null);
const STORAGE_KEY = "bsv:lang";

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("fr");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "fr" || saved === "en") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function setLang(next) {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
