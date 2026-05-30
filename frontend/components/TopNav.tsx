"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { GameNav } from "@/lib/api";

export default function TopNav({ games }: { games: GameNav[] }) {
  const path = usePathname();
  const isGame = (slug: string) => path === `/game/${slug}`;

  return (
    <nav className="gnav">
      <div className="gnav-inner">
        <Link className={"gnav-item is-home" + (path === "/" ? " active" : "")} href="/">전체</Link>
        {games.map((g) => (
          <Link
            key={g.slug}
            className={"gnav-item" + (isGame(g.slug) ? " active" : "")}
            href={`/game/${g.slug}`}
          >
            {g.name}
          </Link>
        ))}
        <span className="gnav-spacer" />
        <Link className={"gnav-item is-sec" + (path === "/steam-sales" ? " active" : "")} href="/steam-sales">스팀 할인</Link>
        <Link className={"gnav-item is-sec" + (path === "/calendar" ? " active" : "")} href="/calendar">이벤트</Link>
      </div>
    </nav>
  );
}
