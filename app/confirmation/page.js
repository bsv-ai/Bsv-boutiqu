import { createClient } from "@/lib/supabase/server";
import ConfirmationClient from "@/components/boutique/ConfirmationClient";
import { DEFAULT_SETTINGS } from "@/lib/i18n";

export default async function ConfirmationPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("bsv_site_settings").select("*").eq("id", 1).single();
  return <ConfirmationClient siteSettings={{ ...DEFAULT_SETTINGS, ...settings }} />;
}
