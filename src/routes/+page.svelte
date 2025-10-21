<script lang="ts">
	import ChartWindow from '$lib/components/ChartWindow.svelte';
	import InfoWindow from '$lib/components/InfoWindow.svelte';
	import { instruments } from '$lib/data/instruments';

	type Section = 'chart' | 'events' | 'sns' | 'news' | 'community';
	type Mode = 'general' | 'pro';

	const sections: { id: Section; label: string }[] = [
		{ id: 'chart', label: '차트보기' },
		{ id: 'events', label: '경제 이벤트' },
		{ id: 'sns', label: 'SNS' },
		{ id: 'news', label: '뉴스' },
		{ id: 'community', label: '커뮤니티' }
	];

	const instrumentMap = new Map(instruments.map((instrument) => [instrument.id, instrument] as const));

type EconomicEvent = {
	time: string;
	region: string;
	title: string;
	impact: '높음' | '중간' | '낮음';
	description: string;
	details: string;
};

const economicEvents: EconomicEvent[] = [
	{
		time: '08:30',
		region: '미국',
		title: '비농업 고용지수(NFP)',
		impact: '높음',
		description: '미국 경제의 고용 흐름을 보여주는 대표 지표로, 연준 정책 판단에 큰 영향을 줍니다.',
		details:
			'이번 달 예상치는 20만 명 초반, 이전 발표(18.7만 명) 대비 소폭 증가할 것으로 시장은 보고 있습니다. 발표 직후 달러 강세·약세, 채권 금리 방향에 주목하세요.'
	},
	{
		time: '10:00',
		region: '미국',
		title: 'ISM 제조업 PMI',
		impact: '중간',
		description: '제조업체 구매 담당자들의 경기 체감을 집계한 지수로, 50 이상이면 확장 국면으로 해석합니다.',
		details:
			'최근 6개월 연속 50 미만을 기록하며 둔화가 이어졌습니다. 이번 발표에서 50선 돌파 여부가 관건이며, 달러·원자재 시장 변동성에 영향이 예상됩니다.'
	},
	{
		time: '11:00',
		region: '유럽',
		title: 'ECB 총재 연설',
		impact: '높음',
		description: '유럽중앙은행 총재의 발언은 향후 금리 경로와 유로화 흐름에 직접적인 방향성을 제시합니다.',
		details:
			'최근 경기 둔화 우려 속에서도 물가 압력은 여전히 높다는 평가가 많습니다. 완화적 뉘앙스가 나오면 유로화 약세, 반대 경우에는 강세로 이어질 수 있습니다.'
	},
	{
		time: '22:30',
		region: '한국',
		title: '소비자물가(CPI) 발표',
		impact: '높음',
		description: '한국의 물가 흐름을 보여주는 대표 지표로, 기준금리 결정에 선행 지표 역할을 합니다.',
		details:
			'에너지와 식료품 가격 하락이 이어지며 최근 둔화 흐름을 보이고 있습니다. 예상치보다 낮게 나오면 금리 인하 기대가 커질 수 있습니다.'
	}
];

type SNSPlatform = {
	id: string;
	label: string;
	description: string;
	posts: Array<{
		nickname: string;
		handle: string;
		avatar: string;
		content: string;
		timeAgo: string;
		detail: string;
	}>;
};

	const snsPlatforms: SNSPlatform[] = [
		{
			id: 'x',
			label: 'X (Twitter)',
			description: '실시간 글로벌 트레이더 이슈를 확인해요.',
			posts: [
				{
					nickname: 'Macro Watch',
					handle: '@macro_watch',
					avatar: 'https://ui-avatars.com/api/?name=MW&background=1d4ed8&color=fff',
					content: '美 국채금리 하락에 기술주 선물 상승. CPI 발표 앞두고 변동성 주의!',
					timeAgo: '5분 전',
					detail:
						'10년물 국채금리가 4% 초반대로 내려오면서 나스닥 선물이 동반 상승 중입니다. 아직 CPI 발표가 남아 있어 포지션은 가볍게 유지하는 것이 좋겠습니다.'
				},
				{
					nickname: 'Chain Alpha',
					handle: '@chainalpha',
					avatar: 'https://ui-avatars.com/api/?name=CA&background=0f172a&color=fff',
					content: '비트코인 ETF 5거래일 연속 순유입. 내일 FOMC 의사록이 방향성 결정할 듯.',
					timeAgo: '14분 전',
					detail:
						'현물 ETF 자금 흐름이 강하게 들어오고 있습니다. 다만 연준 의사록에서 매파적 메시지가 나오면 단기 조정이 나올 수 있어 분할 매수 전략을 추천합니다.'
				},
				{
					nickname: 'Asia Markets',
					handle: '@asia_markets',
					avatar: 'https://ui-avatars.com/api/?name=AM&background=4c1d95&color=fff',
					content: '닛케이 지수 사상 최고치 근접. 엔화 약세 지속.',
					timeAgo: '27분 전',
					detail:
						'엔화 추가 약세와 실적 기대감이 맞물리며 닛케이 지수가 30년 만에 최고치를 재차 노립니다. 일본 은행주의 배당 확대도 동반 호재입니다.'
				}
			]
		},
		{
			id: 'facebook',
			label: '페이스북',
			description: '국내외 투자 커뮤니티 요약을 모았어요.',
			posts: [
				{
					nickname: 'K-Value 투자모임',
					handle: 'facebook.com/kvalue',
					avatar: 'https://ui-avatars.com/api/?name=KV&background=14532d&color=fff',
					content: '삼성전자 배당 확대 가능성으로 장 초반 강세. 반도체 업황 개선 기대감 상승.',
					timeAgo: '12분 전',
					detail:
						'배당 확대설과 DDR5 수요 회복 기대가 동시에 반영되며 외국인 매수세가 유입 중입니다. 목표 주가 상향 리포트도 속속 나오고 있습니다.'
				},
				{
					nickname: '글로벌 ETF 연구소',
					handle: 'facebook.com/etfresearch',
					avatar: 'https://ui-avatars.com/api/?name=ETF&background=0f766e&color=fff',
					content: '인공지능(AI) 테마 ETF 자금 유입이 다시 증가하고 있습니다.',
					timeAgo: '24분 전',
					detail:
						'최근 2주 연속 순유입이 나타나고 있습니다. 특히 미국 상장 SOXX·SMH ETF의 거래대금이 크게 늘었으며, 관련 장비주에도 확산되는 분위기입니다.'
				},
				{
					nickname: '미국주식 토론방',
					handle: 'facebook.com/usstocktalk',
					avatar: 'https://ui-avatars.com/api/?name=US&background=9d174d&color=fff',
					content: '테슬라 주가 급락, 다음 주 실적 발표 앞두고 변동성 커질 전망.',
					timeAgo: '38분 전',
					detail:
						'가격 인하 압박과 공급망 리스크가 재차 부각되며 변동성이 확대됐습니다. 실적 발표 전후로 옵션 변동성 매매에 유리한 구간이 열릴 수 있습니다.'
				}
			]
		}
];

