import { createClient, getProfile } from "@/lib/supabase/server";
import ParcoursClient from "@/components/adn/ParcoursClient";

export default async function ParcoursPage() {
  const supabase = createClient();
  const { user } = await getProfile(supabase);
  const { data: rows } = await supabase.from("member_progress").select("*").eq("member_id", user.id);

  const initialProgress = {};
  (rows || []).forEach((r) => {
    if (r.completed) initialProgress[r.step_id] = true;
  });

  return <ParcoursClient memberId={user.id} initialProgress={initialProgress} />;
}
