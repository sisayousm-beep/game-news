"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 디자인 시스템의 스크롤 인터랙션을 React로 이식.
 * - .reveal 요소를 스크롤 진입 시 순차 등장(.in)
 * - [data-fill] 막대(sentiment/heat)를 화면에 들어올 때 채움
 * - [data-clock] 마스트헤드 시계
 * 라우트가 바뀌면 새 DOM에 다시 적용한다. (logia.js 이식, 의존성 없음)
 */
export default function ClientFX() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    // ---- Stagger reveal on scroll ----
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((e) => e.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const group = el.closest<HTMLElement>("[data-stagger]");
            if (group && !(group as any).__staggered) {
              (group as any).__staggered = true;
              group.querySelectorAll<HTMLElement>(".reveal").forEach((k, i) =>
                k.style.setProperty("--rv-delay", i * 70 + "ms"),
              );
            }
            el.classList.add("in");
            io.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      reveals.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());
    }

    // ---- Animated fills (sentiment / heat) ----
    const bars = Array.from(document.querySelectorAll<HTMLElement>("[data-fill]"));
    if (bars.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            requestAnimationFrame(() => {
              el.style.width = (el.dataset.fill || "0") + "%";
            });
            io.unobserve(el);
          });
        },
        { threshold: 0.4 },
      );
      bars.forEach((b) => {
        b.style.width = "0%";
        io.observe(b);
      });
      cleanups.push(() => io.disconnect());
    }

    // ---- Live clock ----
    const clock = document.querySelector<HTMLElement>("[data-clock]");
    if (clock) {
      const tick = () => {
        const d = new Date();
        clock.textContent =
          String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      };
      tick();
      const id = window.setInterval(tick, 15000);
      cleanups.push(() => window.clearInterval(id));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
