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
