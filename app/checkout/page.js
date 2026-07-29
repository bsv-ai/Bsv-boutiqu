import { createClient } from "@/lib/supabase/server";
import CheckoutClient from "@/components/boutique/CheckoutClient";

export default async function CheckoutPage() {
  const supabase = createClient();
  const { data: products } = await supabase.from("bsv_products").select("*");
  return <CheckoutClient products={products || []} />;
}
