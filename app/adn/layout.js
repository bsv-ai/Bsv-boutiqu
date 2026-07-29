import { DARK, BG, ACCENT_DEFAULT } from "@/lib/theme";
import ADNBottomNav from "@/components/adn/ADNBottomNav";

export default function ADNLayout({ children }) {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: DARK, paddingBottom: 74 }}>
      <div style={{ background: DARK, color: BG, padding: "22px 18px" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT_DEFAULT, fontWeight: 700, marginBottom: 6 }}>Bâtir Sa Valeur</div>
        <h1 className="disp" style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Espace ADN</h1>
        <div style={{ fontSize: 12.5, color: "#C9C9C3", marginTop: 4 }}>Achieve Dreams Now</div>
      </div>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "18px 16px" }}>{children}</main>

      <ADNBottomNav />
    </div>
  );
}
