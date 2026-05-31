"""API 입출력 스키마. 입력(Ingest*)은 내가 요약결과를 써넣을 때 쓴다."""

from datetime import date
from typing import Optional

from pydantic import BaseModel


# ---------- 출력 ----------
class Sentiment(BaseModel):
    pos: int = 0
    neu: int = 0
    neg: int = 0


class ArticleOut(BaseModel):
    title: str
    source: str
    url: str = ""
    tag: str = "뉴스"
    time: str = ""
    imp: int = 50
    summary: str = ""   # 웹 안에서 보여줄 본문 요약
    image: str = ""     # 기사 키 비주얼 URL


class EventOut(BaseModel):
    date: str  # "06.03"
    title: str
    type: str = "이벤트"
    game: Optional[str] = None
    start: str = ""  # ISO YYYY-MM-DD (달력용)
    end: str = ""    # ISO, 없으면 빈 문자열


class GameBriefOut(BaseModel):
    slug: str
    name: str
    nameEn: str = ""
    pub: str = ""
    tier: str = ""
    sentiment: Sentiment
    summary: str = ""
    image: str = ""     # 게임 대표 키 비주얼
    news: list[ArticleOut] = []
    events: list[EventOut] = []
    incidents: list["IncidentOut"] = []
    discussions: list["DiscussionOut"] = []


class IncidentOut(BaseModel):
    title: str
    severity: str = "관찰"


class DiscussionOut(BaseModel):
    topic: str
    sentiment: str = "중립"
    summary: str = ""
    source: str = ""


class AlertOut(BaseModel):
    game: str
    title: str
    severity: str = "관찰"
    heat: int = 50


class SteamRowOut(BaseModel):
    name: str
    price: str
    was: str
    disc: int
    low: bool
    ends: str


class LeadOut(BaseModel):
    game: str = ""
    kicker: str = "오늘의 1면"
    headline: str = ""
    deck: str = ""
    body: list[str] = []
    source: str = ""
    time: str = ""
    image: str = ""  # 키 비주얼 이미지 URL (없으면 빈 문자열)


class IssueMeta(BaseModel):
    title: str = "LOGIA"
    tagline: str = "게임 데일리 브리핑"
    issue: int = 1
    dateLong: str = ""
    dateShort: str = ""
    published: str = "오전 08:00 발행"
    edition: str = "조간"


class FrontPageOut(BaseModel):
    meta: IssueMeta
    lede: str = ""
    lead: LeadOut
    games: list[GameBriefOut] = []
    alerts: list[AlertOut] = []
    steam: list[SteamRowOut] = []


# ---------- 캐릭터 공략 ----------
class CharacterListItem(BaseModel):
    slug: str
    name: str
    nameEn: str = ""
    rarity: int = 5
    element: str = ""
    weapon_type: str = ""
    role: str = ""
    image: str = ""


class CharacterOut(CharacterListItem):
    game: str = ""
    gameName: str = ""
    tagline: str = ""
    overview: str = ""
    data: dict = {}


class IngestCharacter(BaseModel):
    game: str  # 게임 slug
    slug: str
    name: str
    nameEn: str = ""
    rarity: int = 5
    element: str = ""
    weapon_type: str = ""
    role: str = ""
    image: str = ""
    tagline: str = ""
    overview: str = ""
    data: dict = {}


# ---------- 입력 (Ingest) ----------
class IngestArticle(BaseModel):
    source: str = "공식"
    title: str
    url: str = ""
    tag: str = "뉴스"
    time: str = ""
    summary: str = ""
    image: str = ""
    imp: int = 50


class IngestEvent(BaseModel):
    title: str
    start_date: date
    end_date: Optional[date] = None
    type: str = "이벤트"
    source_url: str = ""


class IngestIncident(BaseModel):
    title: str
    severity: str = "관찰"


class IngestDiscussion(BaseModel):
    topic: str
    sentiment: str = "중립"
    summary: str = ""
    source: str = ""


class IngestGame(BaseModel):
    slug: str
    summary: str = ""
    image: str = ""     # 게임 대표 키 비주얼 (기사 이미지 폴백)
    sentiment: Sentiment
    news: list[IngestArticle] = []
    events: list[IngestEvent] = []
    incidents: list[IngestIncident] = []
    discussions: list[IngestDiscussion] = []


class IngestAlert(BaseModel):
    game: str
    title: str
    severity: str = "관찰"
    heat: int = 50


class IngestPayload(BaseModel):
    """하루치 편집판 전체를 한 번에 적재."""

    issue_date: date
    lede: str = ""
    lead: LeadOut
    games: list[IngestGame] = []
    alerts: list[IngestAlert] = []
