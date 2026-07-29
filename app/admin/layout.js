import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h1 className="disp" style={{ fontSize: 22, fontWeight: 600 }}>Tableau de bord</h1>
      </div>
      <AdminNav />
      {children}
    </div>
  );
}
