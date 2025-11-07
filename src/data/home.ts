export type HomeLink = {
  label: string;
  path: string;
  icon?: string;
  description?: string;
};

export type HomeStat = {
  label: string;
  value: string;
  hint?: string;
};

export type MarketIndicator = {
  name: string;
  symbol: string;
  price: string;
  change: number;
  trend: 'up' | 'down';
};

export type TodayEvent = {
  time: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  type: 'event' | 'release' | 'briefing' | 'earnings';
};

export type MarketIssue = {
  title: string;
  trend: 'up' | 'down';
  category: string;
};

export type MarketHighlight = {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  change: number;
  timeframe: string;
  path: string;
};

export type LearningResource = {
  id: string;
  title: string;
  format: '영상' | '뉴스레터' | '가이드' | '팟캐스트';
  duration: string;
  description: string;
  path: string;
};


export type Toolkit = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  path: string;
};

export type ResearchDigest = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  path: string;
};

export const homeQuickLinks: HomeLink[] = [
  {
    label: '커뮤니티 둘러보기',
    path: '/community/',
    icon: '💬',
    description: '토론 보드와 매매 일지'
  },
  {
    label: '시장 지표 전체보기',
    path: '/metrics/',
    icon: '📊',
    description: '거시·물가·금리 지표'
  },
  {
    label: '자산군 탐색',
    path: '/categories/',
    icon: '🧭',
    description: '카테고리별 요약 카드'
  }
];

export const homeStats: HomeStat[] = [
  { label: '카테고리', value: '12', hint: '자산군 요약 카드' },
  { label: '커뮤니티 보드', value: '8', hint: '실시간 토론 섹션' },
  { label: '저널 템플릿', value: '5', hint: '기록 습관 도구' }
];

export const marketOverviewCards: MarketIndicator[] = [
  { name: '비트코인', symbol: 'BTC', price: '$63,420', change: 2.1, trend: 'up' },
  { name: '이더리움', symbol: 'ETH', price: '$3,420', change: 1.4, trend: 'up' },
  { name: '코스피', symbol: 'KOSPI', price: '2,847', change: 0.8, trend: 'up' },
  { name: '나스닥 100', symbol: 'NDX', price: '18,456', change: 1.1, trend: 'up' },
  { name: 'S&P 500', symbol: 'SPX', price: '5,234', change: 0.3, trend: 'up' },
  { name: '코스닥', symbol: 'KOSDAQ', price: '851', change: 0.9, trend: 'up' },
  { name: '달러/원', symbol: 'USD/KRW', price: '1,336', change: -0.5, trend: 'down' },
  { name: '미 10년물', symbol: 'UST 10Y', price: '4.28%', change: -0.06, trend: 'down' },
  { name: '국고채 3년', symbol: 'KR 3Y', price: '3.37%', change: -0.04, trend: 'down' },
  { name: 'WTI 원유', symbol: 'WTI', price: '$79.10', change: 1.7, trend: 'up' },
  { name: '금 현물', symbol: 'XAU', price: '$2,435', change: 0.5, trend: 'up' },
  { name: '비트코인 도미넌스', symbol: 'BTC.D', price: '53.2%', change: -0.8, trend: 'down' }
];

// 오늘 날짜의 실제 경제 이벤트에서 가져온 데이터
export const todayEventSchedule: TodayEvent[] = [
  { time: '08:00', title: '한국 산업생산(11월) 발표', impact: 'medium', type: 'release' },
  { time: '09:00', title: '한국은행 기준금리 결정', impact: 'high', type: 'event' },
  { time: '22:30', title: '미국 소비자물가지수(CPI)', impact: 'high', type: 'release' },
  { time: '22:30', title: '미국 비농업고용(NFP)', impact: 'high', type: 'release' },
  { time: '23:00', title: '테슬라 4Q 실적 컨퍼런스콜', impact: 'medium', type: 'earnings' },
  { time: '00:30', title: '연준 위원 브리핑', impact: 'medium', type: 'briefing' }
];

export const todayMarketIssues: MarketIssue[] = [
  { title: '비트코인 현물 ETF 자금 유입 5일 연속', trend: 'up', category: '코인' },
  { title: 'AI 반도체 실적 호조에 필라델피아 반도체 지수 상승', trend: 'up', category: '주식' },
  { title: '미 10년물 금리 4.3% 하락, 안전자산 선호 강화', trend: 'down', category: '채권' },
  { title: '달러 약세로 신흥국 통화 강세 전환', trend: 'down', category: '환율' },
  { title: 'WTI 80달러 근접, 에너지 섹터 시총 확대', trend: 'up', category: '원자재' }
];

