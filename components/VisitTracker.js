"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const FLAG = "bsv:visited";

export default function VisitTracker() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(FLAG)) return;
      window.sessionStorage.setItem(FLAG, "1");
    } catch {
      /* ignore */
    }
    const supabase = createClient();
    supabase.from("bsv_site_visits").insert({}).then(() => {});
  }, []);

  return null;
}
