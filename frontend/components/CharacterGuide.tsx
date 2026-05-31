import Link from "next/link";
import type { CharacterDetail } from "@/lib/api";
import { Kicker } from "@/components/atoms";

export default function CharacterGuide({ c }: { c: CharacterDetail }) {
  const d = c.data || {};
  return (
    <div className="cg">
      <Link className="back mono" href={`/game/${c.game}`}>← {c.gameName} 브리핑으로</Link>

      {/* Hero */}
      <header className="cg-hero">
        <div className="cg-hero-img">
          {c.image && <img src={c.image} alt="" referrerPolicy="no-referrer" />}
        </div>
        <div className="cg-hero-info">
          <div className="cg-rarity mono">{"★".repeat(c.rarity)}</div>
          <h1 className="cg-name serif">{c.name}</h1>
          <div className="cg-name-en mono">{c.nameEn}</div>
          <div className="cg-chips">
            {c.element && <span className="chip active">{c.element}</span>}
            {c.weapon_type && <span className="chip">{c.weapon_type}</span>}
            {c.role && <span className="chip">{c.role}</span>}
          </div>
          {c.tagline && <p className="cg-tagline">{c.tagline}</p>}
        </div>
      </header>

      {c.overview && (
        <div className="gp-summary">
          <span className="lede-label mono">한 줄 평</span>
          <p className="serif">{c.overview}</p>
        </div>
      )}

      <div className="cg-grid">
        <section className="cg-col">
          {/* Weapons */}
          {d.weapons && d.weapons.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>추천 무기 (성능순)</Kicker></div>
              <ol className="cg-weapons">
                {d.weapons.map((w, i) => (
                  <li key={i} className="cg-weapon">
                    <span className="cg-weapon-rank mono">{i + 1}</span>
                    <span className="cg-weapon-body">
                      <span className="cg-weapon-name serif">
                        {w.name}
                        <span className="cg-weapon-tags mono">
                          {"★".repeat(w.rarity)}{w.signature ? " · 전용" : ""}
                        </span>
                      </span>
                      <span className="cg-weapon-note">{w.note}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Echoes */}
          {d.echoes && d.echoes.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>에코 세트</Kicker></div>
              <div className="cg-echoes">
                {d.echoes.map((e, i) => (
                  <div key={i} className="cg-echo">
                    <div className="cg-echo-head">
                      <span className="cg-echo-mode mono">{e.mode}</span>
                      <span className="cg-echo-set serif">{e.set}</span>
                    </div>
                    {e.mainEcho && <div className="cg-echo-main mono">메인 에코 · {e.mainEcho}</div>}
                    <div className="cg-echo-note">{e.note}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Rotation */}
          {d.rotation && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>딜 사이클</Kicker></div>
              <p className="cg-rotation mono">{d.rotation}</p>
            </section>
          )}

          {/* Teams */}
          {d.teams && d.teams.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>추천 파티</Kicker></div>
              <div className="cg-teams">
                {d.teams.map((t, i) => (
                  <div key={i} className="cg-team">
                    <span className="cg-team-name mono">{t.name}</span>
                    <div className="cg-team-members">
                      {t.members.map((mb, j) => (
                        <span key={j} className="chip">{mb}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </section>

        <aside className="cg-col cg-rail">
          {/* Main stats */}
          {d.mainStats && Object.keys(d.mainStats).length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>주옵션 (에코)</Kicker></div>
              <table className="cg-stat-table">
                <tbody>
                  {Object.entries(d.mainStats).map(([k, v]) => (
                    <tr key={k}><th className="mono">{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Sub stats */}
          {d.subStats && d.subStats.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>부옵션 우선순위</Kicker></div>
              <ol className="cg-priority">
                {d.subStats.map((su, i) => <li key={i}>{su}</li>)}
              </ol>
            </section>
          )}

          {/* Skill priority */}
          {d.skillPriority && d.skillPriority.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>스킬 우선순위</Kicker></div>
              <ol className="cg-priority">
                {d.skillPriority.map((sk, i) => <li key={i}>{sk}</li>)}
              </ol>
            </section>
          )}

          {/* Build tiers */}
          {d.tiers && d.tiers.length > 0 && (
            <section className="cg-sec">
              <div className="sec-head"><Kicker>준종결 · 종결 스펙</Kicker></div>
              <div className="cg-tiers">
                {d.tiers.map((t, i) => (
                  <div key={i} className="cg-tier">
                    <div className="cg-tier-name mono">{t.name}</div>
                    {t.note && <div className="cg-tier-note">{t.note}</div>}
                    {t.stats && (
                      <table className="cg-stat-table">
                        <tbody>
                          {Object.entries(t.stats).map(([k, v]) => (
                            <tr key={k}><th className="mono">{k}</th><td className="disc">{v}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {d.sources && d.sources.length > 0 && (
        <div className="cg-sources mono">
          출처 — {d.sources.join(" · ")}
        </div>
      )}
    </div>
  );
}
