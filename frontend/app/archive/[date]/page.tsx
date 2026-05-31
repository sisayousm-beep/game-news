import Link from "next/link";
import { api } from "@/lib/api";
import FrontView from "@/components/FrontView";

export const dynamic = "force-dynamic";

export default async function ArchiveDate({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const D = await api.front(date);
  return (
    <div>
      <Link className="back" href="/archive">← 아카이브로</Link>
      <FrontView D={D} />
    </div>
  );
}
