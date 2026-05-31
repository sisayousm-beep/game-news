"""뉴스 크롤 실행: 인벤 게임별 뉴스를 긁어 digest JSON으로 저장.

사용:  python -m scripts.crawl            # 인벤 지원 게임 전체
       python -m scripts.crawl nikke wuwa # 특정 게임만

출력: backend/data/digest_<날짜>.json  (Claude가 이 파일을 읽고 요약·적재)
"""

import json
import sys
from datetime import date
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.collectors import inven


def main():
    slugs = sys.argv[1:] or None
    print("인벤 뉴스 크롤 시작 …")
    digest = inven.crawl_all(slugs)
    out_dir = Path("data")
    out_dir.mkdir(exist_ok=True)
    f = out_dir / f"digest_{date.today().isoformat()}.json"
    f.write_text(json.dumps(digest, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(v) for v in digest.values())
    print(f"\n크롤 완료 — 게임 {len(digest)}종 · 기사 {total}건")
    print(f"digest 저장: {f.resolve()}")


if __name__ == "__main__":
    main()
