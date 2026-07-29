import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient, getProfile } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `Tu es l'Assistant IA personnel d'un membre de la communauté "Bâtir Sa Valeur", au sein de l'équipe ADN (Achieve Dreams Now), qui distribue les produits Longrich via le marketing relationnel.
Tu aides le membre à : trouver des prospects, préparer des messages d'approche, répondre aux objections courantes, organiser ses journées, suivre ses objectifs, et savoir quelle action faire ensuite dans son parcours (Découverte de la vision → Présentation Longrich → Inscription → Intégration → Développement → Construction d'équipe).
Réponds en français, de façon concrète, chaleureuse et actionnable, avec des étapes claires quand c'est utile. Reste concis (pas de pavés interminables). Ne jamais inventer de faits sur Longrich que tu ne connais pas avec certitude — reste général sur le fonctionnement du marketing relationnel dans ce cas.`;

export async function POST(request) {
  const supabase = createClient();
  const { user } = await getProfile(supabase);
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }

  const { data: history } = await supabase
    .from("bsv_assistant_conversations")
    .select("role, content")
    .eq("member_id", user.id)
    .order("created_at", { ascending: true })
    .limit(30);

  await supabase.from("bsv_assistant_conversations").insert({ member_id: user.id, role: "user", content });

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let reply;
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [...(history || []), { role: "user", content }],
    });
    reply = response.content.map((b) => (b.type === "text" ? b.text : "")).join("\n").trim() || "Désolé, je n'ai pas pu répondre. Réessaie.";
  } catch (err) {
    reply = "Une erreur est survenue. Réessaie dans un instant.";
  }

  await supabase.from("bsv_assistant_conversations").insert({ member_id: user.id, role: "assistant", content: reply });

  return NextResponse.json({ reply });
}
