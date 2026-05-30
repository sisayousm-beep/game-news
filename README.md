# LOGIA — 게임 데일리 브리핑 허브

게임 관련 최신 뉴스·주요 사건·예정 이벤트·커뮤니티 반응·스팀 할인을 모아 정리하는 **정보 사이트**.

- **수집**: Steam 공식 API(가격/할인), 웹검색 기반 공식 뉴스, 아카라이브·디시 커뮤니티 글
- **요약·편집**: Claude Code(방식 B — 사용자가 "갱신해줘" 하면 그 자리에서 수집·요약·적재)
- **저장**: PostgreSQL(또는 SQLite) — 검색·날짜별 아카이브·가격 추이 추적
- **표시**: Next.js 신문형 UI(LOGIA)

> 트위터(X)는 무료로 본문 수집이 불가해 제외. 공식 뉴스는 검색/공식 포럼으로 대체한다.

## 구조
```
backend/    FastAPI + SQLAlchemy  (API + 수집기)
frontend/   Next.js (App Router, TypeScript)
database/   스키마 참고 DDL
docs/        갱신 워크플로, 적재 페이로드 예시
docker-compose.yml   PostgreSQL + Redis
```

## 빠른 시작 (로컬, 설치 최소)

### 1) 백엔드
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env          # 기본값은 SQLite — 그대로 실행 가능
.\.venv\Scripts\python.exe -m scripts.collect      # 시드 + 스팀 가격 수집
$env:PYTHONUTF8=1; .\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```
→ API: http://localhost:8000  (문서: http://localhost:8000/docs)

### 2) 프론트엔드
```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```
→ 사이트: http://localhost:3000

## PostgreSQL(Docker)로 전환
```powershell
docker compose up -d          # postgres + redis 기동
```
그리고 `backend/.env` 에서:
```
DATABASE_URL=postgresql+psycopg2://logia:logia@localhost:5432/logia
```
백엔드를 다시 실행하면 Postgres를 사용한다. (코드 변경 불필요)

## 매일 갱신하는 법
Claude Code에서 **"오늘 뉴스 갱신해줘"** → 자세한 절차는 [`docs/갱신_워크플로.md`](docs/갱신_워크플로.md).

## API 요약
| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/front?date=` | 1면(편집판). date 없으면 최신 |
| GET | `/api/game/{slug}?date=` | 게임별 페이지 |
| GET | `/api/steam` | 스팀 할인 보드 |
| GET | `/api/calendar` | 예정 이벤트 |
| GET | `/api/search?q=` | 제목/본문/태그 검색 |
| GET | `/api/issues` | 아카이브 날짜 목록 |
| POST | `/api/ingest` | 하루치 편집판 적재(헤더 `X-Ingest-Token`) |
