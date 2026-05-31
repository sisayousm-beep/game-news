import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import CharacterGuide from "@/components/CharacterGuide";

export const dynamic = "force-dynamic";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string; char: string }>;
}) {
  const { slug, char } = await params;
  try {
    const c = await api.character(slug, char);
    return <CharacterGuide c={c} />;
  } catch {
    notFound();
  }
}
