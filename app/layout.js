import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LangProvider } from "@/context/LangContext";
import Nav from "@/components/Nav";
import VisitTracker from "@/components/VisitTracker";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Bâtir Sa Valeur",
  description: "Boutique et Espace ADN — Bâtir Sa Valeur",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#111112",
};

async function getSiteSettings() {
  const supabase = createClient();
  const { data } = await supabase.from("bsv_site_settings").select("*").eq("id", 1).single();
  return data;
}

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings();

  return (
    <html lang="fr">
      <body>
        <LangProvider>
          <CartProvider>
            <ServiceWorkerRegister />
            <VisitTracker />
            <Nav siteTitle={settings?.site_title} accent={settings?.accent_color} />
            {children}
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
