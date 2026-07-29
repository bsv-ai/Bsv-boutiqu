import { createClient } from "@/lib/supabase/server";
import CatalogClient from "@/components/boutique/CatalogClient";

export default async function CataloguePage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("bsv_products").select("*").eq("active", true).order("created_at", { ascending: false });
  return <CatalogClient products={products || []} />;
}
