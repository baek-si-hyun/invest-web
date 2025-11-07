export type CommunityBoard = {
  slug: string;
  title: string;
  emoji: string;
  description: string;
  categorySlug?: string;
  topics: string[];
  metrics: {
    members: string;
    postsToday: number;
  };
  pinned?: string;
};

export type JournalTemplate = {
  id: string;
  title: string;
  goal: string;
  recommendedFrequency: string;
  prompts: string[];
  exampleTags: string[];
};

export const communityBoards: CommunityBoard[] = [
  {
    slug: "coin",
    title: "코인",
    emoji: "₿",
    description:
      "온체인 흐름, 신규 토큰 이슈, 현물/선물 전략을 실시간으로 공유합니다.",
    categorySlug: "coin",
    topics: ["온체인데이터", "파생상품", "에어드롭"],
    metrics: { members: "18.2K", postsToday: 72 },
    pinned: "차세대 레이어2 모니터링 시트",
  },
  {
    slug: "kr-stock",
    title: "국내주식",
    emoji: "📈",
    description: "업종/테마별 실적 전망과 관심 종목을 토론합니다.",
    categorySlug: "kr-stock",
    topics: ["2차전지", "반도체", "엔터"],
    metrics: { members: "21.8K", postsToday: 87 },
    pinned: "7월 실적발표 캘린더",
  },
  {
    slug: "us-stock",
    title: "해외주식",
    emoji: "🌍",
    description:
      "미국·유럽 증시 주요 종목 실적 요약과 ETF 포지셔닝 아이디어를 정리합니다.",
    categorySlug: "us-stock",
    topics: ["빅테크", "ETF", "거시"],
    metrics: { members: "9.7K", postsToday: 28 },
    pinned: "메가캡 실적 하이라이트",
  },
  {
    slug: "staking",
    title: "스테이킹",
    emoji: "🔒",
    description: "LST, 리퀴드 리스택킹, 거버넌스 리워드를 비교 분석합니다.",
    categorySlug: "staking",
    topics: ["ETH LST", "리퀴드리스타킹", "슬래싱"],
    metrics: { members: "7.4K", postsToday: 31 },
    pinned: "메이저 체인 APR 비교 차트",
  },
  {
    slug: "bond",
    title: "채권",
    emoji: "🏛️",
    description:
      "국채·회사채 스프레드, 듀레이션 전략, 금리 선물 포지션을 토론합니다.",
    categorySlug: "bond",
    topics: ["듀레이션", "크레딧", "선물"],
    metrics: { members: "5.9K", postsToday: 22 },
    pinned: "미국채 커브 인버전 대응 전략",
  },
  {
    slug: "usd",
    title: "달러",
    emoji: "💵",
    description: "CPI, 고용, FOMC 코멘트를 바탕으로 환율과 DXY를 해석합니다.",
    categorySlug: "usd",
    topics: ["CPI", "FOMC", "헤지전략"],
    metrics: { members: "12.4K", postsToday: 54 },
    pinned: "연준 점도표 요약",
  },
  {
    slug: "gold",
    title: "금",
    emoji: "🥇",
    description: "금 현물, 금 ETF, 금광주 이슈와 헤지 전략을 모읍니다.",
    categorySlug: "gold",
    topics: ["실물금", "ETF자금", "헤지전략"],
    metrics: { members: "4.1K", postsToday: 18 },
    pinned: "실물/ETF 가격 괴리 모니터",
  },
  {
    slug: "defi",
    title: "디파이",
    emoji: "🌐",
    description: "거버넌스 투표, 에어드롭, 신규 프로토콜을 함께 탐색합니다.",
    categorySlug: "defi",
    topics: ["온체인데이터", "거버넌스", "리스크"],
    metrics: { members: "15.2K", postsToday: 63 },
    pinned: "온체인 대시보드 활용법",
  },
  {
    slug: "swap",
    title: "스왑",
    emoji: "🔁",
    description: "DEX, 크로스체인 브리지, MEV 대응 전략을 공유합니다.",
    categorySlug: "swap",
    topics: ["DEX", "MEV", "브리지"],
    metrics: { members: "6.8K", postsToday: 27 },
    pinned: "수수료 최적화 플로우",
  },
  {
    slug: "savings",
    title: "적금",
    emoji: "💼",
    description: "은행/증권 특판, CMA, 고금리 예치 상품 정보를 모읍니다.",
    categorySlug: "savings",
    topics: ["특판", "세테크", "금리비교"],
    metrics: { members: "8.3K", postsToday: 34 },
    pinned: "이번주 특판 예금 시트",
  },
  {
    slug: "pension",
    title: "연금",
    emoji: "🏖️",
    description: "퇴직연금, IRP, 연금 ETF 포트 운영 경험을 나눕니다.",
    categorySlug: "pension",
    topics: ["IRP", "세액공제", "ETF"],
    metrics: { members: "5.1K", postsToday: 16 },
    pinned: "연금 ETF 분기 리밸런싱 체크",
  },
  {
    slug: "auction",
    title: "경매",
    emoji: "🔨",
    description: "낙찰가율, 권리분석, 지역별 입찰 전략을 공유합니다.",
    categorySlug: "auction",
    topics: ["낙찰가율", "권리분석", "현장리포트"],
    metrics: { members: "3.4K", postsToday: 14 },
    pinned: "서울/수도권 캘린더 업데이트",
  },
];

