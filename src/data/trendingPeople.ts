export type TrendingPerson = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  avatar: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  description: string;
  recentNews: string;
  socialMedia: {
    platform: string;
    followers: string;
    engagement: string;
  }[];
  lastUpdated: string;
};

export const trendingPeople: TrendingPerson[] = [
  {
    id: 'elon-musk',
    name: '일론 머스크',
    title: 'CEO',
    company: '테슬라',
    industry: '자동차/에너지',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+15.2%',
    description: '전기차와 우주 기술 혁신을 이끄는 비전가',
    recentNews: '테슬라 AI 데이에서 FSD 베타 업데이트 발표',
    socialMedia: [
      { platform: 'X (트위터)', followers: '1.8억', engagement: '높음' },
      { platform: 'LinkedIn', followers: '2,500만', engagement: '중간' }
    ],
    lastUpdated: '2시간 전'
  },
  {
    id: 'jensen-huang',
    name: '젠슨 황',
    title: 'CEO',
    company: 'NVIDIA',
    industry: '반도체/AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+28.7%',
    description: 'AI 혁신의 선구자, GPU 기술의 아키텍트',
    recentNews: 'GTC 2024에서 차세대 AI 칩 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '180만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '45만', engagement: '중간' }
    ],
    lastUpdated: '1시간 전'
  },
  {
    id: 'tim-cook',
    name: '팀 쿡',
    title: 'CEO',
    company: '애플',
    industry: '테크',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'stable',
    trendValue: '+2.1%',
    description: '애플의 지속가능한 혁신을 이끄는 리더',
    recentNews: 'WWDC 2024에서 iOS 18과 AI 기능 공개',
    socialMedia: [
      { platform: 'LinkedIn', followers: '320만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '12만', engagement: '낮음' }
    ],
    lastUpdated: '3시간 전'
  },
  {
    id: 'satya-nadella',
    name: '사티아 나델라',
    title: 'CEO',
    company: '마이크로소프트',
    industry: '클라우드/AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+12.4%',
    description: '클라우드와 AI의 미래를 설계하는 비전가',
    recentNews: 'Build 2024에서 Copilot+ PC 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '280만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '85만', engagement: '중간' }
    ],
    lastUpdated: '4시간 전'
  },
  {
    id: 'sundar-pichai',
    name: '순다르 피차이',
    title: 'CEO',
    company: '구글',
    industry: 'AI/검색',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+8.9%',
    description: 'AI와 검색 기술의 혁신을 주도하는 리더',
    recentNews: 'Google I/O 2024에서 Gemini 2.0 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '150만', engagement: '중간' },
      { platform: 'X (트위터)', followers: '25만', engagement: '낮음' }
    ],
    lastUpdated: '5시간 전'
  },
  {
    id: 'andy-jassy',
    name: '앤디 재시',
    title: 'CEO',
    company: '아마존',
    industry: '클라우드/이커머스',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trend: 'stable',
    trendValue: '+1.8%',
    description: '클라우드 컴퓨팅의 혁신을 이끄는 아키텍트',
    recentNews: 'AWS re:Invent에서 Bedrock 업데이트 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '95만', engagement: '중간' },
      { platform: 'X (트위터)', followers: '18만', engagement: '낮음' }
    ],
    lastUpdated: '6시간 전'
  },
  {
    id: 'mark-zuckerberg',
    name: '마크 저커버그',
    title: 'CEO',
    company: '메타',
    industry: '소셜/메타버스',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+22.3%',
    description: '메타버스와 소셜 플랫폼의 미래를 구상하는 혁신가',
    recentNews: 'Meta Connect에서 Quest 3 Pro 발표',
    socialMedia: [
      { platform: 'Instagram', followers: '1,200만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '890만', engagement: '높음' }
    ],
    lastUpdated: '1시간 전'
  },
  {
    id: 'reed-hastings',
    name: '리드 헤이스팅스',
    title: '공동창업자',
    company: '넷플릭스',
    industry: '스트리밍/엔터테인먼트',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trend: 'down',
    trendValue: '-5.2%',
    description: '스트리밍 혁신의 선구자, 엔터테인먼트 산업의 게임 체인저',
    recentNews: '넷플릭스 광고 플랜 성과 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '45만', engagement: '중간' },
      { platform: 'X (트위터)', followers: '12만', engagement: '낮음' }
    ],
    lastUpdated: '7시간 전'
  },
  {
    id: 'brian-armstrong',
    name: '브라이언 암스트롱',
    title: 'CEO',
    company: '코인베이스',
    industry: '암호화폐/핀테크',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+18.6%',
    description: '암호화폐 생태계의 민주화를 추진하는 혁신가',
    recentNews: '코인베이스 Base 네트워크 성장 발표',
    socialMedia: [
      { platform: 'X (트위터)', followers: '120만', engagement: '높음' },
      { platform: 'LinkedIn', followers: '85만', engagement: '중간' }
    ],
    lastUpdated: '2시간 전'
  },
  {
    id: 'daniel-zhang',
    name: '다니엘 장',
    title: 'CEO',
    company: '알리바바',
    industry: '이커머스/클라우드',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trend: 'stable',
    trendValue: '+3.4%',
    description: '중국 이커머스와 클라우드 혁신의 리더',
    recentNews: '알리바바 클라우드 AI 서비스 확장 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '65만', engagement: '중간' },
      { platform: 'Weibo', followers: '180만', engagement: '높음' }
    ],
    lastUpdated: '8시간 전'
  },
  {
    id: 'pat-gelsinger',
    name: '팻 겔싱어',
    title: 'CEO',
    company: '인텔',
    industry: '반도체',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+11.7%',
    description: '인텔의 반도체 리더십 회복을 이끄는 기술 전문가',
    recentNews: 'IDM 2.0 전략 성과 및 차세대 공정 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '75만', engagement: '중간' },
      { platform: 'X (트위터)', followers: '28만', engagement: '낮음' }
    ],
    lastUpdated: '9시간 전'
  },
  {
    id: 'lisa-su',
    name: '리사 수',
    title: 'CEO',
    company: 'AMD',
    industry: '반도체',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    trend: 'up',
    trendValue: '+19.2%',
    description: 'AMD의 혁신과 성장을 이끄는 반도체 업계의 여성 리더',
    recentNews: 'AMD Instinct MI300 시리즈 성과 발표',
    socialMedia: [
      { platform: 'LinkedIn', followers: '95만', engagement: '높음' },
      { platform: 'X (트위터)', followers: '35만', engagement: '중간' }
    ],
    lastUpdated: '3시간 전'
  }
];

