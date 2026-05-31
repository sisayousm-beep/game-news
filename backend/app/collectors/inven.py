"""인벤 게임별 뉴스 크롤러 (잘 긁히는 소스).

인벤은 게임마다 `?site=<코드>` 뉴스 리스트를 서버사이드 HTML로 제공한다(안티봇/JS 없음).
각 기사 행은 div.content 안에 제목 링크 + span.info(기자·날짜)를 담고 있다.
여기서 제목/URL/날짜를 긁고, 선택 기사는 og:image·og:description으로 보강한다.

이 크롤러의 출력(digest)을 보고 Claude가 요약·선별·적재한다 → 매번 웹검색하지 않아 토큰 절약.
인벤에 섹션이 없는 게임(실버 팰리스 등)·자잘한 소스는 기존 방식(웹검색) 유지.
"""

import re
import time
from datetime import datetime, timedelta

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# 게임 slug → 인벤 site 코드.
# 주의: `?site=<코드>`는 *전용 포털이 있는 게임*만 게임별 뉴스를 준다(나머지는 인벤 전체
# 일반뉴스를 그대로 노출 → 게임 무관). 확인 결과 nikke만 게임 전용 기사 반환.
# arknights/wuwa/starrail/brown2 등은 일반뉴스라 제외 → 이들은 웹검색 방식 유지.
SITE_CODES = {
    "nikke": "nikke",
}

_DATE_RE = re.compile(r"(20\d\d-\d\d-\d\d)\s+(\d\d:\d\d)")


def list_articles(slug: str, days: int = 14, limit: int = 8) -> list[dict]:
    """게임 뉴스 리스트에서 최근 기사(title/url/date)를 긁는다."""
    code = SITE_CODES.get(slug)
    if not code:
        return []
    url = f"https://www.inven.co.kr/webzine/news/?site={code}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
    except Exception as e:
        print(f"  ! 인벤 {slug} 리스트 실패: {e}")
        return []

    soup = BeautifulSoup(r.text, "lxml")
    cutoff = datetime.now() - timedelta(days=days)
    out = []
    seen = set()
    for c in soup.select("div.content"):
        a = c.find("a", href=re.compile(r"news=\d+"))
        info = c.find("span", class_="info")
        if not a or not info:
            continue
        title = a.get_text(strip=True)
        href = a["href"]
        m = _DATE_RE.search(info.get_text(" ", strip=True))
        if not title or not m or href in seen:
            continue
        dt = datetime.strptime(f"{m.group(1)} {m.group(2)}", "%Y-%m-%d %H:%M")
        if dt < cutoff:
            continue
        seen.add(href)
        out.append({
            "title": title,
            "url": href if href.startswith("http") else "https://www.inven.co.kr" + href,
            "date": m.group(1),
            "time": m.group(2),
            "source": "인벤",
        })
        if len(out) >= limit:
            break
    return out


def enrich(article: dict) -> dict:
    """기사 페이지에서 og:image·og:description 보강."""
    try:
        r = requests.get(article["url"], headers=HEADERS, timeout=20)
        soup = BeautifulSoup(r.text, "lxml")
        og = lambda p: (soup.find("meta", property=p) or {}).get("content", "") if soup.find("meta", property=p) else ""
        article["image"] = og("og:image")
        article["snippet"] = (og("og:description") or "").strip()[:400]
    except Exception as e:
        print(f"  ! 보강 실패 {article['url']}: {e}")
        article.setdefault("image", "")
        article.setdefault("snippet", "")
    return article


def crawl_game(slug: str, days: int = 14, limit: int = 6, enrich_top: int = 6) -> list[dict]:
    arts = list_articles(slug, days=days, limit=limit)
    for a in arts[:enrich_top]:
        enrich(a)
        time.sleep(0.3)
    return arts


def crawl_all(slugs: list[str] | None = None) -> dict:
    slugs = slugs or list(SITE_CODES.keys())
    digest = {}
    for slug in slugs:
        if slug not in SITE_CODES:
            continue
        items = crawl_game(slug)
        digest[slug] = items
        print(f"  ✓ {slug}: {len(items)}건")
    return digest


if __name__ == "__main__":
    import json
    import sys

    slugs = sys.argv[1:] or None
    print(json.dumps(crawl_all(slugs), ensure_ascii=False, indent=2))
