"use client";

import { useState } from "react";
import Link from "next/link";
import type { FrontPage, Article, GameBrief } from "@/lib/api";
import { SentimentBar, SteamLine } from "@/components/atoms";
import ArticleModal from "@/components/ArticleModal";

const DOT: Record<string, string> = {
  bluearchive: "#5DA2FF", nikke: "#FB6F8C", arknights: "#F5A524", starrail: "#7C5CFF",
  wuwa: "#18B7A6", duet: "#2F6BFF", silverpelis: "#9A6CFF", brown2: "#A9B4C4",
};
const C = 2 * Math.PI * 50; // donut circumference

function leadAsArticle(D: FrontPage): Article {
  const L = D.lead;
  return {
    title: L.headline, source: L.source || "공식", url: "", tag: L.kicker || "리드",
    time: L.time, imp: 95, summary: [L.deck, ...L.body].filter(Boolean).join("\n\n"), image: L.image,
  };
}

// "MM.DD" + 연도 → Date
function parseMd(md: string, year: number): Date | null {
  const m = md.match(/(\d{1,2})\D+(\d{1,2})/);
  if (!m) return null;
  return new Date(year, Number(m[1]) - 1, Number(m[2]));
}
const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function FrontView({ D }: { D: FrontPage }) {
  const [open, setOpen] = useState<Article | null>(null);
  const hasIssue = D.meta.issue > 0 && D.games.length > 0;

  // 커뮤니티 종합(게임 평균)
  const agg = (() => {
    if (!D.games.length) return { pos: 0, neu: 0, neg: 0 };
    const sum = D.games.reduce(
      (a, g) => ({ pos: a.pos + g.sentiment.pos, neu: a.neu + g.sentiment.neu, neg: a.neg + g.sentiment.neg }),
      { pos: 0, neu: 0, neg: 0 },
    );
    const n = D.games.length;
    return { pos: Math.round(sum.pos / n), neu: Math.round(sum.neu / n), neg: Math.round(sum.neg / n) };
  })();
  const posL = (agg.pos / 100) * C, neuL = (agg.neu / 100) * C, negL = (agg.neg / 100) * C;

  // 대표 여론 한마디(긍정/부정)
  const allDisc = D.games.flatMap((g) => g.discussions.map((d) => ({ ...d, game: g.name })));
  const posNote = allDisc.find((d) => d.sentiment === "긍정");
  const negNote = allDisc.find((d) => d.sentiment === "부정");

  // 이번 주 일정
  const year = Number((D.meta.dateShort || "").slice(0, 4)) || new Date().getFullYear();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const week = D.games
    .flatMap((g) => g.events.map((e) => ({ ...e, game: g.name, d: parseMd(e.date, year) })))
    .filter((e) => e.d && e.d >= today)
    .sort((a, b) => a.d!.getTime() - b.d!.getTime())
    .slice(0, 5);

  return (
    <>
      {/* ---- masthead ---- */}
      <header className="masthead">
        <div className="masthead-meta reveal">
          <span className="eyebrow">TODAY&apos;S BRIEFING</span>
          <span className="dim">·</span>
          <span className="date">{D.meta.dateLong || "발행 대기"}{D.meta.issue > 0 ? ` · 제 ${D.meta.issue}호` : ""}</span>
          <span className="badge badge-blue" style={{ marginLeft: "auto" }}>
            <span className="badge-dot" style={{ background: "var(--primary)" }} />
            오전 8:00 갱신 · 지금 <span className="tnum" data-clock style={{ marginLeft: 2 }}>08:00</span>
          </span>
        </div>
        <h1 className="display reveal">{D.lede}</h1>
      </header>

      {!hasIssue ? (
        <p className="empty" style={{ marginTop: 28 }}>
          아직 발행된 브리핑이 없습니다. Claude Code에서 “오늘 뉴스 갱신해줘”로 첫 편집판을 생성하세요.
        </p>
      ) : (
        <div className="briefing" style={{ marginTop: 28 }}>
          {/* ============ MAIN COLUMN ============ */}
          <div>
            {/* lead story */}
            <article className="card glass lift reveal lead-card" onClick={() => setOpen(leadAsArticle(D))}>
              <div className={"kv lead-kv" + (D.lead.image ? " has-img" : "")} data-label={`KEY VISUAL · 1면 · ${D.lead.game}`}>
                {D.lead.image && <img src={D.lead.image} alt="" referrerPolicy="no-referrer" />}
              </div>
              <div className="lead-body-wrap">
                <div className="lead-tags">
                  <span className="badge badge-blue"><span className="badge-dot" style={{ background: "var(--primary)" }} />LEAD · {D.lead.game}</span>
                  {D.lead.kicker && <span className="badge badge-warn">{D.lead.kicker}</span>}
                  <span className="when">{D.lead.source} · {D.lead.time}</span>
                </div>
                <h2>{D.lead.headline}</h2>
                <p className="lede-body" style={{ margin: 0 }}>{D.lead.deck}</p>
                <span className="lead-cta">요약 모달 열기 →</span>
              </div>
            </article>

            {/* 주요 사건 감지 */}
            {D.alerts.length > 0 && (
              <section className="card glass reveal alert-sec" data-stagger>
                <div className="section-head">
                  <h2>⚡ 주요 사건 감지</h2>
                  <span className="more">AI 분석 · 크로스 게임</span>
                </div>
                {D.alerts.map((a, i) => (
                  <div className="alert-row reveal" key={i}>
                    <span className={"badge " + (a.severity === "주의" ? "badge-warn" : "badge-watch")} style={{ flex: "0 0 auto", marginTop: 2 }}>
                      {a.severity}
                    </span>
                    <div className="a-main">
                      <div className="a-title">{a.title}</div>
                      <div className="a-sub">{a.game}</div>
                      <div className="heat-meter"><span data-fill={a.heat} /></div>
                    </div>
                    <div className="a-heat">
                      <div className="lab">화제도</div>
                      <div className="val tnum">{a.heat}</div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* 게임별 브리핑 */}
            <div className="section-head reveal">
              <h2>게임별 브리핑</h2>
              <span className="more">상위 뉴스 · 여론 · 다음 일정</span>
            </div>
            <div className="brief-grid" data-stagger>
              {D.games.map((g) => (
                <BriefCard key={g.slug} g={g} onOpen={setOpen} />
              ))}
            </div>
          </div>

          {/* ============ SIDEBAR ============ */}
          <aside className="sticky-side">
            {/* community donut */}
            <section className="card glass reveal" style={{ padding: "22px 22px 24px" }}>
              <div className="section-head" style={{ marginBottom: 8 }}><h2 style={{ fontSize: "1.12rem" }}>커뮤니티 반응</h2></div>
              <p style={{ fontSize: ".78rem", color: "var(--muted)", margin: "0 0 14px" }}>오늘 수집된 게시글 종합</p>
              <div className="donut-wrap">
                <svg className="donut" width="116" height="116" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--neu-soft)" strokeWidth="16" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--pos)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${posL} ${C}`} strokeDashoffset="0" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--neu)" strokeWidth="16" strokeDasharray={`${neuL} ${C}`} strokeDashoffset={-posL} />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--neg)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${negL} ${C}`} strokeDashoffset={-(posL + neuL)} />
                </svg>
                <div className="donut-legend">
                  <div className="row"><span className="badge-dot" style={{ background: "var(--pos)", width: 9, height: 9 }} /><span className="nm">긍정</span><span className="pc tnum">{agg.pos}%</span></div>
                  <div className="row"><span className="badge-dot" style={{ background: "var(--neu)", width: 9, height: 9 }} /><span className="nm">중립</span><span className="pc tnum">{agg.neu}%</span></div>
                  <div className="row"><span className="badge-dot" style={{ background: "var(--neg)", width: 9, height: 9 }} /><span className="nm">부정</span><span className="pc tnum">{agg.neg}%</span></div>
                </div>
              </div>
              {(posNote || negNote) && (
                <div className="sent-notes">
                  {posNote && <div className="row"><span className="badge badge-pos" style={{ flex: "0 0 auto" }}>긍정</span><span className="txt">{posNote.topic}</span></div>}
                  {negNote && <div className="row"><span className="badge badge-neg" style={{ flex: "0 0 auto" }}>부정</span><span className="txt">{negNote.topic}</span></div>}
                </div>
              )}
            </section>

            {/* steam board */}
            <section className="card glass reveal" style={{ padding: "22px 22px 16px" }}>
              <div className="section-head"><h2 style={{ fontSize: "1.12rem" }}>🏷️ 스팀 할인</h2><Link className="more" href="/steam-sales">전체 →</Link></div>
              {D.steam.slice(0, 5).map((r, i) => <SteamLine key={i} r={r} />)}
            </section>

            {/* week schedule */}
            <section className="card glass reveal" style={{ padding: "22px 22px 20px" }}>
              <div className="section-head"><h2 style={{ fontSize: "1.12rem" }}>🗓️ 이번 주 일정</h2><Link className="more" href="/calendar">캘린더 →</Link></div>
              {week.length === 0 ? (
                <p className="empty" style={{ padding: "22px 12px" }}>예정된 일정이 없습니다.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {week.map((e, i) => {
                    const dt = e.d!;
                    const isToday = dt.getTime() === today.getTime();
                    return (
                      <div className="day-row" key={i}>
                        <div className={"day-pill" + (isToday ? " today" : "")}>
                          <span className="d">{dt.getDate()}</span>
                          <span className="w">{WD[dt.getDay()]}</span>
                        </div>
                        <div className="day-info" style={{ flex: 1 }}>
                          <div className="tt">{e.title}</div>
                          <div className="mt"><b className={"evtype " + evClass(e.type)}>{e.type}</b> · {e.game}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      )}

      <ArticleModal a={open} onClose={() => setOpen(null)} />
    </>
  );
}

function evClass(t: string) {
  if (t === "점검" || t === "업데이트") return "update";
  if (t === "방송") return "live";
  if (t === "콜라보") return "collab";
  return "watch";
}

function BriefCard({ g, onOpen }: { g: GameBrief; onOpen: (a: Article) => void }) {
  return (
    <article className="card glass lift reveal brief-card">
      <div className="brief-head">
        <span className="gdot" style={{ width: 9, height: 9, background: DOT[g.slug] || "var(--sky)" }} />
        <Link href={`/game/${g.slug}`}><h3>{g.name}</h3></Link>
        <span className={"badge " + (g.tier === "메인" ? "badge-blue" : "badge-neu")} style={{ marginLeft: "auto" }}>{g.tier}</span>
      </div>
      <ul className="brief-news">
        {g.news.slice(0, 3).map((a, i) => (
          <li className="news-li" key={i} onClick={() => onOpen(a)}>
            <span className="news-rank">{String(i + 1).padStart(2, "0")}</span>
            <span className="news-title">{a.title}</span>
          </li>
        ))}
        {g.news.length === 0 && <li style={{ fontSize: ".86rem", color: "var(--muted)", padding: "8px 0" }}>오늘 새 소식이 없습니다.</li>}
      </ul>
      <div className="brief-foot-sent"><SentimentBar s={g.sentiment} legend /></div>
      {g.events[0] && (
        <div className="brief-next">
          <span className="lab">다음 일정</span>
          <span className="d1">{g.events[0].date} {g.events[0].title}</span>
          {g.events[1] && <span className="d2">{g.events[1].date} {g.events[1].type}</span>}
        </div>
      )}
    </article>
  );
}
