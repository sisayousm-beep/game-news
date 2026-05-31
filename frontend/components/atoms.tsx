import Link from "next/link";
import type { Sentiment, Article, EventItem, Alert, SteamRow, GameBrief } from "@/lib/api";

export function Kicker({ children, dot = true }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <div className="kicker">
      {dot && <span className="kicker-dot" />}
      {children}
    </div>
  );
}

export function Tag({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return <span className={"tag" + (accent ? " tag-accent" : "")}>{children}</span>;
}

const SRC_MAP: Record<string, string> = {
  "공식": "공", "공식 X": "X", "아카라이브": "아", "디시인사이드": "디", "Steam": "S",
};
export function SourceDot({ source }: { source: string }) {
  return <span className="src-badge" title={source}>{SRC_MAP[source] || "·"}</span>;
}

export function SentimentBar({ s, size = "sm" }: { s: Sentiment; size?: "sm" | "lg" }) {
  return (
    <div className={"sent sent-" + size}>
      <div className="sent-bar">
        <span className="seg seg-pos" style={{ width: s.pos + "%" }} />
        <span className="seg seg-neu" style={{ width: s.neu + "%" }} />
        <span className="seg seg-neg" style={{ width: s.neg + "%" }} />
      </div>
      <div className="sent-legend mono">
        <span><i className="dot dot-pos" />긍 {s.pos}</span>
        <span><i className="dot dot-neu" />중 {s.neu}</span>
        <span><i className="dot dot-neg" />부 {s.neg}</span>
      </div>
    </div>
  );
}

export function NewsItem({ a, onOpen }: { a: Article; onOpen?: (a: Article) => void }) {
  const big = a.imp >= 85;
  const inner = (
    <>
      <span className="news-rail" style={{ opacity: 0.25 + (a.imp / 100) * 0.75 }} />
      <span className="news-body">
        <span className={"news-title serif" + (big ? " is-big" : "")}>{a.title}</span>
        <span className="news-meta mono">
          <SourceDot source={a.source} />
          <span>{a.source}</span>
          <span className="sep">·</span>
          <span>{a.time}</span>
          <Tag accent={a.tag === "이벤트" || a.tag === "신규캐릭터"}>{a.tag}</Tag>
          {big && <span className="imp-flag mono">중요</span>}
        </span>
      </span>
      {a.image && (
        <span className="news-thumb">
          <img src={a.image} alt="" referrerPolicy="no-referrer" loading="lazy" />
        </span>
      )}
    </>
  );
  if (onOpen) {
    return (
      <button className="news-item" onClick={() => onOpen(a)}>
        {inner}
      </button>
    );
  }
  return a.url ? (
    <a className="news-item" href={a.url} target="_blank" rel="noreferrer">{inner}</a>
  ) : (
    <div className="news-item">{inner}</div>
  );
}

export function GameBriefCard({ g }: { g: GameBrief }) {
  return (
    <div className="brief-card">
      <Link className="brief-head" href={`/game/${g.slug}`}>
        <span className="brief-name serif">{g.name}</span>
        <span className="brief-name-en mono">{g.nameEn}</span>
        <span className="brief-tier mono">{g.tier}</span>
        <span className="brief-go mono">전체보기 →</span>
      </Link>
      <ul className="brief-news">
        {g.news.slice(0, 3).map((a, i) => (
          <li key={i}>
            <span className="bullet" />
            <span className="serif">{a.title}</span>
          </li>
        ))}
      </ul>
      <div className="brief-foot">
        <SentimentBar s={g.sentiment} />
        {g.events[0] && (
          <div className="brief-next mono">
            <span className="next-date">{g.events[0].date}</span>
            <span className="next-title">{g.events[0].title}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SteamBoard({ rows, limit }: { rows: SteamRow[]; limit?: number }) {
  const data = limit ? rows.slice(0, limit) : rows;
  return (
    <table className="steam">
      <thead>
        <tr className="mono">
          <th className="l">타이틀</th>
          <th className="r">할인</th>
          <th className="r">현재가</th>
          <th className="r">종료</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={i} className={r.disc === 0 ? "is-flat" : ""}>
            <td className="l steam-name">
              {r.name}
              {r.low && <span className="low-flag mono">최저</span>}
            </td>
            <td className="r mono">
              {r.disc > 0 ? <span className="disc">−{r.disc}%</span> : <span className="noflag">—</span>}
            </td>
            <td className="r mono steam-price">{r.price}</td>
            <td className="r mono steam-ends">{r.ends}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AlertList({ alerts }: { alerts: Alert[] }) {
  return (
    <ul className="alerts">
      {alerts.map((a, i) => (
        <li key={i} className="alert">
          <span className={"alert-sev mono sev-" + (a.severity === "주의" ? "warn" : "watch")}>
            {a.severity}
          </span>
          <span className="alert-main">
            <span className="alert-title serif">{a.title}</span>
            <span className="alert-meta mono">
              {a.game}
              <span className="heat-track"><i style={{ width: a.heat + "%" }} /></span>
              <span className="heat-n">{a.heat}</span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function EventRow({ e, game }: { e: EventItem; game?: string | null }) {
  return (
    <li className="evt">
      <span className="evt-date mono">{e.date}</span>
      <span className="evt-main">
        <span className="evt-title">{e.title}</span>
        {game && <span className="evt-game mono">{game}</span>}
        <span className="evt-type mono">{e.type}</span>
      </span>
    </li>
  );
}
