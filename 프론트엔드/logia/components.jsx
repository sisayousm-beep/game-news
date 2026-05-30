// LOGIA — UI components. Exposed to window for cross-script use.
const { useState } = React;

// ── small atoms ──────────────────────────────────────────────
function Kicker({ children, dot = true }) {
  return (
    <div className="kicker">
      {dot && <span className="kicker-dot" />}
      {children}
    </div>
  );
}

function Tag({ children, accent = false }) {
  return <span className={"tag" + (accent ? " tag-accent" : "")}>{children}</span>;
}

function SourceDot({ source }) {
  // 출처별 한 글자 모노 배지
  const map = { "공식": "공", "공식 X": "X", "아카라이브": "아", "디시인사이드": "디", "Steam": "S" };
  return <span className="src-badge" title={source}>{map[source] || "·"}</span>;
}

// ── 커뮤니티 반응 인포그래픽 ───────────────────────────────────
function SentimentBar({ s, size = "sm" }) {
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

// ── 기사 한 줄 ────────────────────────────────────────────────
function NewsItem({ a, onOpen }) {
  const big = a.imp >= 85;
  return (
    <a className="news-item" onClick={onOpen}>
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
    </a>
  );
}

// ── 게임별 브리핑 카드 (1면) ──────────────────────────────────
function GameBriefCard({ g, onOpen }) {
  return (
    <div className="brief-card">
      <button className="brief-head" onClick={onOpen}>
        <span className="brief-name serif">{g.name}</span>
        <span className="brief-name-en mono">{g.nameEn}</span>
        <span className="brief-tier mono">{g.tier}</span>
        <span className="brief-go mono">전체보기 →</span>
      </button>
      <ul className="brief-news">
        {g.news.slice(0, 3).map((a, i) => (
          <li key={i} onClick={onOpen}>
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

// ── 스팀 할인 보드 ────────────────────────────────────────────
function SteamBoard({ rows, limit }) {
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

// ── 사건 감지 ────────────────────────────────────────────────
function AlertList({ alerts }) {
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

// ── 일정 리스트 ──────────────────────────────────────────────
function EventRow({ e, game }) {
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

Object.assign(window, {
  Kicker, Tag, SourceDot, SentimentBar, NewsItem,
  GameBriefCard, SteamBoard, AlertList, EventRow,
});
