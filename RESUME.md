# 작업 재개 노트 (RESUME)

세션이 끊기면 Claude Code를 다시 열고 **"RESUME.md 읽고 이어서 해줘"** 라고 하면 됩니다.

## ✅ 1차 구축 완료 (2026-05-31, 커밋 b348bfc)
백엔드·프론트엔드·수집·요약·적재 전부 실데이터로 검증 완료. 첫 편집판 발행됨.
이후 할 일 후보: Docker로 Postgres 전환, 갱신 자동화(A방식), 나머지 게임 확대, 원격 저장소 push.

---

## 프로젝트
게임 데일리 브리핑 정보 사이트 (LOGIA). 풀스택: Next.js + FastAPI + (Docker)PostgreSQL.
- 설계도: `설계도.json`
- 원본 프론트 디자인: `프론트엔드/logia/` (이걸 Next.js로 이식 중)
- AI 갱신 방식 = **B (Claude Code가 불러줄 때 수집·요약해 DB 적재)**. API키/자동스케줄 없음.

## 결정사항
- DB: 코드는 SQLite/PostgreSQL 둘 다 호환. 최종은 Docker+Postgres. (사용자가 Docker Desktop 설치 예정)
- 현재는 SQLite(`backend/data/logia.db`)로 동작/검증 중.

## 완료 (검증됨)
- [x] 스캐폴딩, git init, docker-compose.yml (postgres+redis)
- [x] 백엔드 전체: `backend/app/` (config/db/models/schemas/seed/main, routers/read,ingest, collectors/steam,community)
- [x] Steam 공식 API 수집 — 실제 가격 정상 (검증)
- [x] 커뮤니티(arca/dci) 수집 — 실제 글 제목 파싱 (검증)
- [x] 읽기 API(/api/front,game,steam,calendar,search,games,issues) + 적재 API(/api/ingest) — 검증
- 백엔드 실행: `cd backend && PYTHONUTF8=1 .venv/Scripts/python.exe -m uvicorn app.main:app --port 8000`
- 수집 실행: `cd backend && PYTHONUTF8=1 .venv/Scripts/python.exe -m scripts.collect`

## 진행 중 / 남은 일
- [ ] (TASK#5) 프론트엔드 Next.js 이식
  - 완료: package.json, tsconfig, next.config, globals.css(LOGIA CSS 이식), lib/api.ts
  - 남음: components(atoms/Masthead/TopNav), app/layout.tsx, app/page.tsx(front),
          app/game/[slug], app/steam-sales, app/calendar, app/search, app/archive
  - `npm install` 아직 안 함 → 설치 후 `npm run dev`로 확인 필요
- [ ] (TASK#6) 갱신 워크플로 문서화 + 첫 실제 데이터 수집·요약·적재 → 사이트에 표시
- [ ] README 설치 가이드, 최종 커밋/푸시(메모리: 작업 끝나면 커밋&푸시)

## 다음 즉시 할 일
components/atoms.tsx 부터 작성 → layout/nav → 각 페이지 → npm install → dev 서버 확인.
