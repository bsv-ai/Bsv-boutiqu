"use client";

import Link from "next/link";
import { ChevronRight, MessageCircle, Facebook, Video, Phone, Rss } from "lucide-react";
import { useLang } from "@/context/LangContext";
import ProductGrid from "./ProductGrid";
import Footer from "./Footer";

export default function HomeClient({ products, siteSettings }) {
  const { lang, t } = useLang();
  const accent = siteSettings.accent_color;
  const waLink = `https://wa.me/${siteSettings.whatsapp_number}`;
  const telLink = `tel:+${siteSettings.phone_number.replace(/^0/, "225")}`;

  return (
    <div>
      <section
        style={{
          position: "relative",
          padding: "64px 18px 44px",
          backgroundImage: `linear-gradient(180deg, rgba(17,17,18,0.72), rgba(17,17,18,0.9)), url(${siteSettings.cover_image_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#FAFAF7",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: accent, fontWeight: 700, marginBottom: 14 }}>{t.heroKicker}</div>
          <h1 className="disp" style={{ fontSize: "clamp(28px, 6.5vw, 48px)", fontWeight: 600, lineHeight: 1.1, margin: "0 0 16px", maxWidth: 600 }}>
            {t.heroTitle}
          </h1>
          <p style={{ fontSize: 15.5, color: "#E5E5DE", maxWidth: 460, lineHeight: 1.6, marginBottom: 26 }}>{t.heroSub}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a href={siteSettings.channel_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: accent, color: "#111112", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>
              <Rss size={16} /> {t.joinChannel}
            </a>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "#25D366", color: "#fff", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>
              <MessageCircle size={16} /> {t.writeWhatsapp}
            </a>
            <a href={siteSettings.facebook_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "#1877F2", color: "#fff", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>
              <Facebook size={16} /> {t.followFacebook}
            </a>
            <a href={siteSettings.tiktok_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "#111112", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>
              <Video size={16} /> {t.followTiktok}
            </a>
            <a href={telLink} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", color: "#FAFAF7", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>
              <Phone size={16} /> {t.callUs}
            </a>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 18px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 className="disp" style={{ fontSize: 24, fontWeight: 600 }}>{t.ourProducts}</h2>
          <Link href="/catalogue" style={{ textDecoration: "none", background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 700, fontSize: 13.5, color: "#111112" }}>
            {t.seeProducts} <ChevronRight size={15} />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 6)} lang={lang} orderLabel={t.order} />
      </section>

      <Footer siteSettings={siteSettings} />
    </div>
  );
}
