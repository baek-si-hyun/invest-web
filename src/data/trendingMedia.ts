export type TrendingMedia = {
  id: string;
  label: string;
  region: string;
  icon?: string;
  iconUrl?: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  description: string;
  recentHeadlines: number;
  engagement: 'high' | 'medium' | 'low';
  credibility: 'high' | 'medium' | 'low';
  lastUpdated: string;
  topHeadline: {
    title: string;
    timeAgo: string;
    summary: string;
  };
  socialMedia: {
    platform: string;
    followers: string;
    engagement: string;
  }[];
};

export const trendingMedia: TrendingMedia[] = [
  {
    id: 'reuters',
    label: '로이터',
    region: '글로벌',
    icon: '🛰️',
    iconUrl: 'https://logo.clearbit.com/reuters.com',
    trend: 'up',
    trendValue: '+12.3%',
    description: '글로벌 금융시장의 신뢰할 수 있는 정보원',
    recentHeadlines: 156,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '5분 전',
    topHeadline: {
      title: 'FOMC 의사록 공개 앞두고 미 증시 혼조세',
      timeAgo: '7분 전',
      summary: '연준의 긴축 경로를 주시하는 투자자들로 인해 뉴욕증시가 혼조세를 보이고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '1,200만', engagement: '높음' },
      { platform: 'LinkedIn', followers: '850만', engagement: '높음' },
      { platform: 'Facebook', followers: '2,100만', engagement: '중간' }
    ]
  },
  {
    id: 'bloomberg',
    label: '블룸버그',
    region: '미국',
    icon: '📊',
    iconUrl: 'https://logo.clearbit.com/bloomberg.com',
    trend: 'up',
    trendValue: '+18.7%',
    description: '금융시장 전문 정보와 분석의 선도자',
    recentHeadlines: 203,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '3분 전',
    topHeadline: {
      title: 'AI 투자붐, 반도체 업종 실적 기대치 상향',
      timeAgo: '10분 전',
      summary: 'AI 데이터센터 투자가 확대되며 반도체 기업들의 실적 전망치가 상향되고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '980만', engagement: '높음' },
      { platform: 'LinkedIn', followers: '1,200만', engagement: '높음' },
      { platform: 'YouTube', followers: '450만', engagement: '중간' }
    ]
  },
  {
    id: 'wsj',
    label: '월스트리트저널',
    region: '미국',
    icon: '💼',
    iconUrl: 'https://logo.clearbit.com/wsj.com',
    trend: 'stable',
    trendValue: '+2.1%',
    description: '비즈니스와 금융 뉴스의 권위 있는 목소리',
    recentHeadlines: 189,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '8분 전',
    topHeadline: {
      title: '미국 장기채 금리, 인플레 기대치 하락에 동반 하락',
      timeAgo: '12분 전',
      summary: '인플레이션 기대치가 둔화되며 10년물 국채금리가 하락했습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '1,800만', engagement: '높음' },
      { platform: 'LinkedIn', followers: '650만', engagement: '높음' },
      { platform: 'Instagram', followers: '320만', engagement: '중간' }
    ]
  },
  {
    id: 'nyt',
    label: '뉴욕타임스',
    region: '미국',
    icon: '🗽',
    iconUrl: 'https://logo.clearbit.com/nytimes.com',
    trend: 'up',
    trendValue: '+8.9%',
    description: '종합 뉴스와 심층 분석의 대표 언론사',
    recentHeadlines: 234,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '6분 전',
    topHeadline: {
      title: '대선 레이스 가속…정책 공약 경쟁 본격화',
      timeAgo: '18분 전',
      summary: '미국 대선 본선 국면에 들어서며 양당의 정책 공약이 쏟아지고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '2,200만', engagement: '높음' },
      { platform: 'Facebook', followers: '3,100만', engagement: '높음' },
      { platform: 'Instagram', followers: '1,800만', engagement: '중간' }
    ]
  },
  {
    id: 'cnbc',
    label: 'CNBC',
    region: '미국',
    icon: '📺',
    iconUrl: 'https://logo.clearbit.com/cnbc.com',
    trend: 'up',
    trendValue: '+15.4%',
    description: '실시간 금융 뉴스와 시장 분석의 중심',
    recentHeadlines: 178,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '2분 전',
    topHeadline: {
      title: '테크 기업들, AI 인력 채용 경쟁 가열',
      timeAgo: '6분 전',
      summary: 'AI 기술력 확보를 위한 인재 확보 경쟁이 심화되고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '1,500만', engagement: '높음' },
      { platform: 'YouTube', followers: '2,800만', engagement: '높음' },
      { platform: 'LinkedIn', followers: '420만', engagement: '중간' }
    ]
  },
  {
    id: 'ft',
    label: '파이낸셜타임스',
    region: '영국',
    icon: '💹',
    iconUrl: 'https://logo.clearbit.com/ft.com',
    trend: 'stable',
    trendValue: '+3.2%',
    description: '유럽 금융시장의 신뢰할 수 있는 정보원',
    recentHeadlines: 145,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '12분 전',
    topHeadline: {
      title: '유럽 은행들, 금리 정상화에 순이자마진 확대',
      timeAgo: '14분 전',
      summary: '유럽 은행들의 수익성이 금리 정상화 효과로 개선되고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '680만', engagement: '중간' },
      { platform: 'LinkedIn', followers: '1,100만', engagement: '높음' },
      { platform: 'Facebook', followers: '890만', engagement: '중간' }
    ]
  },
  {
    id: 'bbc',
    label: 'BBC',
    region: '영국',
    icon: '🎙️',
    iconUrl: 'https://logo.clearbit.com/bbc.com',
    trend: 'up',
    trendValue: '+6.8%',
    description: '영국 공영방송의 종합 뉴스 서비스',
    recentHeadlines: 267,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '4분 전',
    topHeadline: {
      title: '영란은행, 인플레이션 경로 재점검 착수',
      timeAgo: '15분 전',
      summary: '영란은행이 물가 경로를 재점검하며 향후 금리 인하 가능성을 열어두고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '2,800만', engagement: '높음' },
      { platform: 'Facebook', followers: '4,200만', engagement: '높음' },
      { platform: 'Instagram', followers: '1,900만', engagement: '중간' }
    ]
  },
  {
    id: 'scmp',
    label: 'SCMP',
    region: '홍콩',
    icon: '🌏',
    iconUrl: 'https://logo.clearbit.com/scmp.com',
    trend: 'up',
    trendValue: '+11.2%',
    description: '아시아 시장의 핵심 정보와 분석 제공',
    recentHeadlines: 123,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '9분 전',
    topHeadline: {
      title: '홍콩 증시, 중국 부동산 완화 기대에 상승',
      timeAgo: '11분 전',
      summary: '중국 정부의 추가 부동산 완화책 기대감이 증시에 반영됐습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '420만', engagement: '중간' },
      { platform: 'LinkedIn', followers: '380만', engagement: '중간' },
      { platform: 'Facebook', followers: '650만', engagement: '중간' }
    ]
  },
  {
    id: 'caixin',
    label: '차이신',
    region: '중국',
    icon: '🐉',
    iconUrl: 'https://logo.clearbit.com/caixin.com',
    trend: 'down',
    trendValue: '-4.1%',
    description: '중국 경제와 금융시장의 전문 정보원',
    recentHeadlines: 98,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '15분 전',
    topHeadline: {
      title: '중국 제조업 PMI, 두 달 연속 확장세',
      timeAgo: '13분 전',
      summary: '중국 제조업 경기 개선이 확인되며 지수도 확장 국면을 유지했습니다.'
    },
    socialMedia: [
      { platform: 'Weibo', followers: '1,200만', engagement: '높음' },
      { platform: 'WeChat', followers: '850만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '180만', engagement: '낮음' }
    ]
  },
  {
    id: 'nikkei',
    label: '닛케이',
    region: '일본',
    icon: '🗾',
    iconUrl: 'https://logo.clearbit.com/nikkei.com',
    trend: 'up',
    trendValue: '+9.7%',
    description: '일본 경제와 아시아 시장의 권위 있는 목소리',
    recentHeadlines: 156,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '7분 전',
    topHeadline: {
      title: '일본 증시, 엔화 약세에 34년 만의 최고치',
      timeAgo: '18분 전',
      summary: '엔화 약세가 지속되며 일본 증시가 30년 넘게 유지되던 박스를 돌파했습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '320만', engagement: '중간' },
      { platform: 'LinkedIn', followers: '280만', engagement: '중간' },
      { platform: 'Facebook', followers: '450만', engagement: '중간' }
    ]
  },
  {
    id: 'nhk',
    label: 'NHK',
    region: '일본',
    icon: '📡',
    iconUrl: 'https://logo.clearbit.com/nhk.or.jp',
    trend: 'stable',
    trendValue: '+1.8%',
    description: '일본 공영방송의 종합 뉴스 서비스',
    recentHeadlines: 189,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '11분 전',
    topHeadline: {
      title: '일본, 디지털청 주도로 행정 서비스 개편',
      timeAgo: '9분 전',
      summary: '디지털청이 행정 서비스 디지털 전환을 본격화한다고 밝혔습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '280만', engagement: '중간' },
      { platform: 'YouTube', followers: '1,200만', engagement: '중간' },
      { platform: 'Facebook', followers: '380만', engagement: '낮음' }
    ]
  },
  {
    id: 'joongang',
    label: '중앙일보',
    region: '한국',
    icon: '📍',
    iconUrl: 'https://logo.clearbit.com/joongang.co.kr',
    trend: 'up',
    trendValue: '+7.3%',
    description: '한국 경제와 정치의 종합 뉴스',
    recentHeadlines: 167,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '6분 전',
    topHeadline: {
      title: '한국은행, 기준금리 동결…성장률 전망 유지',
      timeAgo: '9분 전',
      summary: '한은이 기준금리를 동결하면서 성장률 전망을 유지했습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '180만', engagement: '중간' },
      { platform: 'Facebook', followers: '320만', engagement: '중간' },
      { platform: 'Instagram', followers: '95만', engagement: '낮음' }
    ]
  },
  {
    id: 'hankyoreh',
    label: '한겨레',
    region: '한국',
    icon: '📰',
    iconUrl: 'https://logo.clearbit.com/hani.co.kr',
    trend: 'stable',
    trendValue: '+2.4%',
    description: '한국의 진보적 시각의 종합 뉴스',
    recentHeadlines: 134,
    engagement: 'medium',
    credibility: 'high',
    lastUpdated: '13분 전',
    topHeadline: {
      title: '재생에너지 비중 확대, 지역 상생 모델 주목',
      timeAgo: '16분 전',
      summary: '지역 주민과 함께하는 재생에너지 프로젝트가 확산되고 있습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '95만', engagement: '중간' },
      { platform: 'Facebook', followers: '180만', engagement: '중간' },
      { platform: 'Instagram', followers: '45만', engagement: '낮음' }
    ]
  },
  {
    id: 'maekyung',
    label: '매일경제',
    region: '한국',
    icon: '📈',
    iconUrl: 'https://logo.clearbit.com/mk.co.kr',
    trend: 'up',
    trendValue: '+13.6%',
    description: '한국 경제와 금융시장의 전문 정보원',
    recentHeadlines: 198,
    engagement: 'high',
    credibility: 'high',
    lastUpdated: '4분 전',
    topHeadline: {
      title: '국내 증시, 반도체·AI주 중심 강세',
      timeAgo: '8분 전',
      summary: 'AI 투자 기대가 확대되며 관련 종목이 상승장을 주도했습니다.'
    },
    socialMedia: [
      { platform: 'X (트위터)', followers: '220만', engagement: '높음' },
      { platform: 'Facebook', followers: '450만', engagement: '높음' },
      { platform: 'YouTube', followers: '180만', engagement: '중간' }
    ]
  }
];

