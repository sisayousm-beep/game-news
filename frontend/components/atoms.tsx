import type { Sentiment, Article, EventItem, SteamRow } from "@/lib/api";

export function Tag({ children, tone }: { children: React.ReactNode; tone?: "blue" | "warn" | "pos" | "neg" | "neu" }) {
  return <span className={"badge badge-" + (tone || "neu")}>{children}</span>;
}

const SRC_MAP: Record<string, string> = {
  "공식": "공", "공식 X": "X", "아카라이브": "아", "디시인사이드": "디",
  "인벤": "인", "아카": "아", "디시": "디", "Steam": "S",
};
export function SourceDot({ source }: { source: string }) {
  return <span className="src-badge" title={source}>{SRC_MAP[source] || "·"}</span>;
}

export function SentimentBar({ s, legend = false }: { s: Sentiment; legend?: boolean }) {
  return (
    <div>
      <div className="sentiment">
        <span className="s-pos" data-fill={s.pos} />
        <span className="s-neu" data-fill={s.neu} />
        <span className="s-neg" data-fill={s.neg} />
      </div>
      {legend && (
        <div className="sent-legend">
          <span className="lp">긍정 {s.pos}%</span>
          <span className="ln">중립 {s.neu}%</span>
          <span className="lg">부정 {s.neg}%</span>
        </div>
      )}
    </div>
  );
}

const ACCENT_TAGS = new Set(["이벤트", "신규캐릭터", "콜라보"]);

export function NewsItem({ a, onOpen }: { a: Article; onOpen?: (a: Article) => void }) {
  const big = a.imp >= 85;
  const inner = (
    <>
      <span className="ni-body">
        <span className={"ni-title" + (big ? " big" : "")}>{a.title}</span>
        <span className="ni-meta">
          <SourceDot source={a.source} />
          <span>{a.source}</span>
          <span className="sep">·</span>
          <span>{a.time}</span>
          <Tag tone={ACCENT_TAGS.has(a.tag) ? "blue" : "neu"}>{a.tag}</Tag>
          {big && <span className="badge badge-warn">중요</span>}
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

export function EventRow({ e, game }: { e: EventItem; game?: string | null }) {
  return (
    <li className="evt">
      <span className="evt-date">{e.date}</span>
      <span className="evt-main">
        <span className="evt-title">{e.title}</span>
        <span className="evt-tags">
          {game && <span>{game}</span>}
          {game && <span>·</span>}
          <span>{e.type}</span>
        </span>
      </span>
    </li>
  );
}

export function SteamLine({ r }: { r: SteamRow }) {
  return (
    <div className="steam-row">
      <div className="steam-thumb kv" data-label="" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="nm">
          {r.name}
          {r.low && <span className="low-flag">최저가</span>}
        </div>
        <div className="was tnum">{r.was}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        {r.disc > 0 ? (
          <span className={"badge " + (r.low ? "badge-low" : "badge-blue")} style={{ marginBottom: 3 }}>
            −{r.disc}%{r.low ? " · 최저" : ""}
          </span>
        ) : (
          <span className="badge badge-neu" style={{ marginBottom: 3 }}>정가</span>
        )}
        <div className="now tnum">{r.price}</div>
        {r.ends && r.ends !== "—" && (
          <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>~{r.ends}</div>
        )}
      </div>
    </div>
  );
}
