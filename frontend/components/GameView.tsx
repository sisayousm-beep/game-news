"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { GameBrief, Article, CharacterListItem } from "@/lib/api";
import { SentimentBar, NewsItem, EventRow, DiscussionList } from "@/components/atoms";
import ArticleModal from "@/components/ArticleModal";

export default function GameView({ g, characters = [] }: { g: GameBrief; characters?: CharacterListItem[] }) {
  const tags = useMemo(
    () => ["전체", ...Array.from(new Set(g.news.map((n) => n.tag)))],
    [g],
  );
  const [filter, setFilter] = useState("전체");
  const [open, setOpen] = useState<Article | null>(null);
  const news = filter === "전체" ? g.news : g.news.filter((n) => n.tag === filter);
  const hasData = g.news.length > 0 || g.summary;

  return (
    <div>
      <Link className="back" href="/">← 전체 브리핑으로</Link>

      <header className="gp-head reveal">
        <div className="gp-title">
          <h2>{g.name}</h2>
          <div className="gp-sub">
            <span>{g.nameEn}</span>
            <span className="sep">·</span>
            <span>{g.pub}</span>
            <span className="sep">·</span>
            <span className="badge badge-neu">{g.tier}</span>
          </div>
        </div>
        <div className="gp-sent">
          <span className="lab">커뮤니티 반응</span>
          <SentimentBar s={g.sentiment} legend />
        </div>
      </header>

      {characters.length > 0 && (
        <section className="char-strip reveal" data-stagger>
          <div className="section-head"><h2 style={{ fontSize: "1.18rem" }}>캐릭터 공략 · {characters.length}</h2></div>
          <div className="char-cards">
            {characters.map((c) => (
              <Link key={c.slug} href={`/game/${g.slug}/char/${c.slug}`} className="card glass lift reveal char-card">
                <span className={"kv ci" + (c.image ? " has-img" : "")} data-label="">
                  {c.image && <img src={c.image} alt="" referrerPolicy="no-referrer" />}
                </span>
                <span className="cb">
                  <span className="cn">{c.name}</span>
                  <span className="cm"><span className="stars">{"★".repeat(c.rarity)}</span> · {c.element} · {c.weapon_type}</span>
                  <span className="cr">{c.role}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!hasData ? (
        <p className="empty" style={{ marginTop: 24 }}>아직 이 게임의 브리핑이 없습니다.</p>
      ) : (
        <>
          {g.summary && (
            <div className="card glass reveal gp-summary">
              <span className="lab">AI 요약 · 오늘의 한 줄</span>
              <p>{g.summary}</p>
            </div>
          )}

          <div className="gp-grid">
            <section>
              <div className="section-head">
                <h2 style={{ fontSize: "1.18rem" }}>최신 뉴스 · {g.news.length}건</h2>
              </div>
              <div className="chips" style={{ marginBottom: 8 }}>
                {tags.map((t) => (
                  <button key={t} className={"chip" + (filter === t ? " is-active" : "")} onClick={() => setFilter(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="news-list">
                {news.map((a, i) => <NewsItem key={i} a={a} onOpen={setOpen} />)}
                {news.length === 0 && <div className="empty" style={{ marginTop: 12 }}>해당 분야 소식이 없습니다.</div>}
              </div>
            </section>

            <aside className="gp-rail">
              {g.incidents.length > 0 && (
                <section className="card glass reveal" style={{ padding: "20px 22px" }}>
                  <div className="section-head"><h2 style={{ fontSize: "1.08rem" }}>주요 사건</h2></div>
                  <ul className="rail-list">
                    {g.incidents.map((inc, i) => (
                      <li key={i} className="rail-li">
                        <span className={"badge " + (inc.severity === "주의" ? "badge-warn" : "badge-watch")} style={{ flex: "0 0 auto" }}>{inc.severity}</span>
                        <span>{inc.title}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="card glass reveal" style={{ padding: "20px 22px" }}>
                <div className="section-head"><h2 style={{ fontSize: "1.08rem" }}>예정 이벤트</h2></div>
                <ul className="evts">
                  {g.events.map((e, i) => <EventRow key={i} e={e} />)}
                  {g.events.length === 0 && <li style={{ fontSize: ".86rem", color: "var(--muted)", padding: "8px 0" }}>예정된 일정이 없습니다.</li>}
                </ul>
              </section>

              <section className="card glass reveal" style={{ padding: "20px 22px" }}>
                <div className="section-head"><h2 style={{ fontSize: "1.08rem" }}>커뮤니티 반응</h2></div>
                <SentimentBar s={g.sentiment} legend />
                <p style={{ fontSize: ".86rem", color: "var(--ink-sec)", margin: "12px 0 4px", lineHeight: 1.5 }}>
                  긍정 여론이 <b>{g.sentiment.pos}%</b>로 우세
                  {g.sentiment.neg >= 20 ? "하나, 부정 의견도 적지 않다." : "하며 전반적으로 안정적이다."}
                </p>
                {g.discussions.length > 0 ? (
                  <div style={{ marginTop: 12 }}><DiscussionList items={g.discussions} /></div>
                ) : (
                  <p style={{ fontSize: ".82rem", color: "var(--muted)", marginTop: 10 }}>
                    수집된 주요 의견이 아직 없습니다.
                  </p>
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