const snsPlatformMap = new Map(snsPlatforms.map((platform) => [platform.id, platform] as const));

type NewsSource = {
	id: string;
	label: string;
	region: string;
	headlines: Array<{ title: string; timeAgo: string; summary: string; body: string }>;
};

const newsSources: NewsSource[] = [
		{
			id: 'reuters',
			label: '로이터',
			region: '글로벌',
			headlines: [
				{
					title: 'FOMC 의사록 공개 앞두고 미 증시 혼조세',
					timeAgo: '7분 전',
					summary: '연준의 긴축 경로를 주시하는 투자자들로 인해 뉴욕증시가 혼조세를 보이고 있습니다.',
					body: '시장은 연준이 얼마나 오래 높은 금리를 유지할지를 가늠하려 하고 있습니다. 기술주와 에너지주는 각각 금리 전망과 유가 상승에 따라 엇갈린 흐름을 보였습니다.'
				},
				{
					title: '중국, 경기 부양 위해 추가 금리 인하 시사',
					timeAgo: '21분 전',
					summary: '중국 정부가 성장 둔화 대응 차원에서 추가 금리 인하 가능성을 언급했습니다.',
					body: '부동산 침체와 내수 부진이 장기화되면서 추가 부양책이 필요하다는 목소리가 커지고 있습니다. 위안화 약세와 글로벌 상품 수요 변화에도 영향을 미칠 전망입니다.'
				},
				{
					title: '유가, 공급 우려에 1% 상승 마감',
					timeAgo: '35분 전',
					summary: '중동 지역 공급 차질 우려가 지속되며 국제유가가 상승 마감했습니다.',
					body: 'WTI 선물은 배럴당 1% 이상 상승했고, OPEC+의 감산 준수 여부에 시장 관심이 쏠려 있습니다. 에너지 관련 주식과 인플레이션 기대치에도 영향을 줄 수 있습니다.'
				}
			]
		},
		{
			id: 'bloomberg',
			label: '블룸버그',
			region: '미국',
			headlines: [
				{
					title: 'AI 투자붐, 반도체 업종 실적 기대치 상향',
					timeAgo: '10분 전',
					summary: 'AI 데이터센터 투자가 확대되며 반도체 기업들의 실적 전망치가 상향되고 있습니다.',
					body: 'NVIDIA, AMD 등 주요 기업의 매출 가이던스가 상향 조정되면서 관련 공급망 전반이 수혜를 받고 있습니다. 장비 업체와 소재 업체까지 긍정적 파급이 예상됩니다.'
				},
				{
					title: '달러 강세 지속, 신흥국 통화 약세 압박',
					timeAgo: '32분 전',
					summary: '연준의 매파적 기조와 높은 금리가 달러 강세를 유지하게 만들고 있습니다.',
					body: '신흥국 통화는 자본 유출 압력을 받고 있으며, 일부 국가는 외환 방어선을 복원하기 위한 정책을 검토 중입니다.'
				},
				{
					title: '월가, 연말 S&P 500 목표가 상향 조정',
					timeAgo: '48분 전',
					summary: '주요 IB들이 미국 증시의 연말 목표치를 상향 조정했습니다.',
					body: '기업 실적이 예상을 웃돌고 경기 연착륙 시나리오가 힘을 받으면서, 투자심리가 개선됐다는 분석입니다. 다만 성장주와 가치주의 온도 차는 여전하다는 지적도 나옵니다.'
				}
			]
		},
		{
			id: 'bbc',
			label: 'BBC',
			region: '영국',
			headlines: [
				{
					title: '영란은행, 인플레이션 경로 재점검 착수',
					timeAgo: '15분 전',
					summary: '영란은행이 물가 경로를 재점검하며 향후 금리 인하 가능성을 열어두고 있습니다.',
					body: '임금 상승률 둔화에도 서비스 물가가 높은 수준을 유지하고 있어, 완만한 금리 인하가 논의될 전망입니다.'
				},
				{
					title: '유럽 제조업 경기 침체 우려 재부상',
					timeAgo: '36분 전',
					summary: '유럽 제조업 PMI가 50 이하에서 머물며 경기 침체 우려가 재부각됐습니다.',
					body: '독일과 프랑스의 생산 지표가 예상에 못 미쳤고, 고금리 환경과 수요 부진이 동반되면서 회복이 지연되고 있습니다.'
				}
			]
		},
		{
			id: 'joongang',
			label: '중앙일보',
			region: '한국',
			headlines: [
				{
					title: '한국은행, 기준금리 동결…성장률 전망 유지',
					timeAgo: '9분 전',
					summary: '한은이 기준금리를 동결하면서 성장률 전망을 유지했습니다.',
					body: '물가 둔화와 경기 둔화가 동시에 나타나는 가운데, 추가 금리 인상 가능성은 낮다는 평가가 나옵니다. 시장은 연말 인하 가능성에 관심을 기울이고 있습니다.'
				},
				{
					title: '코스피, 외국인 순매수에 장중 2,700선 회복',
					timeAgo: '28분 전',
					summary: '외국인 매수세 덕분에 코스피가 장중 2,700선을 회복했습니다.',
					body: '반도체와 2차전지 업종이 강세를 보였으며, 원화 강세 흐름도 투자심리를 지지했습니다.'
				},
				{
					title: '정부, 반도체 투자 세액공제 확대 검토',
					timeAgo: '41분 전',
					summary: '정부가 반도체 산업 투자 세액공제를 확대하는 방안을 검토 중입니다.',
					body: '글로벌 경쟁 심화에 대응하기 위해 대규모 투자를 지원할 필요가 있다는 판단이며, 세부 시행계획은 다음 달 발표될 예정입니다.'
				}
			]
		},
		{
			id: 'nikkei',
			label: '닛케이',
			region: '일본',
			headlines: [
				{
					title: '일본 증시, 엔화 약세에 34년 만의 최고치',
					timeAgo: '18분 전',
					summary: '엔화 약세가 지속되며 일본 증시가 30년 넘게 유지되던 박스를 돌파했습니다.',
					body: '수출기업 실적 개선 기대감과 함께 일본 은행주, 자동차주 등이 강세를 보이고 있습니다.'
				},
				{
					title: '도요타, 전기차 생산 확대 계획 발표',
					timeAgo: '44분 전',
					summary: '도요타가 전기차 생산 목표를 상향 조정했습니다.',
					body: '배터리 효율 개선과 생산 공정 자동화를 통해 2030년까지 전기차 판매 비중을 40%까지 끌어올린다는 계획입니다.'
				}
			]
		},
		{
			id: 'cnbc',
			label: 'CNBC',
			region: '미국',
			headlines: [
				{
					title: '테크 기업들, AI 인력 채용 경쟁 가열',
					timeAgo: '6분 전',
					summary: 'AI 기술력 확보를 위한 인재 확보 경쟁이 심화되고 있습니다.',
					body: '구글, 마이크로소프트 등 대형 테크 기업이 경쟁적으로 연봉을 상향 조정하며 핵심 인재 확보에 나섰습니다.'
				},
				{
					title: '국제유가 상승에 항공주 약세',
					timeAgo: '25분 전',
					summary: '유가 상승이 항공 업계 비용 부담으로 이어지며 항공주가 약세를 보였습니다.',
					body: '특히 장거리 노선을 보유한 항공사부터 연료비 부담이 반영되었으며, 향후 운임 인상 여부가 관건입니다.'
				}
			]
		}
];

	const newsSourceMap = new Map(newsSources.map((source) => [source.id, source] as const));

