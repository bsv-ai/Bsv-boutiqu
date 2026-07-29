import { createClient } from "@/lib/supabase/server";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { DEFAULT_SETTINGS } from "@/lib/i18n";

export default async function AdminReglagesPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("bsv_site_settings").select("*").eq("id", 1).single();
  return <SettingsPanel initialSettings={{ ...DEFAULT_SETTINGS, ...settings }} />;
}
