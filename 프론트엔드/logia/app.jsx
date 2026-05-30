// LOGIA — app shell, front page + focused game page, tweaks.
const { useState, useMemo } = React;

const D = window.LOGIA_DATA;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FB8B1E",
  "serif": "'Noto Serif KR', serif",
  "density": "regular"
}/*EDITMODE-END*/;

const DENSITY = {
  compact: { gap: "20px", pad: "14px", base: "14.5px" },
  regular: { gap: "28px", pad: "18px", base: "15.5px" },
  comfy:   { gap: "38px", pad: "24px", base: "16.5px" },
};

// ── Masthead ─────────────────────────────────────────────────
function Masthead() {
  return (
    <header className="masthead">
      <div className="util mono">
        <div className="util-l">
          <span>{D.meta.dateLong}</span>
          <span className="util-sep">·</span>
          <span>제 {D.meta.issue}호</span>
          <span className="util-sep">·</span>
          <span>{D.meta.edition}</span>
        </div>
        <div className="util-r">
          <span className="pub-dot" />
          <span>{D.meta.published}</span>
          <span className="util-sep">·</span>
          <button className="util-btn">검색</button>
          <button className="util-btn">아카이브</button>
        </div>
      </div>
      <div className="title-row">
        <div className="title-side mono left">
          EST.<br />2026
        </div>
        <h1 className="logo serif">{D.meta.title}</h1>
        <div className="title-side mono right">
          하루 한 번<br />읽는 신문
        </div>
      </div>
      <div className="tagline mono">{D.meta.tagline} — 게임 전문 조간 브리핑</div>
    </header>
  );
}

// ── Game nav (tabs) ──────────────────────────────────────────
function TopNav({ view, setView }) {
  return (
    <nav className="gnav">
      <div className="gnav-inner">
        <button
          className={"gnav-item is-home" + (view === "front" ? " active" : "")}
          onClick={() => setView("front")}
        >전체</button>
        {D.games.map((g) => (
          <button
            key={g.slug}
            className={"gnav-item" + (view === g.slug ? " active" : "")}
            onClick={() => setView(g.slug)}
          >{g.name}</button>
        ))}
        <span className="gnav-spacer" />
        <button className="gnav-item is-sec">스팀 할인</button>
        <button className="gnav-item is-sec">이벤트</button>
      </div>
    </nav>
  );
}