type WindowBase = {
	key: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	z: number;
};

type ChartWindowState = WindowBase & { type: 'chart'; instrumentId: string };
type EventsWindowState = WindowBase & { type: 'events'; view: 'list' | 'detail'; selectedIndex: number | null };
type SNSWindowState = WindowBase & { type: 'sns'; platform: string; view: 'list' | 'detail'; selectedIndex: number | null };
type NewsWindowState = WindowBase & { type: 'news'; source: string; view: 'list' | 'detail'; selectedIndex: number | null };

type WindowState = ChartWindowState | EventsWindowState | SNSWindowState | NewsWindowState;

let mode: Mode = 'pro';
	let hoveredSection: Section | null = null;
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;
	let activeSection: Section | null = 'chart';
	let navHeight = 72;
	let zCounter = 5;
	let windows: WindowState[] = [];

	const setMode = (nextMode: Mode) => {
		mode = nextMode;
	};

	const cancelHoverHide = () => {
		if (hoverTimer) {
			clearTimeout(hoverTimer);
			hoverTimer = null;
		}
	};

	const scheduleHoverHide = () => {
		cancelHoverHide();
		hoverTimer = setTimeout(() => {
			hoveredSection = null;
		}, 150);
	};

	const showMenuModal = (section: Section) => {
		cancelHoverHide();
		hoveredSection = section;
		activeSection = section;
	};

	const handleMenuClick = (section: Section) => {
		showMenuModal(section);
	};

	const createWindowPosition = () => {
		const offset = windows.length;
		const baseX = 36 + (offset % 4) * 48;
		const baseY = navHeight + 24 + offset * 30;
		return { x: baseX, y: baseY };
	};
	
const bringToFront = (key: string) => {
	zCounter += 1;
	windows = windows.map((window) => (window.key === key ? { ...window, z: zCounter } : window));
};

const updateWindowState = (key: string, updater: (window: WindowState) => WindowState) => {
	windows = windows.map((window) => (window.key === key ? updater(window) : window));
};

