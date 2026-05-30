import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import GameView from "@/components/GameView";

export const dynamic = "force-dynamic";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const g = await api.game(slug);
    return <GameView g={g} />;
  } catch {
    notFound();
  }
}
