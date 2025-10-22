export type EconomicEventCategory =
  | "domestic-economic"
  | "foreign-economic"
  | "domestic-earnings"
  | "foreign-earnings";

export type EconomicEventImportance = "high" | "medium" | "low";

export type EconomicEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  timezone?: string; // KST, UTC, etc.
  title: string;
  indicator: string;
  country: string;
  flag: string;
  description: string;
  importance: EconomicEventImportance;
  forecast?: string;
  previous?: string;
  source: string;
  relatedThemes: string[];
  filterCategory: EconomicEventCategory;
};

const rawEconomicEvents: EconomicEvent[] = [
  {
    id: "us-nfp-20250308",
    date: "2025-03-08",
    time: "09:30",
    title: "미국 비농업 고용지수(NFP)",
    indicator: "Non-Farm Payrolls",
    country: "미국",
    flag: "🇺🇸",
    description:
      "미국 노동시장의 탄탄함을 보여주는 대표 지표입니다. 연준의 통화정책 방향과 달러 강세 여부를 가늠할 수 있는 핵심 데이터입니다.",
    importance: "high",
    forecast: "21만 명",
    previous: "19만 명",
    source: "https://www.bls.gov/",
    relatedThemes: ["달러", "미국 국채", "미 증시"],
    filterCategory: "foreign-economic",
  },
  {
    id: "kr-cpi-20250305",
    date: "2025-03-05",
    time: "08:00",
    title: "한국 소비자물가(CPI)",
    indicator: "Consumer Price Index",
    country: "대한민국",
    flag: "🇰🇷",
    description:
      "한국은행의 기준금리 결정에 직접적인 영향을 주는 물가지표입니다. 식료품과 에너지를 제외한 근원 물가 흐름에 주목해야 합니다.",
    importance: "high",
    forecast: "전년 대비 +2.5%",
    previous: "+2.7%",
    source: "https://kostat.go.kr/",
    relatedThemes: ["원화", "국채", "리테일"],
    filterCategory: "domestic-economic",
  },
  {
    id: "eu-ecb-20250312",
    date: "2025-03-12",
    time: "17:30",
    title: "ECB 통화정책 회의",
    indicator: "ECB Rate Decision",
    country: "유로존",
    flag: "🇪🇺",
    description:
      "유럽중앙은행의 금리 결정과 기자회견이 예정돼 있습니다. 인플레이션 진정 여부와 성장률 전망 업데이트가 초점을 받을 예정입니다.",
    importance: "high",
    source: "https://www.ecb.europa.eu/",
    relatedThemes: ["유로화", "유럽 증시", "채권"],
    filterCategory: "foreign-economic",
  },
  {
    id: "us-cpi-20250313",
    date: "2025-03-13",
    time: "09:30",
    title: "미국 소비자물가(CPI)",
    indicator: "Consumer Price Index",
    country: "미국",
    flag: "🇺🇸",
    description:
      "헤드라인과 핵심 CPI 모두가 둔화되는지를 시장이 주시하고 있습니다. 인플레이션 경로가 연준의 조기 완화를 가능하게 할지 촉각이 곤두서 있습니다.",
    importance: "high",
    forecast: "전년 대비 +3.1%",
    previous: "+3.2%",
    source: "https://www.bls.gov/cpi/",
    relatedThemes: ["달러", "금", "성장주"],
    filterCategory: "foreign-economic",
  },
  {
    id: "kr-samsung-earnings-20250320",
    date: "2025-03-20",
    time: "07:30",
    title: "삼성전자 1분기 실적 발표",
    indicator: "Samsung Electronics Earnings",
    country: "대한민국",
    flag: "🇰🇷",
    description:
      "메모리 반도체 업황 회복 여부가 주목됩니다. AI 서버 수요와 파운드리 가동률 개선이 실적 개선을 이끈다는 전망이 우세합니다.",
    importance: "high",
    forecast: "영업이익 8.7조 원",
    source: "https://www.samsung.com/sec/ir/",
    relatedThemes: ["반도체", "KRX", "AI"],
    filterCategory: "domestic-earnings",
  },
  {
    id: "us-nvidia-earnings-20250319",
    date: "2025-03-19",
    time: "17:00",
    title: "엔비디아 FY2025 4분기 실적",
    indicator: "NVIDIA Earnings Call",
    country: "미국",
    flag: "🇺🇸",
    description:
      "AI 인프라 수요가 실적을 견인하고 있습니다. 데이터센터 매출 성장률과 신규 GPU 로드맵 업데이트가 관건입니다.",
    importance: "high",
    forecast: "매출 240억 달러",
    source: "https://investor.nvidia.com/",
    relatedThemes: ["AI", "반도체 장비", "미 증시"],
    filterCategory: "foreign-earnings",
  },
  {
    id: "cn-pmi-20250301",
    date: "2025-03-01",
    time: "10:00",
    title: "중국 제조업 PMI",
    indicator: "Manufacturing PMI",
    country: "중국",
    flag: "🇨🇳",
    description:
      "중국 제조업 경기 확장 여부가 글로벌 수요를 좌우합니다. 50선을 상회할 경우 원자재와 신흥국 시장에 긍정적인 시그널로 받아들여집니다.",
    importance: "medium",
    forecast: "50.4",
    previous: "49.8",
    source: "http://www.stats.gov.cn/",
    relatedThemes: ["원자재", "신흥국", "위안화"],
    filterCategory: "foreign-economic",
  },
  {
    id: "kr-hyundai-earnings-20250325",
    date: "2025-03-25",
    time: "08:00",
    title: "현대차 1분기 실적 발표",
    indicator: "Hyundai Motor Earnings",
    country: "대한민국",
    flag: "🇰🇷",
    description:
      "전기차 전환 전략과 북미 공장 가동 계획이 핵심입니다. 환율과 원자재 가격 변동이 수익성에 미치는 영향에 관심이 모입니다.",
    importance: "medium",
    forecast: "영업이익 2.6조 원",
    source: "https://www.hyundai.com/kr/company/ir/finance",
    relatedThemes: ["전기차", "자동차", "KRX"],
    filterCategory: "domestic-earnings",
  },
  {
    id: "jp-boj-20250328",
    date: "2025-03-28",
    time: "10:30",
    title: "일본은행 통화정책 결정",
    indicator: "Bank of Japan Meeting",
    country: "일본",
    flag: "🇯🇵",
    description:
      "마이너스 금리 해제 이후 첫 회의로 시장의 주목이 큽니다. 국채 금리 상단 조정과 ETF 매입 축소 여부가 핵심 변수입니다.",
    importance: "high",
    source: "https://www.boj.or.jp/en/",
    relatedThemes: ["엔화", "니케이225", "국채"],
    filterCategory: "foreign-economic",
  },
  {
    id: "us-fed-minutes-20250319",
    date: "2025-03-19",
    time: "15:00",
    title: "FOMC 의사록 공개",
    indicator: "FOMC Minutes",
    country: "미국",
    flag: "🇺🇸",
    description:
      "연준 위원들의 금리 전망과 인플레이션 리스크 평가를 확인할 수 있는 자료입니다. 향후 금리 경로에 대한 힌트를 주는 이벤트로 꼽힙니다.",
    importance: "medium",
    source: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    relatedThemes: ["달러", "미국 국채", "골드"],
    filterCategory: "foreign-economic",
  },
  {
    id: "us-cpi-20240213",
    date: "2024-02-13",
    time: "22:30",
    timezone: "KST",
    country: "미국",
    flag: "🇺🇸",
    title: "미국 소비자물가지수(CPI)",
    indicator: "headline",
    importance: "high",
    relatedThemes: ["usd", "bond", "coin"],
    forecast: "3.2% YoY",
    previous: "3.1% YoY",
    description: "물가 흐름과 연준의 향후 금리경로를 판단할 핵심 데이터입니다.",
    source: "https://www.bls.gov/cpi/",
    filterCategory: "foreign-economic",
  },
  {
    id: "kr-trade-20240301",
    date: "2024-03-01",
    time: "09:00",
    timezone: "KST",
    country: "대한민국",
    flag: "🇰🇷",
    title: "3월 수출입 실적(잠정)",
    indicator: "trade-balance",
    importance: "medium",
    relatedThemes: ["kr-stock", "usd"],
    forecast: "+$5.1B",
    previous: "+$4.3B",
    description:
      "반도체와 자동차 수출 흐름을 통해 국내 제조업 회복 여부를 가늠합니다.",
    source: "https://www.customs.go.kr/",
    filterCategory: "domestic-economic",
  },
  {
    id: "samsung-earnings-20240116",
    date: "2024-01-16",
    time: "08:00",
    timezone: "KST",
    country: "대한민국",
    flag: "🇰🇷",
    title: "삼성전자 4Q 실적 발표",
    indicator: "earnings",
    importance: "high",
    relatedThemes: ["kr-stock", "bond"],
    forecast: "영업이익 2.8조원",
    previous: "영업이익 0.6조원",
    description:
      "반도체 업황 회복과 메모리 가격 상승으로 실적 개선이 예상됩니다.",
    source: "https://www.samsung.com/sec/",
    filterCategory: "domestic-earnings",
  },
  {
    id: "apple-earnings-20240117",
    date: "2024-01-17",
    time: "23:00",
    timezone: "KST",
    country: "미국",
    flag: "🇺🇸",
    title: "애플 1Q 실적 컨퍼런스콜",
    indicator: "earnings",
    importance: "high",
    relatedThemes: ["us-stock", "coin"],
    forecast: "EPS $2.10",
    previous: "EPS $1.88",
    description: "아이폰 15 시리즈 판매 호조와 서비스 매출 증가가 예상됩니다.",
    source: "https://investor.apple.com/",
    filterCategory: "foreign-earnings",
  },
];

