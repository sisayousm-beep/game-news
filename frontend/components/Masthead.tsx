import Link from "next/link";
import type { IssueMeta } from "@/lib/api";

export default function Masthead({ meta }: { meta: IssueMeta }) {
  return (
    <header className="masthead">
      <div className="util mono">
        <div className="util-l">
          <span>{meta.dateLong || "—"}</span>
          <span className="util-sep">·</span>
          <span>제 {meta.issue}호</span>
          <span className="util-sep">·</span>
          <span>{meta.edition}</span>
        </div>
        <div className="util-r">
          <span className="pub-dot" />
          <span>{meta.published}</span>
          <span className="util-sep">·</span>
          <Link className="util-btn" href="/steam-sales">스팀 할인</Link>
          <Link className="util-btn" href="/calendar">캘린더</Link>
          <Link className="util-btn" href="/search">검색</Link>
          <Link className="util-btn" href="/archive">아카이브</Link>
        </div>
      </div>
      <div className="title-row">
        <div className="title-side mono left">EST.<br />2026</div>
        <Link href="/" className="logo serif">{meta.title}</Link>
        <div className="title-side mono right">게임 정보<br />브리핑</div>
      </div>
      <div className="tagline mono">{meta.tagline} — 게임 전문 데일리 브리핑</div>
    </header>
  );
}
