"use client";

import { useState } from "react";
import { api, type Article } from "@/lib/api";
import { NewsItem } from "@/components/atoms";
import ArticleModal from "@/components/ArticleModal";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<Article | null>(null);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      setResults(await api.search(q.trim()));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>검색</h1>
        <span className="note">제목 · 본문 · 태그</span>
      </div>

      <form className="search-box" onSubmit={run}>
        <input
          className="search-input"
          placeholder="키워드를 입력하세요 (예: 콜라보, 점검, 신규 캐릭터)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <button className="btn btn-primary" type="submit">검색</button>
      </form>

      {loading && <p className="empty">검색 중…</p>}
      {!loading && results !== null && (
        results.length === 0 ? (
          <p className="empty">“{q}” 검색 결과가 없습니다.</p>
        ) : (
          <>
            <p className="note" style={{ marginBottom: 8, color: "var(--muted)" }}>{results.length}건</p>
            <div className="news-list">
              {results.map((a, i) => <NewsItem key={i} a={a} onOpen={setOpen} />)}
            </div>
          </>
        )
      )}
      <ArticleModal a={open} onClose={() => setOpen(null)} />
    </div>
  );
}
