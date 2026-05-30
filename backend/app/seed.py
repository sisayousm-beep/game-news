"""테이블 생성 + 게임/스팀 추적목록 시드. 여러 번 실행해도 안전(중복 무시)."""

from .db import Base, SessionLocal, engine
from . import models as m

# (slug, 한글명, 영문명, 배급/개발, 등급)
GAMES = [
    ("bluearchive", "블루 아카이브", "Blue Archive", "넥슨 게임즈", "메인"),
    ("nikke", "승리의 여신: 니케", "NIKKE", "시프트업", "메인"),
    ("arknights", "명일방주", "Arknights", "Hypergryph", "메인"),
    ("starrail", "붕괴: 스타레일", "Honkai: Star Rail", "HoYoverse", "메인"),
    ("wuwa", "명조: 워더링 웨이브", "Wuthering Waves", "Kuro Games", "메인"),
    ("duet", "듀엣 나이트 어비스", "Duet Night Abyss", "Pan Studio", "신규"),
    ("silverpelis", "실버펠리스", "Silver Pelis", "—", "신규"),
    ("brown2", "브라운더스트2", "BrownDust 2", "네오위즈", "라이브"),
    # 확장 대상
    ("zzz", "젠레스 존 제로", "Zenless Zone Zero", "HoYoverse", "확장"),
    ("genshin", "원신", "Genshin Impact", "HoYoverse", "확장"),
    ("gfl2", "소녀전선2", "Girls' Frontline 2", "선본 네트워크", "확장"),
    ("trickcal", "트릭컬", "TRICKCAL", "에피드게임즈", "확장"),
    ("aethergazer", "에테르 게이저", "Aether Gazer", "Yostar", "확장"),
    ("mugmido", "무기미도", "Path to Nowhere", "AISNO Games", "확장"),
    ("counterside", "카운터사이드", "CounterSide", "나주", "확장"),
]

# (이름, steam_appid)  — 설계도 '스팀 할인 추적 대상'
STEAM_GAMES = [
    ("Sid Meier's Civilization VI", 289070),
    ("Sid Meier's Civilization VII", 1295660),
    ("NieR:Automata", 524220),
    ("Balatro", 2379780),
    ("DJMAX RESPECT V", 960170),
    ("Dave the Diver", 1868140),
    ("Metaphor: ReFantazio", 2679460),
    ("Split Fiction", 2001120),
    ("Monster Hunter Wilds", 2246340),
    ("Baldur's Gate 3", 1086940),
    ("Clair Obscur: Expedition 33", 1903340),
    ("Stellar Blade", 3489700),
    ("Core Keeper", 1621690),
    ("Factorio", 427520),
    ("Crimson Desert", 1591530),
    ("Pragmata", 2126160),
]


def run():
    Base.metadata.create_all(engine)
    db = SessionLocal()
    try:
        existing = {g.slug for g in db.query(m.Game).all()}
        for i, (slug, name, name_en, pub, tier) in enumerate(GAMES):
            if slug not in existing:
                db.add(m.Game(slug=slug, name=name, name_en=name_en, pub=pub, tier=tier, sort=i))

        existing_app = {s.steam_appid for s in db.query(m.SteamGame).all()}
        for name, appid in STEAM_GAMES:
            if appid not in existing_app:
                db.add(m.SteamGame(name=name, steam_appid=appid))

        db.commit()
        print(f"시드 완료 — 게임 {db.query(m.Game).count()}종, 스팀 {db.query(m.SteamGame).count()}종")
    finally:
        db.close()


if __name__ == "__main__":
    run()
