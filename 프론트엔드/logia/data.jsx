// LOGIA — mock newsroom data. Fictional but plausible. All exposed on window.
const LOGIA_DATA = {
  meta: {
    title: "LOGIA",
    tagline: "하루 한 번 읽는 게임 신문",
    issue: 312,
    dateLong: "2026년 5월 31일 토요일",
    dateShort: "2026.05.31",
    weekday: "SAT",
    published: "오전 08:00 발행",
    edition: "조간",
  },

  // 편집장의 한마디 — 1면 상단 리드
  lede:
    "오늘 아침 게임가의 화두는 단연 ‘대규모 밸런스 개편’이다. 블루 아카이브의 신규 총력전 변경안이 커뮤니티를 양분했고, 명일방주는 4주년 로드맵을 예고했다. 스팀에서는 발더스 게이트 3와 발라트로가 역대 최저가를 새로 썼다. 주말을 앞둔 오늘, 8종의 라이브 서비스 게임에서 32건의 소식이 포착됐다.",

  games: [
    {
      slug: "bluearchive",
      name: "블루 아카이브",
      nameEn: "Blue Archive",
      pub: "넥슨 게임즈",
      tier: "메인",
      sentiment: { pos: 62, neu: 25, neg: 13 },
      summary:
        "오늘 블루 아카이브는 신규 이벤트 발표가 가장 큰 화제였다. 신규 학생 공개에 대한 반응은 긍정적이며, 총력전 변경안에 대해서는 일부 논란이 존재한다. 다음 주요 일정은 6월 3일 업데이트 점검이다.",
      news: [
        { title: "신규 이벤트 ‘여름의 끝, 약속의 네뷸라’ 6월 3일 시작", source: "공식", time: "07:42", tag: "이벤트", imp: 92 },
        { title: "신규 ★3 학생 ‘미사키(수영복)’ 티저 공개", source: "공식 X", time: "06:15", tag: "신규캐릭터", imp: 88 },
        { title: "총력전 ‘페로로지라’ 보상 테이블 조정안 사전 안내", source: "공식", time: "05:50", tag: "패치", imp: 81 },
        { title: "아카라이브 — 신규 학생 일러 호평, “올해 최고 디자인” 반응", source: "아카라이브", time: "02:10", tag: "커뮤니티", imp: 64 },
        { title: "디시 — 총력전 변경안 두고 “보상 감소” 갑론을박", source: "디시인사이드", time: "01:35", tag: "커뮤니티", imp: 58 },
      ],
      incidents: [
        { title: "신규 총력전 보상 감소 논란", severity: "주의" },
      ],
      events: [
        { date: "06.03", title: "정기 업데이트 점검", type: "점검" },
        { date: "06.05", title: "공식 방송 ‘블루 라디오’", type: "방송" },
        { date: "06.12", title: "여름 이벤트 2부 개방", type: "이벤트" },
      ],
    },
    {
      slug: "nikke",
      name: "승리의 여신: 니케",
      nameEn: "NIKKE",
      pub: "시프트업",
      tier: "메인",
      sentiment: { pos: 71, neu: 19, neg: 10 },
      summary:
        "니케는 신규 SSR ‘신더’ 성능 공개로 화제다. 2.5주년 콜라보 떡밥이 돌며 기대감이 높고, 픽업 확률 관련 불만은 소수에 그쳤다.",
      news: [
        { title: "2.5주년 기념 신규 SSR ‘신더’ 스킬 전체 공개", source: "공식", time: "07:20", tag: "신규캐릭터", imp: 90 },
        { title: "외부 IP 콜라보 6월 중순 발표 예고", source: "공식 X", time: "06:40", tag: "콜라보", imp: 86 },
        { title: "스토리 16장 후반부 6월 10일 추가", source: "공식", time: "05:30", tag: "로드맵", imp: 72 },
        { title: "아카라이브 — “신더 화력 1티어” 시뮬 결과 공유", source: "아카라이브", time: "03:05", tag: "커뮤니티", imp: 61 },
      ],
      incidents: [],
      events: [
        { date: "06.06", title: "2.5주년 기념 방송", type: "방송" },
        { date: "06.10", title: "스토리 16장 후반 업데이트", type: "업데이트" },
      ],
    },
    {
      slug: "arknights",
      name: "명일방주",
      nameEn: "Arknights",
      pub: "Hypergryph",
      tier: "메인",
      sentiment: { pos: 55, neu: 30, neg: 15 },
      summary:
        "명일방주는 4주년 로드맵 예고가 핵심이다. 신규 한정 오퍼레이터 떡밥과 함께 통합전략 신규 테마가 공개될 전망이며, 일부는 일정 과밀을 우려한다.",
      news: [
        { title: "4주년 기념 로드맵 ‘티저 PV’ 공개 — 신규 통합전략 암시", source: "공식 X", time: "07:05", tag: "로드맵", imp: 89 },
        { title: "신규 한정 ★6 오퍼레이터 실루엣 공개", source: "공식", time: "06:25", tag: "신규캐릭터", imp: 80 },
        { title: "위기협약 신규 시즌 ‘파인우드’ 6월 7일 개막", source: "공식", time: "05:10", tag: "이벤트", imp: 74 },
        { title: "디시 — 4주년 일정 과밀 “번아웃” 우려글 화제", source: "디시인사이드", time: "00:55", tag: "커뮤니티", imp: 52 },
      ],
      incidents: [
        { title: "4주년 일정 과밀 피로도 논의", severity: "관찰" },
      ],
      events: [
        { date: "06.07", title: "위기협약 ‘파인우드’ 개막", type: "이벤트" },
        { date: "06.14", title: "4주년 공식 생방송", type: "방송" },
      ],
    },
    {
      slug: "starrail",
      name: "붕괴: 스타레일",
      nameEn: "Honkai: Star Rail",
      pub: "HoYoverse",
      tier: "메인",
      sentiment: { pos: 48, neu: 28, neg: 24 },
      summary:
        "스타레일은 3.3 버전 생방송 코드와 신규 캐릭터 픽업이 화제지만, 파밍 피로도와 ‘파워 인플레이션’에 대한 부정 여론이 평소보다 높다.",
      news: [
        { title: "3.3 버전 ‘별의 바다’ 특별 생방송 6월 1일 진행", source: "공식", time: "07:30", tag: "방송", imp: 85 },
        { title: "신규 5성 ‘아글라이아’ 픽업 1차 일정 공개", source: "공식", time: "06:50", tag: "신규캐릭터", imp: 83 },
        { title: "신규 모의우주 ‘차분단멸’ 메커니즘 사전 공개", source: "공식", time: "05:45", tag: "패치", imp: 70 },
        { title: "디시 — “유물 파밍 피로도” 성토글 추천글 등극", source: "디시인사이드", time: "01:20", tag: "커뮤니티", imp: 57 },
      ],
      incidents: [
        { title: "파워 인플레이션·파밍 피로 부정 여론 상승", severity: "주의" },
      ],
      events: [
        { date: "06.01", title: "3.3 특별 생방송", type: "방송" },
        { date: "06.04", title: "3.3 버전 업데이트", type: "업데이트" },
      ],
    },
    {
      slug: "wuwa",
      name: "명조: 워더링 웨이브",
      nameEn: "Wuthering Waves",
      pub: "Kuro Games",
      tier: "메인",
      sentiment: { pos: 66, neu: 22, neg: 12 },
      summary:
        "명조는 2.4 버전 신규 지역 ‘리나시타 항구’ 공개로 기대감이 높다. 최적화 개선 패치가 호평받으며 복귀 유저 유입이 관측된다.",
      news: [
        { title: "2.4 버전 신규 지역 ‘리나시타 항구’ 선행 공개", source: "공식", time: "07:15", tag: "로드맵", imp: 84 },
        { title: "신규 5성 공명자 ‘카르티시아’ 데모 영상", source: "공식 X", time: "06:30", tag: "신규캐릭터", imp: 79 },
        { title: "PC 최적화 핫픽스 — 평균 프레임 18% 개선", source: "공식", time: "04:40", tag: "패치", imp: 68 },
      ],
      incidents: [],
      events: [
        { date: "06.09", title: "2.4 버전 업데이트", type: "업데이트" },
        { date: "06.02", title: "2.4 공식 방송", type: "방송" },
      ],
    },
    {
      slug: "duet",
      name: "듀엣 나이트 어비스",
      nameEn: "Duet Night Abyss",
      pub: "Pan Studio",
      tier: "신규",
      sentiment: { pos: 58, neu: 31, neg: 11 },
      summary:
        "듀엣 나이트 어비스는 2차 CBT 일정 확정이 핵심 소식이다. 전투 액션성에 대한 기대평이 다수이며, 과금 모델에 대한 신중론이 공존한다.",
      news: [
        { title: "2차 CBT 6월 20일 개시 — 사전 신청 오픈", source: "공식", time: "07:00", tag: "이벤트", imp: 77 },
        { title: "신규 플레이어블 ‘버크홀츠’ 액션 트레일러", source: "공식 X", time: "06:10", tag: "신규캐릭터", imp: 70 },
        { title: "아카라이브 — CBT 빌드 타격감 호평 다수", source: "아카라이브", time: "02:40", tag: "커뮤니티", imp: 55 },
      ],
      incidents: [],
      events: [
        { date: "06.20", title: "2차 CBT 시작", type: "이벤트" },
      ],
    },
    {
      slug: "silverpelis",
      name: "실버펠리스",
      nameEn: "Silver Pelis",
      pub: "—",
      tier: "신규",
      sentiment: { pos: 51, neu: 38, neg: 11 },
      summary:
        "실버펠리스는 출시 전 캐릭터 PV 공개가 이어지며 인지도 상승 구간이다. 아트 스타일 호평이 우세하나 정식 출시일 미정에 대한 갈증이 있다.",
      news: [
        { title: "메인 캐릭터 PV 3종 동시 공개", source: "공식 X", time: "06:55", tag: "신규캐릭터", imp: 66 },
        { title: "쇼케이스 ‘실버 라이브’ 6월 18일 개최 확정", source: "공식", time: "05:20", tag: "방송", imp: 60 },
      ],
      incidents: [],
      events: [
        { date: "06.18", title: "쇼케이스 ‘실버 라이브’", type: "방송" },
      ],
    },
    {
      slug: "brown2",
      name: "브라운더스트2",
      nameEn: "BrownDust 2",
      pub: "네오위즈",
      tier: "라이브",
      sentiment: { pos: 64, neu: 26, neg: 10 },
      summary:
        "브라운더스트2는 신규 시즌 팩과 외부 콜라보 종료 임박이 화제다. 시나리오 호평이 이어지며 충성 유저층의 만족도가 높다.",
      news: [
        { title: "신규 시즌 ‘심연의 무도회’ 1부 6월 4일 개막", source: "공식", time: "07:10", tag: "이벤트", imp: 73 },
        { title: "진행 중 콜라보 6월 8일 종료 — 막판 픽업 안내", source: "공식", time: "06:05", tag: "콜라보", imp: 67 },
        { title: "아카라이브 — 신규 시즌 시나리오 “수작” 평", source: "아카라이브", time: "03:30", tag: "커뮤니티", imp: 54 },
      ],
      incidents: [],
      events: [
        { date: "06.04", title: "신규 시즌 1부 개막", type: "이벤트" },
        { date: "06.08", title: "콜라보 종료", type: "이벤트" },
      ],
    },
  ],

  // 1면 리드 스토리 (크로스 게임 헤드라인)
  lead: {
    game: "블루 아카이브",
    kicker: "오늘의 1면",
    headline: "블루 아카이브, 신규 총력전 개편안 두고 커뮤니티 양분",
    deck:
      "넥슨 게임즈가 6월 3일 적용 예정인 총력전 ‘페로로지라’ 보상 테이블 조정안을 사전 공개했다. 신규 이벤트와 ★3 학생 공개에는 호평이 쏟아졌지만, 보상 구조 변경에는 “하향”이라는 반발이 맞붙으며 하루 종일 화력이 집중됐다.",
    source: "공식 공지 · 아카라이브 · 디시인사이드 종합",
    time: "07:42 갱신",
    body: [
      "신규 학생 ‘미사키(수영복)’의 일러스트는 “올해 최고 디자인”이라는 평과 함께 빠르게 추천글 상단을 차지했다. 신규 이벤트 ‘여름의 끝, 약속의 네뷸라’ 역시 스토리 분량과 보상 구성 면에서 긍정적인 첫인상을 남겼다.",
      "반면 총력전 보상 테이블 조정안은 “상위 구간 보상이 사실상 줄었다”는 분석이 확산되며 논쟁의 중심에 섰다. 운영진은 ‘난이도 대비 보상 정상화’라는 입장이지만, 일부 유저는 인게임 재화 수급 감소를 우려했다.",
    ],
  },

  // 사건 감지 — 크로스 게임 알림
  alerts: [
    { game: "블루 아카이브", title: "신규 총력전 보상 감소 논란", severity: "주의", heat: 92 },
    { game: "붕괴: 스타레일", title: "파밍 피로도·파워 인플레 부정 여론 상승", severity: "주의", heat: 78 },
    { game: "명일방주", title: "4주년 일정 과밀 ‘번아웃’ 우려", severity: "관찰", heat: 54 },
    { game: "승리의 여신: 니케", title: "콜라보 기대감 과열 — 미발표 정보 추측 확산", severity: "관찰", heat: 41 },
  ],

  // 스팀 할인 추적
  steam: [
    { name: "Baldur's Gate 3", price: "₩40,920", was: "₩66,000", disc: 38, low: true, ends: "06.12" },
    { name: "Balatro", price: "₩9,975", was: "₩14,500", disc: 31, low: true, ends: "06.09" },
    { name: "NieR:Automata", price: "₩16,500", was: "₩44,800", disc: 63, low: false, ends: "06.12" },
    { name: "Clair Obscur: Expedition 33", price: "₩39,200", was: "₩49,000", disc: 20, low: true, ends: "06.10" },
    { name: "Metaphor: ReFantazio", price: "₩47,250", was: "₩69,800", disc: 32, low: false, ends: "06.12" },
    { name: "Dave the Diver", price: "₩11,200", was: "₩22,500", disc: 50, low: false, ends: "06.09" },
    { name: "Civilization VI", price: "₩6,600", was: "₩66,000", disc: 90, low: false, ends: "06.12" },
    { name: "Factorio", price: "₩30,500", was: "₩30,500", disc: 0, low: false, ends: "—" },
    { name: "Stellar Blade", price: "₩59,200", was: "₩74,000", disc: 20, low: true, ends: "06.10" },
    { name: "Monster Hunter Wilds", price: "₩62,300", was: "₩74,500", disc: 16, low: false, ends: "06.12" },
    { name: "Split Fiction", price: "₩39,200", was: "₩49,000", disc: 20, low: false, ends: "06.09" },
    { name: "DJMAX RESPECT V", price: "₩16,500", was: "₩33,000", disc: 50, low: false, ends: "06.12" },
    { name: "Core Keeper", price: "₩11,900", was: "₩17,000", disc: 30, low: true, ends: "06.09" },
    { name: "Dead Cells", price: "₩9,900", was: "₩28,000", disc: 65, low: false, ends: "06.12" },
  ],
};

window.LOGIA_DATA = LOGIA_DATA;
