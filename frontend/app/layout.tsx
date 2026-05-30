import "./globals.css";
import type { Metadata } from "next";
import Masthead from "@/components/Masthead";
import TopNav from "@/components/TopNav";
import { api, type GameNav, type IssueMeta } from "@/lib/api";

export const metadata: Metadata = {
  title: "LOGIA — 게임 데일리 브리핑",
  description: "게임 관련 최신 뉴스·사건·이벤트·커뮤니티 반응·스팀 할인을 매일 정리하는 정보 사이트",
};

const FALLBACK_META: IssueMeta = {
  title: "LOGIA", tagline: "게임 데일리 브리핑", issue: 0,
  dateLong: "", dateShort: "", published: "오전 08:00 발행", edition: "조간",
};

async function loadShell(): Promise<{ games: GameNav[]; meta: IssueMeta; ok: boolean }> {
  try {
    const [games, front] = await Promise.all([api.games(), api.front()]);
    return { games, meta: front.meta, ok: true };
  } catch {
    return { games: [], meta: FALLBACK_META, ok: false };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { games, meta, ok } = await loadShell();
  return (
    <html lang="ko">
      <body>
        <div className="paper">
          <Masthead meta={meta} />
          <TopNav games={games} />
          <main className="sheet">
            {!ok && (
              <p className="empty mono">
                백엔드(API)에 연결할 수 없습니다. backend 서버가 실행 중인지 확인하세요 — http://localhost:8000
              </p>
            )}
            {children}
          </main>
          <footer className="colophon mono">
            <span className="serif logo-sm">LOGIA</span>
            <span>제 {meta.issue}호 · {meta.dateLong || "—"} · {meta.published}</span>
            <span>AI 편집 · Claude 기반 큐레이션</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
