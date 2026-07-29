import { createClient } from "@/lib/supabase/server";
import CartClient from "@/components/boutique/CartClient";

export default async function PanierPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("products").select("*");
  return <CartClient products={products || []} />;
}
