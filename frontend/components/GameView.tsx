"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GameBrief, Article } from "@/lib/api";
import { Kicker, NewsItem, SentimentBar, EventRow } from "@/components/atoms";
import ArticleModal from "@/components/ArticleModal";

export default function GameView({ g }: { g: GameBrief }) {
  const tags = useMemo(
    () => ["전체", ...Array.from(new Set(g.news.map((n) => n.tag)))],
    [g],
  );
  const [filter, setFilter] = useState("전체");
  const [open, setOpen] = useState<Article | null>(null);
  const news = filter === "전체" ? g.news : g.news.filter((n) => n.tag === filter);
  const hasData = g.news.length > 0 || g.summary;

  return (
    <div className="gamepage">
      <Link className="back mono" href="/">← 전체 브리핑으로</Link>

      <header className="gp-head">
        <div className="gp-title">
          <h2 className="gp-name serif">{g.name}</h2>
          <div className="gp-sub mono">
            <span>{g.nameEn}</span>
            <span className="util-sep">·</span>
            <span>{g.pub}</span>
            <span className="util-sep">·</span>
            <span>{g.tier}</span>
          </div>
        </div>
        <div className="gp-sent">
          <span className="gp-sent-label mono">커뮤니티 반응</span>
          <SentimentBar s={g.sentiment} size="lg" />
        </div>
      </header>

      {!hasData ? (
        <p className="empty mono">아직 이 게임의 브리핑이 없습니다.</p>
      ) : (
        <>
          <div className="gp-summary">
            <span className="lede-label mono">AI 요약 — 오늘의 한 줄</span>
            <p className="serif">{g.summary}</p>
          </div>

          <div className="gp-grid">
            <section className="gp-main">
              <div className="sec-head">
                <Kicker>최신 뉴스 — {g.news.length}건</Kicker>
                <div className="chips">
                  {tags.map((t) => (
                    <button
                      key={t}
                      className={"chip mono" + (filter === t ? " active" : "")}
                      onClick={() => setFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="news-list">
                {news.map((a, i) => <NewsItem key={i} a={a} onOpen={setOpen} />)}
                {news.length === 0 && <div className="empty mono">해당 분야 소식이 없습니다.</div>}
              </div>
            </section>

            <aside className="gp-rail">
              {g.incidents.length > 0 && (
                <section className="rail-sec">
                  <div className="sec-head"><Kicker>주요 사건</Kicker></div>
                  <ul className="gp-incidents">
                    {g.incidents.map((inc, i) => (
                      <li key={i} className="gp-inc">
                        <span className={"alert-sev mono sev-" + (inc.severity === "주의" ? "warn" : "watch")}>
                          {inc.severity}
                        </span>
                        <span className="serif">{inc.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="rail-sec">
                <div className="sec-head"><Kicker>예정 이벤트</Kicker></div>
                <ul className="evts">
                  {g.events.map((e, i) => <EventRow key={i} e={e} />)}
                  {g.events.length === 0 && <div className="empty mono">예정된 일정이 없습니다.</div>}
                </ul>
              </section>

              <section className="rail-sec">
                <div className="sec-head"><Kicker>커뮤니티 반응</Kicker></div>
                <SentimentBar s={g.sentiment} size="lg" />
                <p className="sent-note">
                  긍정 여론이 <b>{g.sentiment.pos}%</b>로 우세
                  {g.sentiment.neg >= 20 ? "하나, 부정 의견도 적지 않다." : "하며 전반적으로 안정적이다."}
                </p>
                {g.discussions.length > 0 && (
                  <ul className="gp-incidents" style={{ marginTop: 14 }}>
                    {g.discussions.map((d, i) => (
                      <li key={i} className="gp-inc">
                        <span className={"alert-sev mono sev-" + (d.sentiment === "부정" ? "watch" : "warn")}>
                          {d.sentiment}
                        </span>
                        <span><b className="serif">{d.topic}</b> — {d.summary}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        </>
      )}
      <ArticleModal a={open} onClose={() => setOpen(null)} />
    </div>
  );
}