const handleMove = (key: string, detail: { x: number; y: number }) => {
	windows = windows.map((window) =>
		window.key === key ? { ...window, position: { x: detail.x, y: detail.y } } : window
	);
};

	const handleResize = (key: string, detail: { width: number; height: number }) => {
		windows = windows.map((window) =>
			window.key === key ? { ...window, size: { width: detail.width, height: detail.height } } : window
		);
	};

	const closeWindow = (key: string) => {
		windows = windows.filter((window) => window.key !== key);
	};

	const openChart = (instrumentId: string) => {
		const key = `chart:${instrumentId}`;
		const existing = windows.find((window) => window.key === key);
		if (existing) {
			bringToFront(key);
			return;
		}

		const position = createWindowPosition();
		const nextWindow: ChartWindowState = {
			key,
			type: 'chart',
			instrumentId,
			position,
			size: { width: 380, height: 260 },
			z: ++zCounter
		};

		windows = [...windows, nextWindow];
	};

	const openEventsWindow = () => {
		const key = 'events:schedule';
		const existing = windows.find((window) => window.key === key);
		if (existing) {
			bringToFront(key);
			return;
		}

		const position = createWindowPosition();
	const nextWindow: EventsWindowState = {
		key,
		type: 'events',
		position,
		size: { width: 420, height: 320 },
		z: ++zCounter,
		view: 'list',
		selectedIndex: null
	};

	windows = [...windows, nextWindow];
};

	const openSNSWindow = (platformId: string) => {
		if (!snsPlatformMap.has(platformId)) return;
		const key = `sns:${platformId}`;
		const existing = windows.find((window) => window.key === key);
		if (existing) {
			bringToFront(key);
			return;
		}

		const position = createWindowPosition();
	const nextWindow: SNSWindowState = {
		key,
		type: 'sns',
		platform: platformId,
		position,
		size: { width: 360, height: 340 },
		z: ++zCounter,
		view: 'list',
		selectedIndex: null
	};

	windows = [...windows, nextWindow];
};

	const openNewsWindow = (sourceId: string) => {
		if (!newsSourceMap.has(sourceId)) return;
		const key = `news:${sourceId}`;
		const existing = windows.find((window) => window.key === key);
		if (existing) {
			bringToFront(key);
			return;
		}

		const position = createWindowPosition();
	const nextWindow: NewsWindowState = {
		key,
		type: 'news',
		source: sourceId,
		position,
		size: { width: 420, height: 360 },
		z: ++zCounter,
		view: 'list',
		selectedIndex: null
	};

	windows = [...windows, nextWindow];
};

	const isInstrumentActive = (instrumentId: string) =>
		windows.some((window) => window.type === 'chart' && window.instrumentId === instrumentId);

	const isEventsActive = () => windows.some((window) => window.type === 'events');
	const isSNSActive = (platformId: string) =>
		windows.some((window) => window.type === 'sns' && window.platform === platformId);
	const isNewsActive = (sourceId: string) =>
		windows.some((window) => window.type === 'news' && window.source === sourceId);

	const selectInstrument = (instrumentId: string) => {
		openChart(instrumentId);
		hoveredSection = null;
	};

	const openEventsFromMenu = () => {
		openEventsWindow();
		hoveredSection = null;
	};

	const openSNSFromMenu = (platformId: string) => {
		openSNSWindow(platformId);
		hoveredSection = null;
	};

const openNewsFromMenu = (sourceId: string) => {
	openNewsWindow(sourceId);
	hoveredSection = null;
};

const openEventDetail = (key: string, index: number) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'events') return window;
		return { ...window, view: 'detail', selectedIndex: index };
	});
};

const closeEventDetail = (key: string) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'events') return window;
		return { ...window, view: 'list', selectedIndex: null };
	});
};

const openSNSDetail = (key: string, index: number) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'sns') return window;
		return { ...window, view: 'detail', selectedIndex: index };
	});
};

const closeSNSDetail = (key: string) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'sns') return window;
		return { ...window, view: 'list', selectedIndex: null };
	});
};

const openNewsDetail = (key: string, index: number) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'news') return window;
		return { ...window, view: 'detail', selectedIndex: index };
	});
};

const closeNewsDetail = (key: string) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'news') return window;
		return { ...window, view: 'list', selectedIndex: null };
	});
};
</script>

