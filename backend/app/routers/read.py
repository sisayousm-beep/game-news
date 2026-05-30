"""프론트엔드가 읽는 GET API. 모든 데이터는 DB에서 조립한다."""

from datetime import date as date_cls

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import desc
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models as m
from .. import schemas as s

router = APIRouter(prefix="/api", tags=["read"])


# ---------- helpers ----------
def won(n: int) -> str:
    return f"₩{n:,}" if n else "—"


def md(d: date_cls) -> str:
    return f"{d.month:02d}.{d.day:02d}"


def latest_issue(db: Session, on: date_cls | None) -> m.Issue | None:
    q = db.query(m.Issue)
    if on:
        return q.filter(m.Issue.issue_date == on).first()
    return q.order_by(desc(m.Issue.issue_date)).first()


def steam_rows(db: Session) -> list[s.SteamRowOut]:
    rows = []
    for sg in db.query(m.SteamGame).all():
        p = (
            db.query(m.SteamPrice)
            .filter(m.SteamPrice.steam_game_id == sg.id)
            .order_by(desc(m.SteamPrice.captured_at))
            .first()
        )
        if not p:
            continue
        rows.append(
            s.SteamRowOut(
                name=sg.name,
                price=won(p.price),
                was=won(p.was_price),
                disc=p.discount_percent,
                low=p.is_historical_low,
                ends=p.ends_at or "—",
            )
        )
    # 할인율 높은 순
    rows.sort(key=lambda r: r.disc, reverse=True)
    return rows


def game_brief(db: Session, game: m.Game, issue: m.Issue) -> s.GameBriefOut:
    brief = (
        db.query(m.GameBrief)
        .filter(m.GameBrief.issue_id == issue.id, m.GameBrief.game_id == game.id)
        .first()
    )
    sent = s.Sentiment(
        pos=brief.sent_pos if brief else 0,
        neu=brief.sent_neu if brief else 0,
        neg=brief.sent_neg if brief else 0,
    )
    arts = (
        db.query(m.Article)
        .filter(m.Article.issue_id == issue.id, m.Article.game_id == game.id)
        .order_by(desc(m.Article.importance_score))
        .all()
    )
    news = [
        s.ArticleOut(title=a.title, source=a.source, url=a.url, tag=a.tag, time=a.time_label, imp=a.importance_score)
        for a in arts
    ]
    # 예정 이벤트(오늘 이후 우선)
    evs = (
        db.query(m.Event)
        .filter(m.Event.game_id == game.id)
        .order_by(m.Event.start_date)
        .all()
    )
    events = [s.EventOut(date=md(e.start_date), title=e.title, type=e.type) for e in evs]
    incs = (
        db.query(m.Alert)
        .filter(m.Alert.issue_id == issue.id, m.Alert.game_id == game.id)
        .all()
    )
    incidents = [s.IncidentOut(title=i.title, severity=i.severity) for i in incs]
    discs = (
        db.query(m.Discussion)
        .filter(m.Discussion.issue_id == issue.id, m.Discussion.game_id == game.id)
        .all()
    )
    discussions = [
        s.DiscussionOut(topic=d.topic, sentiment=d.sentiment, summary=d.summary, source=d.source)
        for d in discs
    ]
    return s.GameBriefOut(
        slug=game.slug,
        name=game.name,
        nameEn=game.name_en,
        pub=game.pub,
        tier=game.tier,
        sentiment=sent,
        summary=brief.summary if brief else "",
        news=news,
        events=events,
        incidents=incidents,
        discussions=discussions,
    )


# ---------- endpoints ----------
@router.get("/games")
def list_games(db: Session = Depends(get_db)):
    """네비게이션용 게임 목록."""
    games = db.query(m.Game).order_by(m.Game.sort).all()
    return [{"slug": g.slug, "name": g.name, "tier": g.tier} for g in games]