// 모든 이벤트에 filterCategory 추가하는 함수
function addFilterCategory(event: EconomicEvent): EconomicEvent {
  // 이미 filterCategory가 있으면 그대로 사용
  if (event.filterCategory) {
    return event;
  }

  const isEarnings = event.indicator === "earnings";
  const isDomestic =
    event.country.includes("대한") ||
    event.country.includes("한국") ||
    event.country.includes("korea") ||
    event.country.includes("south korea") ||
    event.country === "kr";

  let filterCategory: EconomicEvent["filterCategory"];

  if (isEarnings) {
    filterCategory = isDomestic ? "domestic-earnings" : "foreign-earnings";
  } else {
    filterCategory = isDomestic ? "domestic-economic" : "foreign-economic";
  }

  return { ...event, filterCategory };
}

// 모든 이벤트에 filterCategory 추가
const eventsWithFilterCategory = rawEconomicEvents.map(addFilterCategory);

// filterCategory가 추가된 이벤트들을 export
export { eventsWithFilterCategory as economicEvents };

// 디버깅: 첫 번째 이벤트의 filterCategory 확인
console.log(
  "First economic event filterCategory:",
  eventsWithFilterCategory[0]?.filterCategory
);
console.log(
  "Sample economic events with filterCategory:",
  eventsWithFilterCategory.slice(0, 5).map((e) => ({
    title: e.title,
    country: e.country,
    indicator: e.indicator,
    filterCategory: e.filterCategory,
  }))
);

export const economicEventDates = Array.from(
  new Set(eventsWithFilterCategory.map((event) => event.date))
).sort();
