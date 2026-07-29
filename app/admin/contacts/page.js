import { createClient } from "@/lib/supabase/server";
import ContactsPanel from "@/components/admin/ContactsPanel";
import { DEFAULT_SETTINGS } from "@/lib/i18n";

export default async function AdminContactsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return <ContactsPanel initialSettings={{ ...DEFAULT_SETTINGS, ...settings }} />;
}
