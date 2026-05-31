import { api } from "@/lib/api";
import { SteamLine } from "@/components/atoms";

export const dynamic = "force-dynamic";

export default async function SteamSales() {
  const rows = await api.steam();
  const onSale = rows.filter((r) => r.disc > 0).length;
  return (
    <div>
      <div className="page-head reveal">
        <h1>스팀 할인 추적</h1>
        <span className="note">추적 {rows.length}종 · 할인 중 {onSale}종</span>
      </div>
      {rows.length === 0 ? (
        <p className="empty" style={{ marginTop: 20 }}>아직 수집된 가격 정보가 없습니다. 백엔드에서 수집을 실행하세요.</p>
      ) : (
        <div className="card glass reveal steam-list" style={{ marginTop: 20 }}>
          {rows.map((r, i) => <SteamLine key={i} r={r} />)}
        </div>
      )}
    </div>
  );
}
