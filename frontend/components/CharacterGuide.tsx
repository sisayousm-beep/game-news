import Link from "next/link";
import type { CharacterDetail } from "@/lib/api";

function Head({ children }: { children: React.ReactNode }) {
  return <div className="section-head"><h2 style={{ fontSize: "1.08rem" }}>{children}</h2></div>;
}

export default function CharacterGuide({ c }: { c: CharacterDetail }) {
  const d = c.data || {};
  return (
    <div>
      <Link className="back" href={`/game/${c.game}`}>← {c.gameName} 브리핑으로</Link>

      {/* Hero */}
      <header className="card glass reveal cg-hero">
        <div className={"kv cg-hero-img" + (c.image ? " has-img" : "")} data-label={`KEY VISUAL · ${c.name}`}>
          {c.image && <img src={c.image} alt="" referrerPolicy="no-referrer" />}
        </div>
        <div className="cg-hero-info">
          <div className="cg-rarity">{"★".repeat(c.rarity)}</div>
          <h1 className="cg-name">{c.name}</h1>
          <div className="cg-name-en">{c.nameEn}</div>
          <div className="cg-chips">
            {c.element && <span className="chip is-active">{c.element}</span>}
            {c.weapon_type && <span className="chip">{c.weapon_type}</span>}
            {c.role && <span className="chip">{c.role}</span>}
          </div>
          {c.tagline && <p className="cg-tagline">{c.tagline}</p>}
        </div>
      </header>

      {c.overview && (
        <div className="card glass reveal gp-summary">
          <span className="lab">한 줄 평</span>
          <p>{c.overview}</p>
        </div>
      )}

      <div className="cg-grid">
        <div className="cg-main">
          {d.weapons && d.weapons.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>추천 무기 (성능순)</Head>
              <ol className="cg-weapons">
                {d.weapons.map((w, i) => (
                  <li key={i} className="cg-weapon">
                    <span className="cg-weapon-rank">{i + 1}</span>
                    <span style={{ flex: 1 }}>
                      <span className="cg-weapon-name">
                        {w.name}
                        <span className="cg-weapon-tags">{"★".repeat(w.rarity)}{w.signature ? " · 전용" : ""}</span>
                      </span>
                      <div className="cg-weapon-note">{w.note}</div>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {d.echoes && d.echoes.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>에코 세트</Head>
              <div className="cg-echoes">
                {d.echoes.map((e, i) => (
                  <div key={i} className="cg-echo">
                    <div className="cg-echo-head">
                      <span className="cg-echo-mode">{e.mode}</span>
                      <span className="cg-echo-set">{e.set}</span>
                    </div>
                    {e.mainEcho && <div className="cg-echo-main">메인 에코 · {e.mainEcho}</div>}
                    <div className="cg-echo-note">{e.note}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {d.rotation && (
            <section className="card glass reveal cg-sec">
              <Head>딜 사이클</Head>
              <p className="cg-rotation">{d.rotation}</p>
            </section>
          )}

          {d.teams && d.teams.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>추천 파티</Head>
              <div className="cg-teams">
                {d.teams.map((t, i) => (
                  <div key={i}>
                    <span className="cg-team-name">{t.name}</span>
                    <div className="cg-team-members">
                      {t.members.map((mb, j) => <span key={j} className="chip">{mb}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="cg-rail">
          {d.mainStats && Object.keys(d.mainStats).length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>주옵션 (에코)</Head>
              <table className="cg-stat-table"><tbody>
                {Object.entries(d.mainStats).map(([k, v]) => (
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
              </tbody></table>
            </section>
          )}

          {d.subStats && d.subStats.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>부옵션 우선순위</Head>
              <ol className="cg-priority">{d.subStats.map((su, i) => <li key={i}>{su}</li>)}</ol>
            </section>
          )}

          {d.skillPriority && d.skillPriority.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>스킬 우선순위</Head>
              <ol className="cg-priority">{d.skillPriority.map((sk, i) => <li key={i}>{sk}</li>)}</ol>
            </section>
          )}

          {d.tiers && d.tiers.length > 0 && (
            <section className="card glass reveal cg-sec">
              <Head>준종결 · 종결 스펙</Head>
              {d.tiers.map((t, i) => (
                <div key={i} className="cg-tier">
                  <div className="cg-tier-name">{t.name}</div>
                  {t.note && <div className="cg-tier-note">{t.note}</div>}
                  {t.stats && (
                    <table className="cg-stat-table"><tbody>
                      {Object.entries(t.stats).map(([k, v]) => (
                        <tr key={k}><th>{k}</th><td>{v}</td></tr>
                      ))}
                    </tbody></table>
                  )}
                </div>
              ))}
            </section>
          )}
        </aside>
      </div>

      {d.sources && d.sources.length > 0 && (
        <div className="cg-sources">출처 — {d.sources.join(" · ")}</div>
      )}
    </div>
  );
}
