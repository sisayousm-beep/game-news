import { api } from "@/lib/api";
import { SteamBoard } from "@/components/atoms";

export const dynamic = "force-dynamic";

export default async function SteamSales() {
  const rows = await api.steam();
  const onSale = rows.filter((r) => r.disc > 0).length;
  return (
    <div>
      <div className="page-head">
        <h1 className="page-title serif">스팀 할인 추적</h1>
        <span className="page-note mono">추적 {rows.length}종 · 할인 중 {onSale}종</span>
      </div>
      {rows.length === 0 ? (
        <p className="empty mono">아직 수집된 가격 정보가 없습니다. 백엔드에서 수집을 실행하세요.</p>
      ) : (
        <SteamBoard rows={rows} />
      )}
    </div>
  );
}
