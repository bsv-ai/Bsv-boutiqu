import { createClient } from "@/lib/supabase/server";
import ProductsManager from "@/components/admin/ProductsManager";

export default async function AdminProduitsPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("bsv_products").select("*").order("created_at", { ascending: false });
  return <ProductsManager initialProducts={products || []} />;
}
