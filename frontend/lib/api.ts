export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// ---- types (백엔드 schemas.py 와 일치) ----
export interface Sentiment { pos: number; neu: number; neg: number; }
export interface Article { title: string; source: string; url: string; tag: string; time: string; imp: number; }
export interface EventItem { date: string; title: string; type: string; game?: string | null; }
export interface Incident { title: string; severity: string; }
export interface Discussion { topic: string; sentiment: string; summary: string; source: string; }
export interface GameBrief {
  slug: string; name: string; nameEn: string; pub: string; tier: string;
  sentiment: Sentiment; summary: string;
  news: Article[]; events: EventItem[]; incidents: Incident[]; discussions: Discussion[];
}
export interface Alert { game: string; title: string; severity: string; heat: number; }
export interface SteamRow { name: string; price: string; was: string; disc: number; low: boolean; ends: string; }
export interface Lead { game: string; kicker: string; headline: string; deck: string; body: string[]; source: string; time: string; }
export interface IssueMeta { title: string; tagline: string; issue: number; dateLong: string; dateShort: string; published: string; edition: string; }
export interface FrontPage {
  meta: IssueMeta; lede: string; lead: Lead;
  games: GameBrief[]; alerts: Alert[]; steam: SteamRow[];
}
export interface GameNav { slug: string; name: string; tier: string; }

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

export const api = {
  front: (date?: string) => getJSON<FrontPage>(`/api/front${date ? `?date=${date}` : ""}`),
  game: (slug: string, date?: string) => getJSON<GameBrief>(`/api/game/${slug}${date ? `?date=${date}` : ""}`),
  steam: () => getJSON<SteamRow[]>(`/api/steam`),
  calendar: () => getJSON<EventItem[]>(`/api/calendar`),
  games: () => getJSON<GameNav[]>(`/api/games`),
  issues: () => getJSON<string[]>(`/api/issues`),
  search: (q: string) => getJSON<Article[]>(`/api/search?q=${encodeURIComponent(q)}`),
};
