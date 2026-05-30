"""아카라이브 / 디시인사이드 인기글 제목 수집 (best-effort).

주의: 두 사이트는 안티봇·레이아웃 변경에 취약하다. 실패하면 빈 리스트를 돌려주고
넘어간다. 여기서 모은 '원본 글 제목'을 바탕으로 커뮤니티 여론을 요약한다(분석은 AI 단계).

게임 slug → (아카라이브 채널, 디시 갤러리 id, 디시 갤러리 타입)
"""

import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# 필요시 확장. 디시 type: "mgallery"(마이너) / "" (정식)
COMMUNITY_MAP = {
    "bluearchive": {"arca": "bluearchive", "dc": ("bluearchive", "mgallery")},
    "nikke": {"arca": "nikke", "dc": ("nikkimscompany", "mgallery")},
    "arknights": {"arca": "arknights", "dc": ("arknights", "mgallery")},
    "starrail": {"arca": "hkstarrail", "dc": ("hkstarrail", "mgallery")},
    "wuwa": {"arca": "wuthering", "dc": ("wutheringwaves", "mgallery")},
}


def fetch_arca(channel: str, limit: int = 15) -> list[dict]:
    url = f"https://arca.live/b/{channel}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")
        out = []
        for a in soup.select("a.title.hybrid-title, a.vrow-title, .vrow .title"):
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if title and len(title) > 1:
                out.append({"title": title, "url": "https://arca.live" + href})
            if len(out) >= limit:
                break
        return out
    except Exception as e:
        print(f"  ! 아카라이브 {channel} 실패: {e}")
        return []


def fetch_dc(gall_id: str, gtype: str = "mgallery", limit: int = 15) -> list[dict]:
    base = "https://gall.dcinside.com"
    path = f"/mgallery/board/lists/" if gtype == "mgallery" else "/board/lists/"
    url = f"{base}{path}?id={gall_id}&exception_mode=recommend"  # 개념글
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")
        out = []
        for a in soup.select("td.gall_tit a"):
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if title and not href.startswith("javascript"):
                out.append({"title": title, "url": base + href})
            if len(out) >= limit:
                break
        return out
    except Exception as e:
        print(f"  ! 디시 {gall_id} 실패: {e}")
        return []


def collect_for(slug: str) -> dict:
    """게임 하나의 커뮤니티 인기글 제목을 모아 돌려준다."""
    cfg = COMMUNITY_MAP.get(slug)
    if not cfg:
        return {"arca": [], "dc": []}
    arca = fetch_arca(cfg["arca"]) if cfg.get("arca") else []
    dc = fetch_dc(*cfg["dc"]) if cfg.get("dc") else []
    return {"arca": arca, "dc": dc}


if __name__ == "__main__":
    import json
    import sys

    slug = sys.argv[1] if len(sys.argv) > 1 else "bluearchive"
    print(json.dumps(collect_for(slug), ensure_ascii=False, indent=2))
