"use client";

import Link from "next/link";
import { MessageCircle, Phone, Rss, Facebook, Video, Lock } from "lucide-react";
import { useLang } from "@/context/LangContext";

export default function Footer({ siteSettings }) {
  const { t } = useLang();
  const waLink = `https://wa.me/${siteSettings.whatsapp_number}`;
  return (
    <footer style={{ borderTop: "1px solid #ECECE6", padding: "28px 18px 40px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 12, fontSize: 12.5, color: "#6E6E73" }}>
        <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: "#6E6E73", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <MessageCircle size={13} /> {siteSettings.whatsapp_number}
        </a>
        <a href={`tel:${siteSettings.phone_number}`} style={{ color: "#6E6E73", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Phone size={13} /> {siteSettings.phone_number}
        </a>
        <a href={siteSettings.channel_link} target="_blank" rel="noopener noreferrer" style={{ color: "#6E6E73", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Rss size={13} /> {t.joinChannel}
        </a>
        <a href={siteSettings.facebook_link} target="_blank" rel="noopener noreferrer" style={{ color: "#6E6E73", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Facebook size={13} /> Facebook
        </a>
        <a href={siteSettings.tiktok_link} target="_blank" rel="noopener noreferrer" style={{ color: "#6E6E73", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <Video size={13} /> TikTok
        </a>
      </div>
      <div style={{ fontSize: 12.5, color: "#8A8A8E", marginBottom: 8 }}>© {new Date().getFullYear()} {siteSettings.site_title}</div>
      <Link href="/admin" style={{ background: "none", border: "none", color: "#B7B7B0", fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
        <Lock size={11} /> {t.admin}
      </Link>
    </footer>
  );
}
