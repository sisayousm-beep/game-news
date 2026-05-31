"use client";

import { useMemo, useState } from "react";
import type { EventItem } from "@/lib/api";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function typeClass(t: string): string {
  if (t === "점검" || t === "업데이트") return "ce-update";
  if (t === "방송") return "ce-live";
  if (t === "콜라보") return "ce-collab";
  return "ce-event";
}
function ymKey(y: number, m: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}`;
}

export default function CalendarView({ events }: { events: EventItem[] }) {
  const valid = useMemo(() => events.filter((e) => e.start), [events]);

  const initial = useMemo(() => {
    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);
    const upcoming = valid.map((e) => e.start as string).filter((d) => d >= todayISO).sort();
    const base = upcoming[0] || valid.map((e) => e.start as string).sort()[0];
    const d = base ? new Date(base + "T00:00:00") : today;
    return { y: d.getFullYear(), m: d.getMonth() };
  }, [valid]);

  const [cur, setCur] = useState(initial);

  const byDay = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    for (const e of valid) (map[e.start as string] ??= []).push(e);
    return map;
  }, [valid]);

  const cells = useMemo(() => {
    const first = new Date(cur.y, cur.m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
    const arr: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < startPad; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ day: d, iso: `${ymKey(cur.y, cur.m)}-${String(d).padStart(2, "0")}` });
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cur]);

  const todayISO = new Date().toISOString().slice(0, 10);
  const monthEventCount = Object.entries(byDay).filter(([d]) => d.startsWith(ymKey(cur.y, cur.m))).length;

  const move = (delta: number) => {
    const d = new Date(cur.y, cur.m + delta, 1);
    setCur({ y: d.getFullYear(), m: d.getMonth() });
  };

  const upcomingList = useMemo(
    () => valid.filter((e) => (e.start as string) >= todayISO).sort((a, b) => (a.start as string).localeCompare(b.start as string)),
    [valid, todayISO],
  );

  return (
    <div>
      <div className="cal-head">
        <button className="cal-nav" onClick={() => move(-1)} aria-label="이전 달">‹</button>
        <div className="cal-title">{cur.y}년 {cur.m + 1}월</div>
        <button className="cal-nav" onClick={() => move(1)} aria-label="다음 달">›</button>
        <span className="cal-count">이 달 일정 {monthEventCount}건</span>
      </div>

      <div className="card glass" style={{ padding: 16 }}>
        <div className="cal-grid">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={"cal-wd" + (i === 0 ? " sun" : i === 6 ? " sat" : "")}>{w}</div>
          ))}
          {cells.map((c, i) => (
            <div key={i} className={"cal-cell" + (!c ? " empty" : "") + (c && c.iso === todayISO ? " today" : "")}>
              {c && (
                <>
                  <span className="cal-day">{c.day}</span>
                  <div className="cal-evts">
                    {(byDay[c.iso] || []).map((e, j) => (
                      <span key={j} className={"cal-evt " + typeClass(e.type)} title={`${e.game ?? ""} · ${e.title}`}>
                        <span className="cal-evt-game">{e.game}</span>
                        <span className="cal-evt-title">{e.title}</span>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="cal-legend">
        <span><i className="ce-update" />점검·업데이트</span>
        <span><i className="ce-live" />방송</span>
        <span><i className="ce-collab" />콜라보</span>
        <span><i className="ce-event" />이벤트</span>
      </div>

      <section className="card glass reveal" style={{ padding: "20px 22px", marginTop: 28 }}>
        <div className="section-head"><h2 style={{ fontSize: "1.12rem" }}>다가오는 업데이트 일정</h2></div>
        {upcomingList.length === 0 ? (
          <p className="empty">예정된 일정이 없습니다.</p>
        ) : (
          <ul className="evts">
            {upcomingList.map((e, i) => (
              <li key={i} className="evt">
                <span className="evt-date">{e.date}</span>
                <span className="evt-main">
                  <span className="evt-title">{e.title}</span>
                  <span className="evt-tags">
                    {e.game && <span>{e.game}</span>}
                    {e.game && <span>·</span>}
                    <span>{e.type}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
