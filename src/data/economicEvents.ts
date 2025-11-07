export type EconomicEventCategory =
	| 'domestic-economic'
	| 'foreign-economic'
	| 'domestic-earnings'
	| 'foreign-earnings';

export type EconomicEventImportance = 'high' | 'medium' | 'low';

export type EconomicEvent = {
	id: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:MM (24h)
	timezone?: string;
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

const baseEvents: EconomicEvent[] = [
	{
		id: 'kr-bok-rate-20250227',
		date: '2025-02-27',
		time: '09:30',
		title: '한국은행 기준금리 결정',
		indicator: 'BOK Base Rate',
		country: '대한민국',
		flag: '🇰🇷',
		description: '한국은행 금융통화위원회가 기준금리를 발표합니다. 성장률과 물가 전망이 함께 공개됩니다.',
		importance: 'high',
		forecast: '연 3.00%',
		previous: '연 3.00%',
		source: 'https://www.bok.or.kr/',
		relatedThemes: ['원화', '국채', '은행주'],
		filterCategory: 'domestic-economic'
	},
	{
		id: 'kr-cpi-20250305',
		date: '2025-03-05',
		time: '08:00',
		title: '한국 소비자물가(CPI)',
		indicator: 'Consumer Price Index',
		country: '대한민국',
		flag: '🇰🇷',
		description: '한국은행의 통화정책에 직접적인 영향을 주는 핵심 물가지표입니다.',
		importance: 'high',
		forecast: '전년 대비 +2.3%',
		previous: '+2.6%',
		source: 'https://kostat.go.kr/',
		relatedThemes: ['원화', '국채', '리테일'],
		filterCategory: 'domestic-economic'
	},
	{
		id: 'kr-unemployment-20250313',
		date: '2025-03-13',
		time: '08:00',
		title: '한국 고용동향',
		indicator: 'Employment Statistics',
		country: '대한민국',
		flag: '🇰🇷',
		description: '취업자 증감과 실업률을 포함한 월간 고용 통계가 발표됩니다.',
		importance: 'medium',
		forecast: '실업률 2.9%',
		previous: '3.0%',
		source: 'https://kostat.go.kr/',
		relatedThemes: ['소비재', '증시', '국채'],
		filterCategory: 'domestic-economic'
	},
	{
		id: 'us-nfp-20250307',
		date: '2025-03-07',
		time: '22:30',
		timezone: 'KST',
		title: '미국 비농업 고용지수(NFP)',
		indicator: 'Non-Farm Payrolls',
		country: '미국',
		flag: '🇺🇸',
		description: '미국 노동시장의 탄탄함을 보여주는 대표 지표입니다.',
		importance: 'high',
		forecast: '+21만 명',
		previous: '+19만 명',
		source: 'https://www.bls.gov/',
		relatedThemes: ['달러', '미국 국채', '미 증시'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'us-cpi-20250312',
		date: '2025-03-12',
		time: '21:30',
		timezone: 'KST',
		title: '미국 소비자물가(CPI)',
		indicator: 'Consumer Price Index',
		country: '미국',
		flag: '🇺🇸',
		description: '헤드라인과 근원 CPI 모두가 둔화되는지를 시장이 주시합니다.',
		importance: 'high',
		forecast: '전년 대비 +3.1%',
		previous: '+3.2%',
		source: 'https://www.bls.gov/cpi/',
		relatedThemes: ['달러', '금', '성장주'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'us-fomc-20250319',
		date: '2025-03-19',
		time: '04:00',
		timezone: 'KST',
		title: 'FOMC 기준금리 및 점도표',
		indicator: 'Fed Rate Decision',
		country: '미국',
		flag: '🇺🇸',
		description: '미연준 기준금리 결정과 함께 점도표 및 파월 의장의 기자회견이 예정돼 있습니다.',
		importance: 'high',
		source: 'https://www.federalreserve.gov/',
		relatedThemes: ['달러', '미국 국채', '배당주'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'eu-ecb-20250313',
		date: '2025-03-13',
		time: '21:15',
		timezone: 'KST',
		title: 'ECB 통화정책 발표',
		indicator: 'ECB Rate Decision',
		country: '유로존',
		flag: '🇪🇺',
		description: '금리 결정 후 라가르드 총재의 기자회견이 예정돼 있습니다.',
		importance: 'high',
		source: 'https://www.ecb.europa.eu/',
		relatedThemes: ['유로화', '유럽 증시', '채권'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'jp-boj-20250325',
		date: '2025-03-25',
		time: '11:00',
		title: '일본은행 통화정책 결정',
		indicator: 'Bank of Japan Meeting',
		country: '일본',
		flag: '🇯🇵',
		description: '마이너스 금리 종료 이후 두 번째 회의로, 수익률곡선 통제 변화 여부가 초점입니다.',
		importance: 'high',
		source: 'https://www.boj.or.jp/en/',
		relatedThemes: ['엔화', '닛케이225', '글로벌 채권'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'kr-samsung-earnings-20250404',
		date: '2025-04-04',
		time: '07:30',
		title: '삼성전자 1분기 잠정 실적',
		indicator: 'Samsung Electronics Earnings Flash',
		country: '대한민국',
		flag: '🇰🇷',
		description: '메모리 반도체 업황 회복과 AI 수요가 실적에 반영되는지 확인합니다.',
		importance: 'high',
		forecast: '영업이익 9.1조 원',
		source: 'https://www.samsung.com/sec/ir/',
		relatedThemes: ['반도체', 'KRX', 'AI'],
		filterCategory: 'domestic-earnings'
	},
	{
		id: 'kr-hyundai-earnings-20250425',
		date: '2025-04-25',
		time: '08:00',
		title: '현대차 1분기 실적 발표',
		indicator: 'Hyundai Motor Earnings',
		country: '대한민국',
		flag: '🇰🇷',
		description: '전기차 판매와 북미 공장 가동률 개선이 실적에 어떤 영향을 주는지 확인합니다.',
		importance: 'medium',
		forecast: '영업이익 2.8조 원',
		source: 'https://www.hyundai.com/kr/company/ir/finance',
		relatedThemes: ['전기차', '자동차', 'KRX'],
		filterCategory: 'domestic-earnings'
	},
	{
		id: 'us-nvidia-earnings-20250515',
		date: '2025-05-15',
		time: '17:00',
		title: '엔비디아 FY2025 1분기 실적',
		indicator: 'NVIDIA Earnings Call',
		country: '미국',
		flag: '🇺🇸',
		description: '데이터센터 매출과 신규 GPU 로드맵 업데이트가 관건입니다.',
		importance: 'high',
		forecast: '매출 250억 달러',
		source: 'https://investor.nvidia.com/',
		relatedThemes: ['AI', '반도체 장비', '미 증시'],
		filterCategory: 'foreign-earnings'
	},
	{
		id: 'us-pmi-20250401',
		date: '2025-04-01',
		time: '22:45',
		timezone: 'KST',
		title: '미국 ISM 제조업 PMI',
		indicator: 'ISM Manufacturing PMI',
		country: '미국',
		flag: '🇺🇸',
		description: '제조업 경기 확장(50 이상) 여부가 시장의 주목을 받습니다.',
		importance: 'medium',
		forecast: '50.6',
		previous: '49.8',
		source: 'https://www.ismworld.org/',
		relatedThemes: ['원자재', '달러', '미 증시'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'eu-hicp-20250402',
		date: '2025-04-02',
		time: '18:00',
		timezone: 'KST',
		title: '유로존 소비자물가(HICP) 속보치',
		indicator: 'Eurozone HICP Flash',
		country: '유로존',
		flag: '🇪🇺',
		description: 'ECB 금리 경로를 좌우할 핵심 물가 지표입니다.',
		importance: 'high',
		forecast: '전년 대비 +2.5%',
		previous: '+2.6%',
		source: 'https://ec.europa.eu/eurostat/',
		relatedThemes: ['유로화', '유럽 증시', '채권'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'cn-gdp-20250416',
		date: '2025-04-16',
		time: '11:00',
		title: '중국 1분기 GDP',
		indicator: 'China GDP YoY',
		country: '중국',
		flag: '🇨🇳',
		description: '중국 성장률이 5% 목표에 근접하는지 여부가 핵심입니다.',
		importance: 'high',
		forecast: '+4.8%',
		previous: '+4.9%',
		source: 'http://www.stats.gov.cn/',
		relatedThemes: ['원자재', '신흥국', '위안화'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'us-pce-20250426',
		date: '2025-04-26',
		time: '21:30',
		timezone: 'KST',
		title: '미국 근원 PCE 물가지수',
		indicator: 'Core PCE',
		country: '미국',
		flag: '🇺🇸',
		description: '연준이 가장 선호하는 물가지표로, 금리 전망에 직접적인 영향을 줍니다.',
		importance: 'high',
		forecast: '전년 대비 +2.7%',
		previous: '+2.8%',
		source: 'https://www.bea.gov/',
		relatedThemes: ['달러', '국채', '성장주'],
		filterCategory: 'foreign-economic'
	},
	{
		id: 'kr-export-20250401',
		date: '2025-04-01',
		time: '08:00',
		title: '한국 수출입 동향',
		indicator: 'Trade Balance',
		country: '대한민국',
		flag: '🇰🇷',
		description: '수출 증감률과 무역수지가 발표됩니다. 반도체 및 자동차 수출이 핵심입니다.',
		importance: 'medium',
		forecast: '수출 +8.2% YoY',
		source: 'https://www.customs.go.kr/',
		relatedThemes: ['반도체', '자동차', 'KRX'],
		filterCategory: 'domestic-economic'
	},
	{
		id: 'kr-corp-tax-20250331',
		date: '2025-03-31',
		time: '08:00',
		title: '한국 법인세 성수기 납부 마감',
		indicator: 'Corporate Tax Filing',
		country: '대한민국',
		flag: '🇰🇷',
		description: '주요 대기업의 현금유동성과 배당 전략에 영향을 미치는 일정입니다.',
		importance: 'medium',
		source: 'https://www.nts.go.kr/',
		relatedThemes: ['배당', '은행주', '원화'],
		filterCategory: 'domestic-earnings'
	},
	{
		id: 'us-tech-summit-20250409',
		date: '2025-04-09',
		time: '20:00',
		timezone: 'KST',
		title: '미국 빅테크 AI 컨퍼런스',
		indicator: 'Tech Industry Summit',
		country: '미국',
		flag: '🇺🇸',
		description: '에너지 효율과 AI 서버 수요 전망이 논의되는 업계 대규모 행사입니다.',
		importance: 'medium',
		source: 'https://www.techsummit.com/',
		relatedThemes: ['AI', '데이터센터', '에너지'],
		filterCategory: 'foreign-earnings'
	}
];

const cloneForRange = (events: EconomicEvent[], rangeStart: string, rangeEnd: string) => {
	const start = new Date(rangeStart);
	const end = new Date(rangeEnd);

	const clones: EconomicEvent[] = [];

	for (const event of events) {
		const baseDate = new Date(event.date);
		if (baseDate >= start && baseDate <= end) {
			clones.push(event);
			continue;
		}
		const monthDiff = (end.getFullYear() - baseDate.getFullYear()) * 12 + (end.getMonth() - baseDate.getMonth());
		for (let offset = 0; offset <= monthDiff; offset++) {
			const cloneDate = new Date(baseDate);
			cloneDate.setMonth(baseDate.getMonth() + offset);
			if (cloneDate < start || cloneDate > end) continue;

			const cloned: EconomicEvent = {
				...event,
				id: `${event.id}-m${offset}`,
				date: cloneDate.toISOString().slice(0, 10)
			};
			clones.push(cloned);
		}
	}

	return clones.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
};

const today = new Date();
const sixMonthAhead = new Date(today);
sixMonthAhead.setMonth(today.getMonth() + 6);

export const economicEvents: EconomicEvent[] = cloneForRange(
	baseEvents,
	today.toISOString().slice(0, 10),
	sixMonthAhead.toISOString().slice(0, 10)
);
