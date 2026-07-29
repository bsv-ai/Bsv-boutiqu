import { createClient } from "@/lib/supabase/server";
import HomeClient from "@/components/boutique/HomeClient";
import { DEFAULT_SETTINGS } from "@/lib/i18n";

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: products }, { data: settings }] = await Promise.all([
    supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false }),
    supabase.from("site_settings").select("*").eq("id", 1).single(),
  ]);

  return <HomeClient products={products || []} siteSettings={{ ...DEFAULT_SETTINGS, ...settings }} />;
}
