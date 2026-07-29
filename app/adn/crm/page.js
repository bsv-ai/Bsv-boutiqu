import { createClient, getProfile } from "@/lib/supabase/server";
import CRMClient from "@/components/adn/CRMClient";

export default async function CRMPage() {
  const supabase = createClient();
  const { user } = await getProfile(supabase);
  const { data: prospects } = await supabase
    .from("bsv_prospects")
    .select("*")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false });

  return <CRMClient memberId={user.id} initialProspects={prospects || []} />;
}
