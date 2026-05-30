-- LOGIA 참고용 스키마 (실제 테이블은 backend/app/models.py 의 SQLAlchemy 가 생성).
-- PostgreSQL 기준. 아카이브/추이 추적을 위해 설계도 스키마에 issues·game_briefs·alerts 추가.

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(128) NOT NULL,
  name_en VARCHAR(128) DEFAULT '',
  pub VARCHAR(128) DEFAULT '',
  tier VARCHAR(32) DEFAULT '라이브',
  sort INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT now()
);

-- 하루치 편집판 (아카이브 단위)
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  issue_date DATE UNIQUE NOT NULL,
  issue_no INT DEFAULT 1,
  lede TEXT DEFAULT '',
  lead_game VARCHAR(128) DEFAULT '',
  lead_headline TEXT DEFAULT '',
  lead_deck TEXT DEFAULT '',
  lead_body TEXT DEFAULT '',
  lead_source VARCHAR(256) DEFAULT '',
  lead_time VARCHAR(64) DEFAULT '',
  published_at TIMESTAMP DEFAULT now()
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  game_id INT REFERENCES games(id),
  issue_id INT REFERENCES issues(id),
  source VARCHAR(64) DEFAULT '공식',
  title TEXT NOT NULL,
  url TEXT DEFAULT '',
  tag VARCHAR(32) DEFAULT '뉴스',
  time_label VARCHAR(32) DEFAULT '',
  summary TEXT DEFAULT '',
  importance_score INT DEFAULT 50,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  game_id INT REFERENCES games(id),
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  type VARCHAR(32) DEFAULT '이벤트',
  source_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT now()
);

-- 게임별 하루치 요약 + 여론 스냅샷 (날짜별 추이)
CREATE TABLE game_briefs (
  id SERIAL PRIMARY KEY,
  issue_id INT REFERENCES issues(id),
  game_id INT REFERENCES games(id),
  summary TEXT DEFAULT '',
  sent_pos INT DEFAULT 0,
  sent_neu INT DEFAULT 0,
  sent_neg INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (issue_id, game_id)
);

CREATE TABLE discussions (
  id SERIAL PRIMARY KEY,
  game_id INT REFERENCES games(id),
  issue_id INT REFERENCES issues(id),
  topic TEXT NOT NULL,
  sentiment VARCHAR(16) DEFAULT '중립',
  summary TEXT DEFAULT '',
  source VARCHAR(64) DEFAULT '',
  created_at TIMESTAMP DEFAULT now()
);

-- 주요 사건 감지 (game_id NULL = 1면 크로스게임 알림 / 값 있으면 게임별 사건)
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  issue_id INT REFERENCES issues(id),
  game_id INT REFERENCES games(id),
  game_name VARCHAR(128) DEFAULT '',
  title TEXT NOT NULL,
  severity VARCHAR(16) DEFAULT '관찰',
  heat INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE steam_games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  steam_appid INT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE steam_prices (
  id SERIAL PRIMARY KEY,
  steam_game_id INT REFERENCES steam_games(id),
  price INT DEFAULT 0,
  was_price INT DEFAULT 0,
  discount_percent INT DEFAULT 0,
  is_historical_low BOOLEAN DEFAULT false,
  ends_at VARCHAR(32) DEFAULT '',
  captured_at TIMESTAMP DEFAULT now()
);
