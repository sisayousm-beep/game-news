"use client";

import { useState } from "react";
import { api, type Article } from "@/lib/api";
import { NewsItem } from "@/components/atoms";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);

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
        <h1 className="page-title serif">검색</h1>
        <span className="page-note mono">제목 · 본문 · 태그</span>
      </div>

      <form className="search-box" onSubmit={run}>
        <input
          className="search-input"
          placeholder="키워드를 입력하세요 (예: 콜라보, 점검, 신규 캐릭터)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />
        <button className="search-btn mono" type="submit">검색</button>
      </form>

      {loading && <p className="empty mono">검색 중…</p>}
      {!loading && results !== null && (
        results.length === 0 ? (
          <p className="empty mono">“{q}” 검색 결과가 없습니다.</p>
        ) : (
          <>
            <p className="page-note mono" style={{ marginBottom: 12 }}>{results.length}건</p>
            <div className="news-list">
              {results.map((a, i) => <NewsItem key={i} a={a} />)}
            </div>
          </>
        )
      )}
    </div>
  );
}
