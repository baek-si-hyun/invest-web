export type Category = {
  slug: string;
  name: string;
  emoji: string;
  desc: string;
  accent?: string;
};

export const categories: Category[] = [
  { slug: 'coin', name: '코인', emoji: '₿', desc: '암호화폐 시세 · 온체인 · 뉴스' },
  { slug: 'kr-stock', name: '국내주식', emoji: '🇰🇷', desc: '코스피/코스닥 시세 · 테마' },
  { slug: 'us-stock', name: '해외주식', emoji: '🇺🇸', desc: '미국/글로벌 주식 · ETF' },
  { slug: 'bond', name: '채권', emoji: '🏛️', desc: '국채 · 회사채 · 금리' },
  { slug: 'usd', name: '달러', emoji: '💵', desc: '환율 · DXY · 국내외 달러자산' },
  { slug: 'gold', name: '금', emoji: '🪙', desc: '금 시세 · 금 ETF · 실물' },
  { slug: 'defi', name: '디파이', emoji: '🧬', desc: 'Lending · DEX · 파밍' },
  { slug: 'swap', name: '스왑', emoji: '🔁', desc: '스왑 레이트 · 크로스체인' },
  { slug: 'staking', name: '스테이킹', emoji: '⛓️', desc: '네이티브 · LST · 수익률' },
  { slug: 'savings', name: '적금상품', emoji: '🏦', desc: '은행/증권 예·적금 · 특판' },
  { slug: 'pension', name: '연금', emoji: '🧓', desc: '퇴직연금 · IRP · 연금 ETF' },
  { slug: 'auction', name: '경매', emoji: '🏠', desc: '부동산 경매 · 낙찰가율 · 일정' }
];

export function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
