"""적재 API — 내가(Claude) 수집·요약한 하루치 편집판을 DB에 써넣는다.

POST /api/ingest  (헤더 X-Ingest-Token 필요)
같은 날짜로 다시 보내면 그 날 편집판을 통째로 교체(idempotent)한다.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from .. import models as m
from .. import schemas as s

router = APIRouter(prefix="/api", tags=["ingest"])


def _auth(token: str | None):
    if token != settings.ingest_token:
        raise HTTPException(401, "잘못된 ingest 토큰")


@router.post("/ingest")
def ingest(
    payload: s.IngestPayload,
    x_ingest_token: str | None = Header(None),
    db: Session = Depends(get_db),
):
    _auth(x_ingest_token)

    games_by_slug = {g.slug: g for g in db.query(m.Game).all()}

    # 1) 해당 날짜 편집판 확보 (있으면 기존 콘텐츠 정리)
    issue = db.query(m.Issue).filter(m.Issue.issue_date == payload.issue_date).first()
    if issue:
        db.query(m.Article).filter(m.Article.issue_id == issue.id).delete()
        db.query(m.GameBrief).filter(m.GameBrief.issue_id == issue.id).delete()
        db.query(m.Alert).filter(m.Alert.issue_id == issue.id).delete()
        db.query(m.Discussion).filter(m.Discussion.issue_id == issue.id).delete()
        # 이벤트는 아래에서 게임별로 교체한다
    else:
        last_no = db.query(m.Issue).order_by(desc(m.Issue.issue_no)).first()
        issue = m.Issue(issue_date=payload.issue_date, issue_no=(last_no.issue_no + 1) if last_no else 1)
        db.add(issue)
        db.flush()

    # 2) 1면 리드 + 리드 스토리
    issue.lede = payload.lede
    issue.lead_game = payload.lead.game
    issue.lead_headline = payload.lead.headline
    issue.lead_deck = payload.lead.deck
    issue.lead_body = "\n\n".join(payload.lead.body)
    issue.lead_source = payload.lead.source
    issue.lead_time = payload.lead.time
    issue.lead_image = payload.lead.image

    # 3) 게임별
    for ig in payload.games:
        g = games_by_slug.get(ig.slug)
        if not g:
            continue
        db.add(
            m.GameBrief(
                issue_id=issue.id, game_id=g.id, summary=ig.summary, image=ig.image,
                sent_pos=ig.sentiment.pos, sent_neu=ig.sentiment.neu, sent_neg=ig.sentiment.neg,
            )
        )
        for a in ig.news:
            db.add(
                m.Article(
                    game_id=g.id, issue_id=issue.id, source=a.source, title=a.title, url=a.url,
                    tag=a.tag, time_label=a.time, summary=a.summary,
                    image=(a.image or ig.image),  # 기사 전용 이미지 없으면 게임 대표 키비주얼
                    importance_score=a.imp,
                )
            )
        # 이벤트는 게임별로 교체(중복 누적 방지)
        db.query(m.Event).filter(m.Event.game_id == g.id).delete()
        for e in ig.events:
            db.add(
                m.Event(
                    game_id=g.id, title=e.title, start_date=e.start_date,
                    end_date=e.end_date, type=e.type, source_url=e.source_url,
                )
            )
        for inc in ig.incidents:
            db.add(m.Alert(issue_id=issue.id, game_id=g.id, game_name=g.name, title=inc.title, severity=inc.severity, heat=0))
        for d in ig.discussions:
            db.add(m.Discussion(game_id=g.id, issue_id=issue.id, topic=d.topic, sentiment=d.sentiment, summary=d.summary, source=d.source))

    # 4) 크로스 게임 알림
    for al in payload.alerts:
        db.add(m.Alert(issue_id=issue.id, game_name=al.game, title=al.title, severity=al.severity, heat=al.heat))

    db.commit()
    return {"ok": True, "issue_date": payload.issue_date.isoformat(), "issue_no": issue.issue_no}


@router.post("/character/ingest")
def ingest_character(
    payload: s.IngestCharacter,
    x_ingest_token: str | None = Header(None),
    db: Session = Depends(get_db),
):
    _auth(x_ingest_token)
    game = db.query(m.Game).filter(m.Game.slug == payload.game).first()
    if not game:
        raise HTTPException(404, f"게임 없음: {payload.game}")

    ch = (
        db.query(m.Character)
        .filter(m.Character.game_id == game.id, m.Character.slug == payload.slug)
        .first()
    )
    if not ch:
        ch = m.Character(game_id=game.id, slug=payload.slug)
        db.add(ch)
    ch.name = payload.name
    ch.name_en = payload.nameEn
    ch.rarity = payload.rarity
    ch.element = payload.element
    ch.weapon_type = payload.weapon_type
    ch.role = payload.role
    ch.image = payload.image
    ch.tagline = payload.tagline
    ch.overview = payload.overview
    ch.data = payload.data
    ch.updated_at = datetime.utcnow()
    db.commit()
    return {"ok": True, "game": payload.game, "slug": payload.slug}
