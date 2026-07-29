import { createClient, getProfile } from "@/lib/supabase/server";
import CommunauteClient from "@/components/adn/CommunauteClient";

export default async function ADNPage() {
  const supabase = createClient();
  const { user, profile } = await getProfile(supabase);

  const [{ data: progress }, { data: posts }] = await Promise.all([
    supabase.from("member_progress").select("*").eq("member_id", user.id).eq("completed", true),
    supabase.from("community_posts").select("*").order("created_at", { ascending: false }),
  ]);

  return <CommunauteClient doneCount={progress?.length || 0} fullName={profile?.full_name} posts={posts || []} />;
}
