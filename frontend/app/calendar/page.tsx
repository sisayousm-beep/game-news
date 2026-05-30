import { api, type EventItem } from "@/lib/api";
import { EventRow } from "@/components/atoms";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  const events = await api.calendar();

  // 날짜별 그룹
  const groups: Record<string, EventItem[]> = {};
  for (const e of events) (groups[e.date] ??= []).push(e);
  const dates = Object.keys(groups).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title serif">이벤트 캘린더</h1>
        <span className="page-note mono">예정 일정 {events.length}건</span>
      </div>
      {events.length === 0 ? (
        <p className="empty mono">예정된 일정이 없습니다.</p>
      ) : (
        <div className="front-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {dates.map((d) => (
            <section key={d} className="rail-sec" style={{ paddingRight: 24 }}>
              <div className="sec-head">
                <span className="evt-date mono" style={{ width: "auto", fontSize: 15 }}>{d}</span>
              </div>
              <ul className="evts">
                {groups[d].map((e, i) => <EventRow key={i} e={e} game={e.game} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