<div class="layout">
	<nav class="top-nav" bind:clientHeight={navHeight} on:pointerenter={cancelHoverHide} on:pointerleave={scheduleHoverHide}>
		<div class="brand">
			<span class="brand__logo">INVEST</span>
			<span class="brand__mode">{mode === 'pro' ? 'PRO' : 'BASIC'} HTS</span>
		</div>

		<ul class="menu" role="tablist">
			{#each sections as section}
				<li>
					<button
						role="tab"
						type="button"
						class:active={activeSection === section.id}
						on:click={() => handleMenuClick(section.id)}
						on:pointerenter={() => showMenuModal(section.id)}
						on:focus={() => showMenuModal(section.id)}
						aria-selected={activeSection === section.id}
					>
						{section.label}
					</button>
				</li>
			{/each}
		</ul>

		<div class="mode-toggle" role="group" aria-label="화면 모드 전환">
			<button
				type="button"
				class:active={mode === 'general'}
				on:click={() => setMode('general')}
			>
				일반
			</button>
			<button
				type="button"
				class:active={mode === 'pro'}
				on:click={() => setMode('pro')}
			>
				트레이딩
			</button>
		</div>
	</nav>

	{#if hoveredSection}
		<div class="menu-modal" style={`top: ${navHeight + 12}px;`}>
			<section class="menu-modal__panel" on:pointerenter={cancelHoverHide} on:pointerleave={scheduleHoverHide}>
				{#if hoveredSection === 'chart'}
					<header class="menu-modal__header">
						<h3>차트보기</h3>
						<p>모든 종목 차트를 창 형태로 띄우고 자유롭게 이동하세요.</p>
					</header>
					<div class="instrument-list">
						{#each instruments as instrument}
							<button
								type="button"
								class:active={isInstrumentActive(instrument.id)}
								on:click={() => selectInstrument(instrument.id)}
							>
								<span class="dot" style={`background:${instrument.color};`} aria-hidden="true"></span>
								<span class="name">{instrument.name}</span>
								<span class="symbol">{instrument.symbol}</span>
							</button>
						{/each}
					</div>
				{:else if hoveredSection === 'events'}
					<header class="menu-modal__header">
						<h3>경제 이벤트</h3>
						<p>오늘 예정된 발표 일정을 빠르게 훑어보세요.</p>
					</header>
					<ul class="modal-list">
						{#each economicEvents.slice(0, 3) as event}
							<li>
								<strong>{event.time}</strong>
								<span>{event.region} · {event.title}</span>
								<p class="modal-note">{event.description}</p>
							</li>
						{/each}
					</ul>
					<button
						type="button"
						class="modal-action"
						class:disabled={isEventsActive()}
						on:click={openEventsFromMenu}
						disabled={isEventsActive()}
					>
						{isEventsActive() ? '경제 이벤트 창이 열려 있습니다' : '경제 이벤트 창 열기'}
					</button>
				{:else if hoveredSection === 'sns'}
					<header class="menu-modal__header">
						<h3>SNS</h3>
						<p>원하는 플랫폼의 실시간 투자 커뮤니티를 선택하세요.</p>
					</header>
					<div class="option-grid">
						{#each snsPlatforms as platform}
							<button
								type="button"
								class="option-card"
								class:active={isSNSActive(platform.id)}
								on:click={() => openSNSFromMenu(platform.id)}
							>
								<span class="option-card__badge">{platform.label}</span>
								<p>{platform.description}</p>
								<span class="option-card__meta">최근 업데이트 {platform.posts[0]?.timeAgo}</span>
							</button>
						{/each}
					</div>
				{:else if hoveredSection === 'news'}
					<header class="menu-modal__header">
						<h3>뉴스</h3>
						<p>글로벌 주요 언론사의 헤드라인을 창으로 띄울 수 있어요.</p>
					</header>
					<div class="option-grid news-grid">
						{#each newsSources as source}
							<button
								type="button"
								class="option-card"
								class:active={isNewsActive(source.id)}
								on:click={() => openNewsFromMenu(source.id)}
							>
								<span class="option-card__badge">{source.label}</span>
								<p>{source.region} · 최신 {source.headlines.length}건 헤드라인</p>
							</button>
						{/each}
					</div>
				{:else}
					<header class="menu-modal__header">
						<h3>커뮤니티</h3>
						<p>트레이더 커뮤니티 기능은 준비 중입니다.</p>
					</header>
					<div class="modal-placeholder">
						<p>곧 커뮤니티 기능을 만나보실 수 있어요.</p>
					</div>
				{/if}
			</section>
		</div>
	{/if}

	<main class="workspace" style={`padding-top: ${navHeight}px;`}>
		<section class="chart-stage" style={`--nav-offset: ${navHeight}px;`}>
			<div class="chart-grid"></div>
			{#if windows.length === 0}
				<div class="empty-state">
					<p>상단 메뉴에서 차트, 경제 이벤트, SNS, 뉴스 등을 선택해 창을 띄워보세요.</p>
				</div>
			{/if}
		</section>

		{#each windows as window (window.key)}
			{#if window.type === 'chart'}
				{#if instrumentMap.has(window.instrumentId)}
					<ChartWindow
						instrument={instrumentMap.get(window.instrumentId)!}
						position={window.position}
						size={window.size}
						zIndex={window.z}
						lockedTop={navHeight}
						on:move={(event) => handleMove(window.key, event.detail)}
						on:resize={(event) => handleResize(window.key, event.detail)}
						on:focus={() => bringToFront(window.key)}
						on:close={() => closeWindow(window.key)}
					/>
				{/if}
			{:else if window.type === 'events'}
				<InfoWindow
					title="경제 이벤트 일정"
					subtitle="발표 시간과 전망치를 한눈에"
					position={window.position}
					size={window.size}
					zIndex={window.z}
					lockedTop={navHeight}
					minWidth={360}
					minHeight={260}
					on:move={(event) => handleMove(window.key, event.detail)}
					on:resize={(event) => handleResize(window.key, event.detail)}
					on:focus={() => bringToFront(window.key)}
					on:close={() => closeWindow(window.key)}
				>
					{#if window.view === 'detail' && window.selectedIndex !== null}
						{@const event = economicEvents[window.selectedIndex]}
						<div class="detail-view">
							<button type="button" class="detail-back" on:click={() => closeEventDetail(window.key)}>
								← 뒤로가기
							</button>
							{#if event}
								<div class="detail-header">
									<span class="badge">{event.time}</span>
									<div class="detail-titles">
										<h4>{event.title}</h4>
													<span class="meta">{event.region}</span>
									</div>
								</div>
								<p class="detail-description">{event.description}</p>
								<p class="detail-body">{event.details}</p>
							{:else}
								<p class="detail-description">선택한 이벤트 정보를 불러오지 못했습니다.</p>
							{/if}
						</div>
					{:else}
						<ul class="window-list window-list--events">
							{#each economicEvents as event, index}
								<li>
									<button type="button" class="list-button" on:click={() => openEventDetail(window.key, index)}>
										<div class="event-main">
											<span class="badge">{event.time}</span>
											<div class="event-info">
												<strong>{event.title}</strong>
												<span class="meta">{event.region}</span>
											</div>
										</div>
										<p class="list-description">{event.description}</p>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</InfoWindow>
			{:else if window.type === 'sns'}
				{#if snsPlatformMap.has(window.platform)}
					{@const platform = snsPlatformMap.get(window.platform)!}
					<InfoWindow
						title={`SNS — ${platform.label}`}
						subtitle={platform.description}
						position={window.position}
						size={window.size}
						zIndex={window.z}
						lockedTop={navHeight}
						minWidth={320}
						minHeight={280}
						on:move={(event) => handleMove(window.key, event.detail)}
						on:resize={(event) => handleResize(window.key, event.detail)}
						on:focus={() => bringToFront(window.key)}
						on:close={() => closeWindow(window.key)}
					>
				{#if window.view === 'detail' && window.selectedIndex !== null}
					{@const post = platform.posts[window.selectedIndex]}
					<div class="detail-view">
						<button type="button" class="detail-back" on:click={() => closeSNSDetail(window.key)}>
							← 뒤로가기
						</button>
						{#if post}
							<div class="sns-detail-profile">
								<img src={post.avatar} alt={`${post.nickname} avatar`} />
								<div>
									<strong>{post.nickname}</strong>
									<span class="meta">{post.handle} · {post.timeAgo}</span>
								</div>
							</div>
							<p class="detail-description">{post.content}</p>
							<p class="detail-body">{post.detail}</p>
						{:else}
							<p class="detail-description">선택된 게시글을 찾을 수 없습니다.</p>
						{/if}
					</div>
						{:else}
							<ul class="window-list window-list--sns">
								{#each platform.posts as post, index}
									<li>
										<button type="button" class="list-button sns-button" on:click={() => openSNSDetail(window.key, index)}>
											<div class="sns-profile">
												<img src={post.avatar} alt={`${post.nickname} avatar`} />
												<div>
													<span class="sns-author">{post.nickname}</span>
													<span class="sns-handle">{post.handle}</span>
												</div>
											</div>
											<p>{post.content}</p>
											<span class="sns-time">{post.timeAgo}</span>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</InfoWindow>
				{/if}
			{:else if window.type === 'news'}
				{#if newsSourceMap.has(window.source)}
					{@const source = newsSourceMap.get(window.source)!}
					<InfoWindow
						title={`뉴스 — ${source.label}`}
						subtitle={`${source.region} 주요 헤드라인`}
						position={window.position}
						size={window.size}
						zIndex={window.z}
						lockedTop={navHeight}
						minWidth={360}
						minHeight={280}
						on:move={(event) => handleMove(window.key, event.detail)}
						on:resize={(event) => handleResize(window.key, event.detail)}
						on:focus={() => bringToFront(window.key)}
						on:close={() => closeWindow(window.key)}
					>
				{#if window.view === 'detail' && window.selectedIndex !== null}
					{@const headline = source.headlines[window.selectedIndex]}
					<div class="detail-view">
						<button type="button" class="detail-back" on:click={() => closeNewsDetail(window.key)}>
							← 뒤로가기
						</button>
						{#if headline}
							<div class="detail-header">
								<h4>{headline.title}</h4>
								<span class="meta">{headline.timeAgo}</span>
							</div>
							<p class="detail-description">{headline.summary}</p>
							<p class="detail-body">{headline.body}</p>
						{:else}
							<p class="detail-description">선택한 뉴스 기사를 표시하지 못했습니다.</p>
						{/if}
					</div>
						{:else}
							<ol class="window-list window-list--news">
								{#each source.headlines as headline, index}
									<li>
										<button type="button" class="list-button news-button" on:click={() => openNewsDetail(window.key, index)}>
											<span class="news-index">{index + 1}</span>
											<div class="news-body">
												<strong>{headline.title}</strong>
												<span class="meta">{headline.timeAgo}</span>
												<p class="list-description">{headline.summary}</p>
											</div>
										</button>
									</li>
								{/each}
							</ol>
						{/if}
					</InfoWindow>
				{/if}
			{/if}
		{/each}
	</main>
</div>

<style>
	:global(body) {
		background: radial-gradient(circle at top, #040c18 0%, #030712 38%, #02040a 100%);
		color: #f0f6ff;
		font-family: 'Inter', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
		min-height: 100vh;
		margin: 0;
	}

	.layout {
		min-height: 100vh;
	}

	.top-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 28px;
		backdrop-filter: blur(18px);
		background: rgba(3, 8, 20, 0.86);
		border-bottom: 1px solid rgba(35, 50, 72, 0.65);
		z-index: 1000;
		gap: 24px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.brand__logo {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 10px;
		border-radius: 10px;
		background: linear-gradient(135deg, #4f46e5, #9333ea);
		font-size: 0.75rem;
	}

	.brand__mode {
		color: rgba(210, 224, 255, 0.72);
		font-size: 0.8rem;
	}

	.menu {
		display: flex;
		align-items: center;
		list-style: none;
		gap: 12px;
		margin: 0;
		padding: 0;
	}

	.menu button {
		padding: 8px 14px;
		border-radius: 999px;
		border: none;
		background: transparent;
		color: rgba(231, 239, 255, 0.72);
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
	}

	.menu button:hover {
		color: #f7fbff;
		transform: translateY(-1px);
	}

	.menu button.active {
		background: rgba(80, 70, 245, 0.2);
		color: #d7dcff;
		box-shadow: 0 0 0 1px rgba(80, 70, 245, 0.45);
	}

	.mode-toggle {
		display: inline-flex;
		background: rgba(20, 28, 48, 0.86);
		border-radius: 999px;
		padding: 4px;
		gap: 4px;
		box-shadow: inset 0 0 0 1px rgba(70, 90, 130, 0.45);
	}

	.mode-toggle button {
		border: none;
		background: transparent;
		color: rgba(196, 210, 232, 0.7);
		padding: 6px 16px;
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.82rem;
		transition: background 0.25s ease, color 0.25s ease;
	}

	.mode-toggle button.active {
		background: linear-gradient(135deg, #6366f1, #8b5cf6);
		color: #fff;
		box-shadow: 0 8px 16px rgba(99, 102, 241, 0.35);
	}

	.menu-modal {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		width: min(920px, calc(100vw - 48px));
		z-index: 1100;
	}

	.menu-modal__panel {
		background: rgba(8, 14, 32, 0.92);
		border-radius: 22px;
		border: 1px solid rgba(45, 64, 98, 0.55);
		box-shadow: 0 24px 60px rgba(2, 8, 24, 0.55);
		padding: 24px 28px 28px;
		display: grid;
		gap: 18px;
	}

	.menu-modal__header {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.menu-modal__header h3 {
		margin: 0;
		font-size: 1.05rem;
		color: rgba(236, 242, 255, 0.95);
	}

	.menu-modal__header p {
		margin: 0;
		color: rgba(196, 210, 236, 0.7);
		font-size: 0.82rem;
	}

	.workspace {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 32px 72px;
		position: relative;
 }

	.instrument-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 10px;
	}

	.instrument-list button {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 14px;
		background: rgba(18, 28, 50, 0.72);
		border: 1px solid transparent;
		color: rgba(222, 233, 255, 0.8);
		cursor: pointer;
		transition: border 0.15s ease, transform 0.15s ease, background 0.15s ease;
	}

	.instrument-list button:hover {
		border-color: rgba(119, 143, 255, 0.6);
		transform: translateY(-1px);
	}

	.instrument-list button.active {
		border-color: rgba(136, 108, 255, 0.95);
		background: rgba(60, 45, 145, 0.5);
		color: #fff;
	}

	.instrument-list .dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
	}

	.instrument-list .name {
		flex: 1;
		font-size: 0.88rem;
	}

	.instrument-list .symbol {
		font-size: 0.75rem;
		color: rgba(207, 220, 240, 0.5);
	}

	.chart-stage {
		position: fixed;
		top: var(--nav-offset);
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 0;
		background: rgba(8, 14, 32, 0.6);
		border-top: 1px solid rgba(32, 48, 78, 0.55);
		z-index: 0;
		pointer-events: none;
	}

	.chart-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(40, 52, 82, 0.25) 1px, transparent 1px),
			linear-gradient(90deg, rgba(40, 52, 82, 0.25) 1px, transparent 1px);
		background-size: 60px 60px;
		filter: brightness(0.8);
	}

	.empty-state {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: rgba(195, 208, 236, 0.6);
		font-size: 1rem;
		letter-spacing: 0.02em;
		pointer-events: none;
	}

	.modal-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}

	.modal-list li {
		display: grid;
		gap: 4px;
		padding: 14px 18px;
		border-radius: 16px;
		background: rgba(16, 24, 46, 0.8);
		border: 1px solid rgba(40, 60, 94, 0.55);
	}

	.modal-list li strong {
		font-size: 0.86rem;
		color: rgba(219, 230, 255, 0.92);
	}

	.modal-list li span {
		font-size: 0.82rem;
		color: rgba(197, 208, 235, 0.72);
	}

	.modal-note {
		margin: 0;
		font-size: 0.78rem;
		color: rgba(180, 198, 232, 0.65);
		line-height: 1.4;
	}

	.modal-action {
		justify-self: flex-end;
		border: none;
		padding: 10px 18px;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(94, 97, 255, 0.18), rgba(154, 102, 255, 0.45));
		color: rgba(230, 236, 255, 0.95);
		cursor: pointer;
		font-size: 0.82rem;
		transition: background 0.2s ease, box-shadow 0.2s ease;
	}

	.modal-action:hover {
		background: linear-gradient(135deg, rgba(108, 112, 255, 0.4), rgba(162, 112, 255, 0.66));
		box-shadow: 0 10px 22px rgba(106, 110, 255, 0.25);
	}

	.modal-action.disabled,
	.modal-action[disabled] {
		opacity: 0.55;
		cursor: not-allowed;
		box-shadow: none;
		background: rgba(80, 70, 140, 0.35);
	}

	.option-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 12px;
	}

	.option-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px 18px;
		border-radius: 16px;
		border: 1px solid rgba(50, 70, 108, 0.6);
		background: rgba(14, 22, 42, 0.65);
		color: rgba(215, 228, 255, 0.8);
		cursor: pointer;
		text-align: left;
		transition: border 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
	}

	.option-card:hover {
		border-color: rgba(120, 156, 255, 0.8);
		box-shadow: 0 14px 30px rgba(40, 70, 140, 0.28);
		transform: translateY(-2px);
	}

	.option-card.active {
		border-color: rgba(140, 120, 255, 0.95);
		background: rgba(58, 48, 130, 0.6);
		color: #f4f6ff;
		box-shadow: 0 18px 34px rgba(70, 60, 150, 0.4);
	}

	.option-card__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: flex-start;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(108, 99, 255, 0.2);
		color: rgba(208, 216, 255, 0.88);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.option-card__meta {
		font-size: 0.75rem;
		color: rgba(174, 202, 255, 0.65);
	}

	.modal-placeholder {
		padding: 28px;
		border-radius: 18px;
		background: rgba(15, 24, 46, 0.7);
		border: 1px dashed rgba(70, 90, 140, 0.5);
		text-align: center;
		color: rgba(195, 210, 238, 0.65);
		font-size: 0.88rem;
	}

	.modal-placeholder p {
		margin: 0;
	}

	.window-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 14px;
	}

	.window-list--events li,
	.window-list--sns li,
	.window-list--news li {
		padding: 16px 18px;
		border-radius: 16px;
		background: rgba(12, 18, 36, 0.75);
		border: 1px solid rgba(38, 56, 92, 0.55);
		display: grid;
		gap: 10px;
	}

	.event-main {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(100, 120, 255, 0.22);
		color: rgba(204, 220, 255, 0.9);
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 56px;
	}

	.event-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.event-info strong {
		font-size: 0.92rem;
		color: rgba(235, 242, 255, 0.95);
	}

	.event-info .meta {
		font-size: 0.78rem;
		color: rgba(190, 206, 238, 0.7);
	}

	.window-list--sns li p {
		margin: 0;
		color: rgba(213, 226, 255, 0.82);
		line-height: 1.45;
	}

	.sns-author {
		font-weight: 600;
		color: rgba(200, 220, 255, 0.85);
	}

	.sns-time {
		font-size: 0.74rem;
	}

	.window-list--news {
		counter-reset: news;
	}

	.window-list--news li {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.news-index {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		background: rgba(110, 128, 255, 0.22);
		color: rgba(208, 218, 255, 0.9);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.news-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.news-body strong {
		font-size: 0.92rem;
		color: rgba(234, 240, 255, 0.95);
	}

	.news-body .meta {
		font-size: 0.76rem;
		color: rgba(180, 200, 234, 0.68);
	}

	.list-button {
		display: block;
		width: 100%;
		background: transparent;
		border: none;
		color: inherit;
		text-align: left;
		padding: 0;
		cursor: pointer;
		display: grid;
		gap: 10px;
	}

	.list-button:hover {
		color: rgba(233, 240, 255, 0.95);
	}

	.list-button:focus-visible {
		outline: 2px solid rgba(140, 160, 255, 0.7);
		outline-offset: 3px;
	}

	.list-description {
		margin: 0;
		font-size: 0.8rem;
		color: rgba(184, 204, 238, 0.7);
		line-height: 1.4;
	}

	.detail-view {
		display: grid;
		gap: 16px;
	}

	.detail-back {
		align-self: flex-start;
		background: rgba(18, 30, 60, 0.85);
		border: 1px solid rgba(60, 90, 150, 0.6);
		color: rgba(206, 220, 255, 0.85);
		padding: 6px 12px;
		border-radius: 999px;
		cursor: pointer;
		font-size: 0.78rem;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.detail-back:hover {
		background: rgba(80, 100, 200, 0.3);
		color: #fff;
	}

	.detail-header {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	.detail-titles {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.detail-titles h4 {
		margin: 0;
		font-size: 1rem;
		color: rgba(240, 244, 255, 0.96);
	}

	.detail-description {
		margin: 0;
		font-size: 0.85rem;
		color: rgba(195, 210, 240, 0.85);
		line-height: 1.45;
	}

	.detail-body {
		margin: 0;
		font-size: 0.86rem;
		color: rgba(229, 237, 255, 0.9);
		line-height: 1.6;
	}

	.sns-profile {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.sns-profile img,
	.sns-detail-profile img {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	.sns-detail-profile {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.sns-author {
		display: block;
		font-weight: 600;
		color: rgba(220, 230, 255, 0.92);
	}

	.sns-handle {
		display: block;
		font-size: 0.75rem;
		color: rgba(170, 195, 236, 0.65);
	}

	.sns-time {
		display: block;
		font-size: 0.75rem;
		color: rgba(158, 186, 230, 0.65);
	}

	.sns-button p {
		margin: 8px 0 0;
		font-size: 0.9rem;
		color: rgba(225, 234, 255, 0.9);
	}

	.sns-detail-profile div strong {
		display: block;
		font-size: 0.92rem;
		color: rgba(236, 242, 255, 0.96);
	}

	.sns-detail-profile div .meta {
		display: block;
		font-size: 0.76rem;
		color: rgba(180, 200, 236, 0.7);
		margin-top: 2px;
	}

	.news-button {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	@media (max-width: 880px) {
		.detail-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	:global(*::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
		background: transparent;
	}

	:global(*::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(*::-webkit-scrollbar-thumb) {
		background: linear-gradient(135deg, rgba(110, 122, 208, 0.55), rgba(92, 69, 210, 0.55));
		border-radius: 999px;
	}

	:global(*::-webkit-scrollbar-thumb:hover) {
		background: linear-gradient(135deg, rgba(128, 140, 226, 0.7), rgba(112, 86, 226, 0.7));
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: rgba(120, 132, 210, 0.6) transparent;
	}

	@media (max-width: 880px) {
		.top-nav {
			flex-wrap: wrap;
			gap: 12px;
		}

		.menu {
			order: 3;
			width: 100%;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.workspace {
			padding: 0 20px 48px;
		}

		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		}

		.menu-modal__panel {
			padding: 22px;
		}
	}
</style>
