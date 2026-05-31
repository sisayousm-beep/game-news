"use client";

import { useEffect } from "react";
import type { Article } from "@/lib/api";
import { SourceDot, Tag } from "@/components/atoms";

export default function ArticleModal({ a, onClose }: { a: Article | null; onClose: () => void }) {
  useEffect(() => {
    if (!a) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [a, onClose]);

  if (!a) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close mono" onClick={onClose} aria-label="닫기">✕</button>

        {a.image && (
          <div className="modal-photo">
            <img src={a.image} alt="" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="modal-content">
          <div className="modal-meta mono">
            <SourceDot source={a.source} />
            <span>{a.source}</span>
            <span className="sep">·</span>
            <span>{a.time}</span>
            <Tag accent={a.tag === "이벤트" || a.tag === "신규캐릭터"}>{a.tag}</Tag>
          </div>

          <h2 className="modal-title serif">{a.title}</h2>

          <p className="modal-summary">
            {a.summary || "이 소식에 대한 상세 요약이 아직 준비되지 않았습니다."}
          </p>

          {a.url && (
            <a className="modal-src mono" href={a.url} target="_blank" rel="noreferrer">
              원문 보기 ↗
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
