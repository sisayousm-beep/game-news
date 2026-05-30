import { api } from "@/lib/api";
import FrontView from "@/components/FrontView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const D = await api.front();
  if (D.meta.issue === 0 || D.games.length === 0) {
    return (
      <div className="front">
        <div className="lede">
          <span className="lede-label mono">편집국 — 오늘의 브리핑</span>
          <p className="lede-text serif">{D.lede}</p>
        </div>
        <p className="empty mono">
          아직 발행된 브리핑이 없습니다. Claude Code에서 “오늘 뉴스 갱신해줘”로 첫 편집판을 생성하세요.
        </p>
      </div>
    );
  }
  return <FrontView D={D} />;
}