@router.get("/issues", response_model=list[str])
def list_issues(db: Session = Depends(get_db)):
    """아카이브용 — 발행된 날짜 목록(최신순)."""
    rows = db.query(m.Issue.issue_date).order_by(desc(m.Issue.issue_date)).all()
    return [r[0].isoformat() for r in rows]


@router.get("/front", response_model=s.FrontPageOut)
def front_page(
    date: date_cls | None = Query(None, description="YYYY-MM-DD, 없으면 최신"),
    db: Session = Depends(get_db),
):
    issue = latest_issue(db, date)
    games = db.query(m.Game).order_by(m.Game.sort).all()
    if not issue:
        # 아직 발행본이 없으면 게임 목록만이라도 내려준다
        meta = s.IssueMeta()
        return s.FrontPageOut(
            meta=meta,
            lede="아직 발행된 브리핑이 없습니다. 수집·요약을 실행해 주세요.",
            lead=s.LeadOut(),
            games=[
                s.GameBriefOut(
                    slug=g.slug, name=g.name, nameEn=g.name_en, pub=g.pub, tier=g.tier,
                    sentiment=s.Sentiment(),
                )
                for g in games
            ],
            alerts=[],
            steam=steam_rows(db),
        )

    # 브리핑이 있는 게임만 1면에 노출
    briefs = []
    for g in games:
        gb = game_brief(db, g, issue)
        if gb.news or gb.summary:
            briefs.append(gb)

    alerts = [
        s.AlertOut(game=a.game_name, title=a.title, severity=a.severity, heat=a.heat)
        for a in db.query(m.Alert)
        .filter(m.Alert.issue_id == issue.id, m.Alert.game_id.is_(None))
        .order_by(desc(m.Alert.heat))
        .all()
    ]
    meta = s.IssueMeta(
        issue=issue.issue_no,
        dateLong=issue.issue_date.strftime("%Y년 %m월 %d일"),
        dateShort=issue.issue_date.strftime("%Y.%m.%d"),
    )
    lead = s.LeadOut(
        game=issue.lead_game,
        headline=issue.lead_headline,
        deck=issue.lead_deck,
        body=[p for p in issue.lead_body.split("\n\n") if p.strip()],
        source=issue.lead_source,
        time=issue.lead_time,
    )
    return s.FrontPageOut(
        meta=meta, lede=issue.lede, lead=lead, games=briefs, alerts=alerts, steam=steam_rows(db)
    )


@router.get("/game/{slug}", response_model=s.GameBriefOut)
def game_page(slug: str, date: date_cls | None = Query(None), db: Session = Depends(get_db)):
    game = db.query(m.Game).filter(m.Game.slug == slug).first()
    if not game:
        raise HTTPException(404, "게임을 찾을 수 없습니다")
    issue = latest_issue(db, date)
    if not issue:
        return s.GameBriefOut(
            slug=game.slug, name=game.name, nameEn=game.name_en, pub=game.pub,
            tier=game.tier, sentiment=s.Sentiment(),
        )
    return game_brief(db, game, issue)


@router.get("/steam", response_model=list[s.SteamRowOut])
def steam_sales(db: Session = Depends(get_db)):
    return steam_rows(db)


@router.get("/calendar", response_model=list[s.EventOut])
def calendar(db: Session = Depends(get_db)):
    rows = (
        db.query(m.Event, m.Game.name)
        .join(m.Game, m.Event.game_id == m.Game.id)
        .order_by(m.Event.start_date)
        .all()
    )
    return [s.EventOut(date=md(e.start_date), title=e.title, type=e.type, game=gname) for e, gname in rows]


@router.get("/search", response_model=list[s.ArticleOut])
def search(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    like = f"%{q}%"
    rows = (
        db.query(m.Article)
        .filter((m.Article.title.ilike(like)) | (m.Article.summary.ilike(like)) | (m.Article.tag.ilike(like)))
        .order_by(desc(m.Article.created_at))
        .limit(50)
        .all()
    )
    return [
        s.ArticleOut(title=a.title, source=a.source, url=a.url, tag=a.tag, time=a.time_label, imp=a.importance_score)
        for a in rows
    ]
