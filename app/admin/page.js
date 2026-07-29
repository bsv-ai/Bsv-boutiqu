import { Users, TrendingUp, Package, ShoppingCart, UserCheck, Compass, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatFCFA, todayKey } from "@/lib/format";
import StatCard from "@/components/admin/StatCard";

export default async function AdminOverviewPage() {
  const supabase = createClient();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    { count: totalVisits },
    { count: activeProducts },
    { count: totalOrders },
    { data: latestOrders },
    { data: recentVisits },
    { count: totalMembers },
    { data: completedSteps },
    { count: newProspects },
  ] = await Promise.all([
    supabase.from("bsv_site_visits").select("*", { count: "exact", head: true }),
    supabase.from("bsv_products").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("bsv_orders").select("*", { count: "exact", head: true }),
    supabase.from("bsv_orders").select("*").order("created_at", { ascending: false }).limit(6),
    supabase.from("bsv_site_visits").select("visited_at").gte("visited_at", sevenDaysAgo.toISOString()),
    supabase.from("bsv_profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
    supabase.from("bsv_member_progress").select("member_id").eq("completed", true),
    supabase.from("bsv_prospects").select("*", { count: "exact", head: true }).eq("status", "Nouveau"),
  ]);

  const days = {};
  (recentVisits || []).forEach((v) => {
    const key = v.visited_at.slice(0, 10);
    days[key] = (days[key] || 0) + 1;
  });
  const todayCount = days[todayKey()] || 0;
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString("fr-FR", { weekday: "short" }), count: days[key] || 0 };
  });
  const maxDay = Math.max(1, ...last7.map((d) => d.count));

  const perMemberCount = {};
  (completedSteps || []).forEach((r) => {
    perMemberCount[r.member_id] = (perMemberCount[r.member_id] || 0) + 1;
  });
  const memberIds = Object.keys(perMemberCount);
  const avgProgress = totalMembers
    ? Math.round(
        (memberIds.reduce((sum, id) => sum + Math.min(6, perMemberCount[id]), 0) / (totalMembers * 6)) * 100
      )
    : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
        <StatCard icon={<Users size={16} />} label="Visites totales" value={totalVisits || 0} accent="#C89B3C" />
        <StatCard icon={<TrendingUp size={16} />} label="Visites aujourd'hui" value={todayCount} accent="#C89B3C" />
        <StatCard icon={<Package size={16} />} label="Produits actifs" value={activeProducts || 0} accent="#C89B3C" />
        <StatCard icon={<ShoppingCart size={16} />} label="Commandes reçues" value={totalOrders || 0} accent="#C89B3C" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
        <StatCard icon={<UserCheck size={16} />} label="Membres ADN actifs" value={totalMembers || 0} accent="#2F7A4D" />
        <StatCard icon={<Compass size={16} />} label="Progression moyenne" value={`${avgProgress}%`} accent="#2F7A4D" />
        <StatCard icon={<UserPlus size={16} />} label="Nouveaux prospects" value={newProspects || 0} accent="#2F7A4D" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6E6E73", marginBottom: 14 }}>Visites — 7 derniers jours</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
          {last7.map((d) => (
            <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", maxWidth: 26, height: `${Math.max(4, (d.count / maxDay) * 64)}px`, background: "#C89B3C", borderRadius: 4 }} />
              <div style={{ fontSize: 10.5, color: "#8A8A8E", textTransform: "capitalize" }}>{d.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#B0B0AA", marginTop: 12, lineHeight: 1.4 }}>Ce compteur enregistre chaque ouverture du site, pas des visiteurs uniques identifiés individuellement.</div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#6E6E73", marginBottom: 12 }}>Dernières commandes</div>
        {(!latestOrders || latestOrders.length === 0) ? (
          <p style={{ fontSize: 13, color: "#8A8A8E" }}>Aucune commande pour le moment.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {latestOrders.map((o) => (
              <div key={o.order_number} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F2F1EC", paddingBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{o.order_number}</div>
                  <div style={{ fontSize: 12, color: "#8A8A8E" }}>{o.customer_name} · {new Date(o.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatFCFA(o.total)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
