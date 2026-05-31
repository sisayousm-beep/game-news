import { api } from "@/lib/api";
import CalendarView from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  const events = await api.calendar();
  return (
    <div>
      <div className="page-head reveal">
        <h1>이벤트 캘린더</h1>
        <span className="note">점검 · 업데이트 · 방송 · 콜라보 · 이벤트 일정</span>
      </div>
      {events.length === 0 ? (
        <p className="empty" style={{ marginTop: 20 }}>예정된 일정이 없습니다.</p>
      ) : (
        <CalendarView events={events} />
      )}
    </div>
  );
}
