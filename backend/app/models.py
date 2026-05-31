from datetime import date, datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(128))
    name_en: Mapped[str] = mapped_column(String(128), default="")
    pub: Mapped[str] = mapped_column(String(128), default="")
    tier: Mapped[str] = mapped_column(String(32), default="라이브")
    sort: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Issue(Base):
    """하루치 편집판 (아카이브 단위)."""

    __tablename__ = "issues"

    id: Mapped[int] = mapped_column(primary_key=True)
    issue_date: Mapped[date] = mapped_column(Date, unique=True, index=True)
    issue_no: Mapped[int] = mapped_column(Integer, default=1)
    lede: Mapped[str] = mapped_column(Text, default="")
    # 1면 리드 스토리
    lead_game: Mapped[str] = mapped_column(String(128), default="")
    lead_headline: Mapped[str] = mapped_column(Text, default="")
    lead_deck: Mapped[str] = mapped_column(Text, default="")
    lead_body: Mapped[str] = mapped_column(Text, default="")  # 문단 \n\n 구분
    lead_source: Mapped[str] = mapped_column(String(256), default="")
    lead_time: Mapped[str] = mapped_column(String(64), default="")
    lead_image: Mapped[str] = mapped_column(Text, default="")  # 1면 키 비주얼 이미지 URL
    published_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    issue_id: Mapped[int | None] = mapped_column(ForeignKey("issues.id"), index=True, nullable=True)
    source: Mapped[str] = mapped_column(String(64), default="공식")
    title: Mapped[str] = mapped_column(Text)
    url: Mapped[str] = mapped_column(Text, default="")
    tag: Mapped[str] = mapped_column(String(32), default="뉴스")
    time_label: Mapped[str] = mapped_column(String(32), default="")  # "07:42"
    summary: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(Text, default="")  # 기사 키 비주얼 (없으면 게임 대표 이미지)
    importance_score: Mapped[int] = mapped_column(Integer, default=50)
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    game: Mapped[Game] = relationship()


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    title: Mapped[str] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date, index=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    type: Mapped[str] = mapped_column(String(32), default="이벤트")
    source_url: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    game: Mapped[Game] = relationship()


class GameBrief(Base):
    """게임별 하루치 요약 + 여론 스냅샷 (날짜별 추이 추적용)."""

    __tablename__ = "game_briefs"
    __table_args__ = (UniqueConstraint("issue_id", "game_id", name="uq_brief_issue_game"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    issue_id: Mapped[int] = mapped_column(ForeignKey("issues.id"), index=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    summary: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str] = mapped_column(Text, default="")  # 게임 대표 키 비주얼
    sent_pos: Mapped[int] = mapped_column(Integer, default=0)
    sent_neu: Mapped[int] = mapped_column(Integer, default=0)
    sent_neg: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    game: Mapped[Game] = relationship()


class Discussion(Base):
    """커뮤니티 반응 — 주요 의견."""

    __tablename__ = "discussions"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    issue_id: Mapped[int | None] = mapped_column(ForeignKey("issues.id"), index=True, nullable=True)
    topic: Mapped[str] = mapped_column(Text)
    sentiment: Mapped[str] = mapped_column(String(16), default="중립")  # 긍정/중립/부정
    summary: Mapped[str] = mapped_column(Text, default="")
    source: Mapped[str] = mapped_column(String(64), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Alert(Base):
    """주요 사건 감지 (크로스 게임)."""

    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(primary_key=True)
    issue_id: Mapped[int] = mapped_column(ForeignKey("issues.id"), index=True)
    game_id: Mapped[int | None] = mapped_column(ForeignKey("games.id"), nullable=True)
    game_name: Mapped[str] = mapped_column(String(128), default="")
    title: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(16), default="관찰")  # 주의/관찰
    heat: Mapped[int] = mapped_column(Integer, default=50)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Character(Base):
    """캐릭터 공략(빌드) 가이드. 스펙·무기·에코·세팅·종결 스탯 등은 data(JSON)에 담는다."""

    __tablename__ = "characters"
    __table_args__ = (UniqueConstraint("game_id", "slug", name="uq_char_game_slug"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"), index=True)
    slug: Mapped[str] = mapped_column(String(64), index=True)
    name: Mapped[str] = mapped_column(String(128))
    name_en: Mapped[str] = mapped_column(String(128), default="")
    rarity: Mapped[int] = mapped_column(Integer, default=5)
    element: Mapped[str] = mapped_column(String(32), default="")
    weapon_type: Mapped[str] = mapped_column(String(32), default="")
    role: Mapped[str] = mapped_column(String(64), default="")
    image: Mapped[str] = mapped_column(Text, default="")
    tagline: Mapped[str] = mapped_column(Text, default="")
    overview: Mapped[str] = mapped_column(Text, default="")
    data: Mapped[dict] = mapped_column(JSON, default=dict)  # weapons/echoes/stats/tiers/teams 등
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    game: Mapped["Game"] = relationship()


class SteamGame(Base):
    __tablename__ = "steam_games"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(256))
    steam_appid: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class SteamPrice(Base):
    __tablename__ = "steam_prices"

    id: Mapped[int] = mapped_column(primary_key=True)
    steam_game_id: Mapped[int] = mapped_column(ForeignKey("steam_games.id"), index=True)
    price: Mapped[int] = mapped_column(Integer, default=0)  # 현재가 (원, 정수)
    was_price: Mapped[int] = mapped_column(Integer, default=0)  # 정가
    discount_percent: Mapped[int] = mapped_column(Integer, default=0)
    is_historical_low: Mapped[bool] = mapped_column(Boolean, default=False)
    ends_at: Mapped[str] = mapped_column(String(32), default="")  # 할인 종료 라벨
    captured_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    steam_game: Mapped[SteamGame] = relationship()
