"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { GameNav } from "@/lib/api";

// 게임별 도트 색 (디자인 시스템)
const DOT: Record<string, string> = {
  bluearchive: "#5DA2FF",
  nikke: "#FB6F8C",
  arknights: "#F5A524",
  starrail: "#7C5CFF",
  wuwa: "#18B7A6",
  duet: "#2F6BFF",
  silverpelis: "#9A6CFF",
  brown2: "#A9B4C4",
};

export default function TopNav({ games }: { games: GameNav[] }) {
  const path = usePathname();
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  const isActive = (slug: string | null) =>
    slug === null ? path === "/" : path === `/game/${slug}` || path.startsWith(`/game/${slug}/`);

  // 활성 탭 위로 pill 이동
  useEffect(() => {
    const move = () => {
      const row = rowRef.current;
      const pill = pillRef.current;
      if (!row || !pill) return;
      const active = row.querySelector<HTMLElement>(".gtab.is-active");
      if (!active) {
        pill.style.width = "0px";
        return;
      }
      pill.style.left = active.offsetLeft + "px";
      pill.style.width = active.offsetWidth + "px";
    };
    requestAnimationFrame(move);
    window.addEventListener("resize", move);
    if (document.fonts?.ready) document.fonts.ready.then(move);
    return () => window.removeEventListener("resize", move);
  }, [path, games]);

  return (
    <div className="gamenav">
      <div className="shell">
        <div className="row no-scrollbar" ref={rowRef}>
          <span className="gnav-pill" aria-hidden="true" ref={pillRef} />
          <Link className={"gtab" + (isActive(null) ? " is-active" : "")} href="/">
            전체
          </Link>
          {games.map((g) => (
            <Link
              key={g.slug}
              className={"gtab" + (isActive(g.slug) ? " is-active" : "")}
              href={`/game/${g.slug}`}
            >
              <span className="gdot" style={{ background: DOT[g.slug] || "var(--sky)" }} />
              {g.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