// ── Front page ───────────────────────────────────────────────
function FrontPage({ setView }) {
  const allEvents = useMemo(() => {
    const list = [];
    D.games.forEach((g) => g.events.forEach((e) => list.push({ ...e, game: g.name })));
    return list.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 9);
  }, []);

  return (
    <div className="front">
      <div className="lede">
        <span className="lede-label mono">편집국 — 오늘의 브리핑</span>
        <p className="lede-text serif">{D.lede}</p>
      </div>

      <div className="front-grid">
        {/* ── 메인: 리드 스토리 + 사건 감지 ── */}
        <section className="col col-lead">
          <article className="lead">
            <Kicker>{D.lead.kicker} · {D.lead.game}</Kicker>
            <h2 className="lead-hd serif">{D.lead.headline}</h2>
            <div className="lead-photo">
              <span className="photo-cap mono">PHOTO — 공식 키 비주얼</span>
            </div>
            <p className="lead-deck serif">{D.lead.deck}</p>
            {D.lead.body.map((p, i) => (
              <p key={i} className="lead-p">{p}</p>
            ))}
            <div className="lead-src mono">{D.lead.source} · {D.lead.time}</div>
          </article>

          <section className="alerts-sec">
            <div className="sec-head">
              <Kicker>주요 사건 감지 — AI 분석</Kicker>
            </div>
            <AlertList alerts={D.alerts} />
          </section>
        </section>

        {/* ── 게임별 브리핑 ── */}
        <section className="col col-briefs">
          <div className="sec-head">
            <Kicker>게임별 브리핑 — {D.games.length}종</Kicker>
          </div>
          <div className="briefs">
            {D.games.map((g) => (
              <GameBriefCard key={g.slug} g={g} onOpen={() => setView(g.slug)} />
            ))}
          </div>
        </section>

        {/* ── 우측 레일 ── */}
        <aside className="col col-rail">
          <section className="rail-sec">
            <div className="sec-head">
              <Kicker>스팀 할인 추적</Kicker>
              <span className="sec-note mono">{D.meta.dateShort} 기준</span>
            </div>
            <SteamBoard rows={D.steam} limit={11} />
            <button className="rail-more mono">전체 할인 보기 →</button>
          </section>

          <section className="rail-sec">
            <div className="sec-head">
              <Kicker>이번 주 일정</Kicker>
            </div>
            <ul className="evts">
              {allEvents.map((e, i) => (
                <EventRow key={i} e={e} game={e.game} />
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

// ── Focused game page ────────────────────────────────────────
function GamePage({ slug, setView }) {
  const g = D.games.find((x) => x.slug === slug);
  const tags = useMemo(() => ["전체", ...Array.from(new Set(g.news.map((n) => n.tag)))], [slug]);
  const [filter, setFilter] = useState("전체");
  const news = filter === "전체" ? g.news : g.news.filter((n) => n.tag === filter);

  return (
    <div className="gamepage">
      <button className="back mono" onClick={() => setView("front")}>← 전체 브리핑으로</button>

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
                >{t}</button>
              ))}
            </div>
          </div>
          <div className="news-list">
            {news.map((a, i) => <NewsItem key={i} a={a} onOpen={() => {}} />)}
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
                    <span className={"alert-sev mono sev-" + (inc.severity === "주의" ? "warn" : "watch")}>{inc.severity}</span>
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
            </ul>
          </section>

          <section className="rail-sec">
            <div className="sec-head"><Kicker>커뮤니티 반응</Kicker></div>
            <SentimentBar s={g.sentiment} size="lg" />
            <p className="sent-note">
              긍정 여론이 <b>{g.sentiment.pos}%</b>로 우세{g.sentiment.neg >= 20 ? "하나, 부정 의견도 적지 않다." : "하며 전반적으로 안정적이다."}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("front");
  const dn = DENSITY[t.density] || DENSITY.regular;

  const rootStyle = {
    "--accent": t.accent,
    "--serif": t.serif,
    "--gap": dn.gap,
    "--pad": dn.pad,
    "--base": dn.base,
  };

  return (
    <div className="paper" style={rootStyle} data-density={t.density}>
      <Masthead />
      <TopNav view={view} setView={setView} />
      <main className="sheet">
        {view === "front"
          ? <FrontPage setView={setView} />
          : <GamePage slug={view} setView={setView} />}
      </main>
      <footer className="colophon mono">
        <span className="serif logo-sm">LOGIA</span>
        <span>제 {D.meta.issue}호 · {D.meta.dateLong} · {D.meta.published}</span>
        <span>AI 편집 · Claude 기반 자동 큐레이션 · 매일 08:00 발행</span>
      </footer>

      <TweaksPanel>
        <TweakSection label="제호 / 색" />
        <TweakColor label="포인트 컬러" value={t.accent}
          options={["#FB8B1E", "#2BE06B", "#FF3B30", "#E8C547"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="타이포그래피" />
        <TweakRadio label="헤드라인 서체" value={t.serif}
          options={[
            { value: "'Noto Serif KR', serif", label: "본명조" },
            { value: "'Nanum Myeongjo', serif", label: "나눔명조" },
            { value: "'Song Myung', serif", label: "송명" },
          ]}
          onChange={(v) => setTweak("serif", v)} />
        <TweakRadio label="정보 밀도" value={t.density}
          options={[
            { value: "compact", label: "빽빽" },
            { value: "regular", label: "보통" },
            { value: "comfy", label: "여유" },
          ]}
          onChange={(v) => setTweak("density", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
