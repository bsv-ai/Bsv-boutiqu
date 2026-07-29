import { Compass, Newspaper, Calendar, GraduationCap, Quote, Trophy } from "lucide-react";

const TYPE_ICON = {
  actualité: Newspaper,
  événement: Calendar,
  formation: GraduationCap,
  témoignage: Quote,
  challenge: Trophy,
};
const TYPE_LABEL = {
  actualité: "Actualités",
  événement: "Événements",
  formation: "Formations",
  témoignage: "Témoignages",
  challenge: "Challenge du mois",
};
const TYPE_ORDER = ["actualité", "événement", "formation", "témoignage", "challenge"];

export default function CommunauteClient({ doneCount, fullName, posts }) {
  const grouped = TYPE_ORDER.map((type) => ({ type, items: posts.filter((p) => p.type === type) })).filter((g) => g.items.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#111112", color: "#C89B3C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }} className="disp">
          {(fullName || "M").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{fullName || "Membre ADN"}</div>
          <div style={{ fontSize: 12.5, color: "#6E6E73" }}>{doneCount}/6 étapes du parcours complétées</div>
        </div>
      </div>

      <div>
        <SectionTitle icon={<Compass size={15} />} title="Vision & valeurs" />
        <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 16, fontSize: 13.5, lineHeight: 1.6, color: "#3A3A3D" }}>
          Bâtir Sa Valeur accompagne chaque membre à développer son potentiel entrepreneurial avant de vendre une offre — par la discipline, la formation continue et un système de duplication éprouvé au sein de l&apos;équipe ADN.
        </div>
      </div>

      {grouped.map(({ type, items }) => {
        const Icon = TYPE_ICON[type];
        return (
          <div key={type}>
            <SectionTitle icon={<Icon size={15} />} title={TYPE_LABEL[type]} />
            {type === "challenge" ? (
              items.map((it) => (
                <div key={it.id} style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{it.title}</div>
                  <div style={{ fontSize: 12.5, color: "#6E6E73" }}>{it.content}</div>
                </div>
              ))
            ) : (
              <ListCard items={items.map((it) => it.content)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, color: "#6E6E73", fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {icon} {title}
    </div>
  );
}

function ListCard({ items }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 14, overflow: "hidden" }}>
      {items.map((it, i) => (
        <div key={i} style={{ padding: "12px 16px", fontSize: 13, color: "#3A3A3D", borderTop: i > 0 ? "1px solid #F2F1EC" : "none", lineHeight: 1.4 }}>{it}</div>
      ))}
    </div>
  );
}
