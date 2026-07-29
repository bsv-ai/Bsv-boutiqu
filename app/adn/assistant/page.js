import { createClient, getProfile } from "@/lib/supabase/server";
import AssistantClient from "@/components/adn/AssistantClient";

export default async function AssistantPage() {
  const supabase = createClient();
  const { user } = await getProfile(supabase);
  const { data: history } = await supabase
    .from("bsv_assistant_conversations")
    .select("role, content")
    .eq("member_id", user.id)
    .order("created_at", { ascending: true });

  return <AssistantClient initialMessages={history || []} />;
}
