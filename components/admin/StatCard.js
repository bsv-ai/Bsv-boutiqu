export default function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ECECE6", borderRadius: 12, padding: "14px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: accent, marginBottom: 8 }}>{icon}</div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "#8A8A8E" }}>{label}</div>
    </div>
  );
}
