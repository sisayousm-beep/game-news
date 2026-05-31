import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}년 ${m}월 ${d}일`;
}

export default async function Archive() {
  const dates = await api.issues();
  return (
    <div>
      <div className="page-head reveal">
        <h1>아카이브</h1>
        <span className="note">발행 {dates.length}판</span>
      </div>
      {dates.length === 0 ? (
        <p className="empty" style={{ marginTop: 20 }}>아직 발행된 편집판이 없습니다.</p>
      ) : (
        <ul className="archive-list">
          {dates.map((iso) => (
            <li key={iso} className="card glass lift reveal archive-row">
              <Link href={`/archive/${iso}`} className="archive-date">{fmt(iso)}</Link>
              <span className="archive-meta">{iso}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
