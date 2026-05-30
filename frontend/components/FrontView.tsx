import type { FrontPage, EventItem } from "@/lib/api";
import { Kicker, AlertList, GameBriefCard, SteamBoard, EventRow } from "@/components/atoms";

export default function FrontView({ D }: { D: FrontPage }) {
  const hasIssue = D.meta.issue > 0 && D.games.length > 0;

  const allEvents: EventItem[] = [];
  D.games.forEach((g) => g.events.forEach((e) => allEvents.push({ ...e, game: g.name })));
  allEvents.sort((a, b) => a.date.localeCompare(b.date));
  const weekEvents = allEvents.slice(0, 9);

  return (
    <div className="front">
      <div className="lede">
        <span className="lede-label mono">편집국 — 오늘의 브리핑</span>
        <p className="lede-text serif">{D.lede}</p>
      </div>

      {!hasIssue ? (
        <p className="empty mono">
          이 날짜에는 발행된 브리핑이 없습니다.
        </p>
      ) : (
        <div className="front-grid">
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

            {D.alerts.length > 0 && (
              <section className="alerts-sec">
                <div className="sec-head">
                  <Kicker>주요 사건 감지 — AI 분석</Kicker>
                </div>
                <AlertList alerts={D.alerts} />
              </section>
            )}
          </section>

          <section className="col col-briefs">
            <div className="sec-head">
              <Kicker>게임별 브리핑 — {D.games.length}종</Kicker>
            </div>
            <div className="briefs">
              {D.games.map((g) => (
                <GameBriefCard key={g.slug} g={g} />
              ))}
            </div>
          </section>

          <aside className="col col-rail">
            <section className="rail-sec">
              <div className="sec-head">
                <Kicker>스팀 할인 추적</Kicker>
                <span className="sec-note mono">{D.meta.dateShort} 기준</span>
              </div>
              <SteamBoard rows={D.steam} limit={11} />
              <a className="rail-more mono" href="/steam-sales">전체 할인 보기 →</a>
            </section>

            <section className="rail-sec">
              <div className="sec-head">
                <Kicker>이번 주 일정</Kicker>
              </div>
              <ul className="evts">
                {weekEvents.map((e, i) => (
                  <EventRow key={i} e={e} game={e.game} />
                ))}
              </ul>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