export const marketHighlights: MarketHighlight[] = [
  {
    id: 'macro-playbook',
    title: '매크로 플레이북',
    subtitle: '금리 피크 이후 자산배분 전략',
    metric: '미 10Y 4.32%',
    change: -0.05,
    timeframe: '1주 변화',
    path: '/usd/'
  },
  {
    id: 'earnings-radar',
    title: '어닝 시즌 레이더',
    subtitle: 'AI 반도체와 클라우드 실적 선행지표',
    metric: 'SOX +2.4%',
    change: 2.4,
    timeframe: '1주 수익률',
    path: '/us-stock/'
  },
  {
    id: 'defi-yields',
    title: '디파이 수익률 체크',
    subtitle: '스테이킹·렌딩 프로토콜 비교',
    metric: 'stETH 3.7%',
    change: 0.1,
    timeframe: '전일 대비',
    path: '/defi/'
  },
  {
    id: 'savings-special',
    title: '특판 예적금 모음',
    subtitle: '만기 12개월 기준 상위 금리',
    metric: '최대 4.8%',
    change: 0.0,
    timeframe: '주간 업데이트',
    path: '/savings/'
  }
];

export const learningLibrary: LearningResource[] = [
  {
    id: 'macro-weekly-brief',
    title: '5분 만에 끝내는 주간 거시 브리핑',
    format: '영상',
    duration: '영상 7분',
    description: '채권금리·달러·원자재 흐름을 간단한 차트로 정리한 위클리 영상입니다.',
    path: '/community/journal/macro-weekly/'
  },
  {
    id: 'etf-handbook',
    title: 'ETF 초보자를 위한 자산배분 핸드북',
    format: '가이드',
    duration: 'PDF 18p',
    description: '국내/해외 ETF 선택 방법과 분산, 환헤지 체크 포인트를 안내합니다.',
    path: '/community/board/global-earnings/'
  },
  {
    id: 'defi-starter',
    title: '디파이 스타터 코스',
    format: '뉴스레터',
    duration: '3회 연재',
    description: '지갑 세팅부터 수수료 계산, 리스크 체크리스트까지 차근차근 배워봅니다.',
    path: '/community/board/crypto-alpha/'
  },
  {
    id: 'retirement-audio',
    title: '퇴직연금 ETF 포트폴리오 설계',
    format: '팟캐스트',
    duration: '24분',
    description: '퇴직연금 제도 개편과 세액공제 포인트, ETF 조합 예시를 짚어줍니다.',
    path: '/community/journal/macro-weekly/'
  }
];

export const toolkitLibrary: Toolkit[] = [
  {
    id: 'event-checklist',
    title: '경제지표 발표 체크리스트',
    summary: 'CPI·고용지표 발표 전에 준비할 관찰 항목을 정리했습니다.',
    bullets: ['발표 이전 리스크 관리 루틴', '발표 직후 시나리오 플랜', '관련 ETF/선물 모니터링 시트'],
    path: '/community/journal/daily-market-check/'
  },
  {
    id: 'earnings-template',
    title: '어닝리포트 요약 노트',
    summary: '실적 발표 핵심을 빠르게 기록하는 템플릿입니다.',
    bullets: ['핵심 수치 · 가이던스 요약', '경영진 코멘트/질문 정리', '향후 체크포인트 기록'],
    path: '/community/journal/trade-review/'
  },
  {
    id: 'personal-finance-kit',
    title: '월간 재테크 대시보드',
    summary: '소비/저축/투자를 한눈에 관리하는 표준 시트를 제공합니다.',
    bullets: ['수입·지출 자동 합계 시트', '적금·예금 만기 관리 캘린더', '목표 기반 투자 진척도'],
    path: '/savings/'
  }
];

export const researchDigests: ResearchDigest[] = [
  {
    id: 'semi-supply-chain',
    title: '글로벌 반도체 공급망 리포트',
    excerpt: 'TSMC·ASML 캐파 가동률과 미국 CHIPS Act 수혜 기업을 한 번에 살펴보는 분석입니다.',
    tags: ['미국주식', 'AI', '공급망'],
    path: '/us-stock/'
  },
  {
    id: 'korea-credit-cycle',
    title: '한국 신용 사이클 점검',
    excerpt: '은행·2금융권 대출 잔액과 연체율, 가계부채 비율 추이를 비교했습니다.',
    tags: ['국내주식', '채권', '거시'],
    path: '/kr-stock/'
  },
  {
    id: 'stablecoin-liquidity',
    title: '스테이블코인 유동성 모니터',
    excerpt: 'USDT/USDC 순발행, 온체인 머니플로우를 기반으로 디파이 자금 이동을 추적합니다.',
    tags: ['디파이', '온체인'],
    path: '/defi/'
  }
];