export const journalTemplates: JournalTemplate[] = [
  {
    id: "daily-market-check",
    title: "데일리 마켓 체크리스트",
    goal: "시황을 빠르게 정리하고 다음날 관찰 포인트를 세팅합니다.",
    recommendedFrequency: "매일 장 마감 후",
    prompts: [
      "오늘 시장을 움직인 핵심 이슈 3가지",
      "보유 포지션의 손익 및 유지/축소 계획",
      "내일 주목할 경제지표·이벤트",
    ],
    exampleTags: ["#데일리브리핑", "#리스크관리"],
  },
  {
    id: "trade-review",
    title: "트레이드 리뷰 노트",
    goal: "진입/청산 근거를 돌아보고 같은 실수를 줄입니다.",
    recommendedFrequency: "포지션 종료 직후",
    prompts: [
      "진입 시그널과 기대했던 시나리오",
      "실제 전개 vs. 예상 비교",
      "다음 트레이드에서 개선할 부분",
    ],
    exampleTags: ["#트레이딩", "#리뷰"],
  },
  {
    id: "macro-weekly",
    title: "주간 거시 리포트",
    goal: "주요 지표, 섹터 흐름을 묶어 나만의 관점으로 기록합니다.",
    recommendedFrequency: "주 1회 (주말)",
    prompts: [
      "거시지표 인사이트 정리",
      "ETF/섹터 성과 비교",
      "다음 주 체크할 이벤트 리스트",
    ],
    exampleTags: ["#주간리포트", "#거시분석"],
  },
];

export type CommunityPulseMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  description: string;
};

export type CommunityPost = {
  id: string;
  boardSlug: string;
  title: string;
  summary: string;
  author: string;
  postedAt: string;
  likes: number;
  comments: number;
  sentiment: "bullish" | "bearish" | "neutral";
  tags: string[];
};

export type CommunityTagStat = {
  label: string;
  usage: number;
  change: string;
};

export const communityPulseMetrics: CommunityPulseMetric[] = [
  {
    id: "active-users",
    label: "실시간 참여자",
    value: "4,892",
    delta: "+12.4%",
    trend: "up",
    description: "최근 30분 기준",
  },
  {
    id: "new-topics",
    label: "신규 토픽",
    value: "38",
    delta: "+5.2%",
    trend: "up",
    description: "오늘 등록",
  },
  {
    id: "insight-ratio",
    label: "인사이트 비율",
    value: "63%",
    delta: "-2.1%",
    trend: "down",
    description: "추천 20개 이상 게시글",
  },
  {
    id: "journal-updates",
    label: "매매 일지",
    value: "126",
    delta: "+8.0%",
    trend: "up",
    description: "이번 주 업데이트",
  },
];

export const featuredCommunityPosts: CommunityPost[] = [
  {
    id: "c-post-1",
    boardSlug: "coin",
    title: "온체인 유동성 이동 — 알트 시즌 신호?",
    summary:
      "주요 거래소 간 스테이블 유입량을 추적해 보니 4월 이후 가장 큰 규모가 관측됩니다. 레이어2 가스비도 다시 올라가는 중.",
    author: "Operator_J",
    postedAt: "2시간 전",
    likes: 142,
    comments: 37,
    sentiment: "bullish",
    tags: ["#온체인", "#레이어2"],
  },
  {
    id: "c-post-2",
    boardSlug: "kr-stock",
    title: "2차전지 재료단 원가 압박 완화",
    summary:
      "탄산리튬 톤당 1만5천달러선에서 박스권. 양극재 업체별 스프레드가 벌어지기 시작했습니다. 3분기 마진 회복 베팅 관점 공유합니다.",
    author: "에쿼티리서치",
    postedAt: "4시간 전",
    likes: 96,
    comments: 22,
    sentiment: "bullish",
    tags: ["#2차전지", "#마진"],
  },
  {
    id: "c-post-3",
    boardSlug: "usd",
    title: "7월 FOMC 전 달러 롱 포지션 압축",
    summary:
      "IMM 포지셔닝 기준 달러 순매수 잔량이 5주 연속 축소되었습니다. 105선 언저리에서 숏 커버 가능성 체크하세요.",
    author: "MacroNotes",
    postedAt: "6시간 전",
    likes: 68,
    comments: 18,
    sentiment: "neutral",
    tags: ["#달러", "#FOMC"],
  },
  {
    id: "c-post-4",
    boardSlug: "defi",
    title: "리퀴드 리스택킹 풀 간 APR 비교표",
    summary:
      "EigenLayer 재스태킹 풀뿐 아니라 Karak·Symbiotic까지 비교표로 정리했습니다. 슬래싱 리스크도 간단히 메모했습니다.",
    author: "DeFi_Diary",
    postedAt: "1일 전",
    likes: 83,
    comments: 11,
    sentiment: "bullish",
    tags: ["#리스택킹", "#APR"],
  },
  {
    id: "c-post-5",
    boardSlug: "auction",
    title: "서울 서북권 낙찰가율 2%p 하락",
    summary:
      "최근 4주 이동평균 기준 낙찰가율이 94%까지 내려왔습니다. 물건 수가 늘어난 만큼 입찰가 전략 조정이 필요해 보여요.",
    author: "현장러너",
    postedAt: "1일 전",
    likes: 41,
    comments: 9,
    sentiment: "bearish",
    tags: ["#경매", "#낙찰가율"],
  },
];

export const trendingCommunityTags: CommunityTagStat[] = [
  { label: "ETF리밸런싱", usage: 128, change: "+34%" },
  { label: "AI반도체", usage: 203, change: "+12%" },
  { label: "거시브리핑", usage: 176, change: "+19%" },
  { label: "에어드롭", usage: 149, change: "+8%" },
  { label: "리스크관리", usage: 117, change: "+5%" },
  { label: "주간플랜", usage: 96, change: "+14%" },
];
