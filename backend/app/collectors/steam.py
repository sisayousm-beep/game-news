"""Steam 공식 store API로 가격/할인/정가 수집.

검증됨: https://store.steampowered.com/api/appdetails?appids=<id>&cc=kr&l=korean
price_overview.{initial,final} 는 KRW의 경우 실제 금액 ×100 (예: 6600000 → ₩66,000).
미출시/무료/플랫폼 미지원 앱은 success=false 또는 price_overview 없음 → 건너뜀.
"""

import time

import requests

from ..db import SessionLocal
from .. import models as m

API = "https://store.steampowered.com/api/appdetails"
HEADERS = {"User-Agent": "Mozilla/5.0 (LOGIA price tracker)"}


def fetch_one(appid: int) -> dict | None:
    params = {"appids": appid, "cc": "kr", "l": "korean", "filters": "price_overview"}
    try:
        r = requests.get(API, params=params, headers=HEADERS, timeout=20)
        r.raise_for_status()
        node = r.json().get(str(appid), {})
        if not node.get("success"):
            return None
        po = (node.get("data") or {}).get("price_overview")
        if not po:
            return None  # 무료 또는 미출시
        return {
            "price": po["final"] // 100,
            "was": po["initial"] // 100,
            "disc": po.get("discount_percent", 0),
        }
    except Exception as e:  # 네트워크/파싱 오류는 해당 게임만 건너뜀
        print(f"  ! appid {appid} 실패: {e}")
        return None


def collect():
    """추적 목록 전체를 돌며 최신 가격 스냅샷을 steam_prices에 적재."""
    db = SessionLocal()
    n = 0
    try:
        for sg in db.query(m.SteamGame).all():
            data = fetch_one(sg.steam_appid)
            time.sleep(0.4)  # 예의상 레이트리밋
            if not data:
                print(f"  - {sg.name}: 가격 정보 없음(미출시/무료)")
                continue
            db.add(
                m.SteamPrice(
                    steam_game_id=sg.id,
                    price=data["price"],
                    was_price=data["was"],
                    discount_percent=data["disc"],
                    is_historical_low=False,  # ITAD 연동 시 보강
                )
            )
            n += 1
            print(f"  ✓ {sg.name}: ₩{data['price']:,} (−{data['disc']}%)")
        db.commit()
        print(f"스팀 수집 완료 — {n}종 가격 갱신")
    finally:
        db.close()


if __name__ == "__main__":
    collect()
