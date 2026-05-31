import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import ClientFX from "@/components/ClientFX";
import { api, type GameNav } from "@/lib/api";

export const metadata: Metadata = {
  title: "LOGIA — 게임 데일리 브리핑",
  description:
    "게임 관련 최신 뉴스·사건·이벤트·스팀 할인을 매일 정리하고, 캐릭터 공략을 제공하는 게임 정보 사이트",
};

async function loadGames(): Promise<{ games: GameNav[]; ok: boolean }> {
  try {
    return { games: await api.games(), ok: true };
  } catch {
    return { games: [], ok: false };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { games, ok } = await loadGames();
  return (
    <html lang="ko">
      <body>
        {/* ambient light blobs (glass refraction) */}
        <div className="ambient" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>

        {/* utility topbar */}
        <div className="topbar">
          <div className="shell topbar-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/" className="brand">
                <span className="brand-mark" />
                <span className="brand-name">LOGIA</span>
              </Link>
              <span className="brand-sep" />
              <span className="brand-tag">게임 데일리 브리핑</span>
            </div>
            <nav className="util-nav">
              <Link className="util-link" href="/steam-sales">🏷️ 스팀 할인</Link>
              <Link className="util-link" href="/calendar">🗓️ 캘린더</Link>
              <Link className="util-link" href="/search">🔍 검색</Link>
              <Link className="util-link" href="/archive">📰 아카이브</Link>
            </nav>
          </div>
        </div>

        {/* sticky game tab nav */}
        <TopNav games={games} />

        <main className="shell" style={{ padding: "0 24px 80px" }}>
          {!ok && (
            <p className="empty" style={{ marginTop: 32 }}>
              백엔드(API)에 연결할 수 없습니다. backend 서버가 실행 중인지 확인하세요 —
              http://localhost:8000
            </p>
          )}
          {children}
        </main>

        <footer className="colophon">
          <span className="logo-sm">LOGIA</span>
          <span>게임 데일리 브리핑 · 매일 오전 8시 갱신 · AI 편집</span>
        </footer>

        <ClientFX />
      </body>
    </html>
  );
}
