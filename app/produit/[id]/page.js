import { createClient } from "@/lib/supabase/server";
import ProductClient from "@/components/boutique/ProductClient";

export default async function ProductPage({ params }) {
  const supabase = createClient();
  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single();
  return <ProductClient product={product} />;
}
