<script lang="ts">
	import ChartWindow from '$lib/components/ChartWindow.svelte';
	import EconomicCalendar from '$lib/components/EconomicCalendar.svelte';
	import GeneralDashboard from '$lib/components/GeneralDashboard.svelte';
	import GeneralSNSFeed from '$lib/components/GeneralSNSFeed.svelte';
	import GeneralNewsFeed from '$lib/components/GeneralNewsFeed.svelte';
	import GeneralPlaceholder from '$lib/components/GeneralPlaceholder.svelte';
	import InfoWindow from '$lib/components/InfoWindow.svelte';
	import { instruments } from '$lib/data/instruments';
	import { socialPlatforms as snsPlatforms, type SocialPlatform } from '$lib/data/social';
	import { newsSources, type NewsSource } from '$lib/data/news';

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

const snsPlatformMap = new Map(snsPlatforms.map((platform) => [platform.id, platform] as const));
type PlatformId = SocialPlatform['id'];
const allPlatformIds: PlatformId[] = snsPlatforms.map((platform) => platform.id);

	const newsSourceMap = new Map(newsSources.map((source) => [source.id, source] as const));

type WindowBase = {
	key: string;
	position: { x: number; y: number };
	size: { width: number; height: number };
	z: number;
};

type ChartWindowState = WindowBase & { type: 'chart'; instrumentId: string };
type EventsWindowState = WindowBase & { type: 'events'; view: 'list' | 'detail'; selectedIndex: number | null };
type SNSWindowState = WindowBase & {
	type: 'sns';
	platforms: PlatformId[];
	view: 'list' | 'detail';
	selectedIndex: number | null;
};
type NewsWindowState = WindowBase & {
	type: 'news';
	sources: string[];
	view: 'list' | 'detail';
	selectedIndex: number | null;
};

type WindowState = ChartWindowState | EventsWindowState | SNSWindowState | NewsWindowState;

let mode: Mode = 'pro';
	let hoveredSection: Section | null = null;
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;
	let activeSection: Section | null = 'chart';
	let generalSection: Section = 'chart';
	let navHeight = 72;
	let zCounter = 5;
	let windows: WindowState[] = [];

	const setMode = (nextMode: Mode) => {
		if (mode === nextMode) return;
		mode = nextMode;
		cancelHoverHide();
		hoveredSection = null;
		if (nextMode === 'general') {
			generalSection = generalSection ?? 'chart';
		} else {
			activeSection = activeSection ?? 'chart';
		}
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
		if (mode !== 'pro') return;
		cancelHoverHide();
		hoveredSection = section;
		activeSection = section;
	};

	const handleMenuClick = (section: Section) => {
		if (mode !== 'pro') return;
		showMenuModal(section);
	};

	const handleNavClick = (section: Section) => {
		if (mode === 'pro') {
			handleMenuClick(section);
			return;
		}

		generalSection = section;
		cancelHoverHide();
		hoveredSection = null;
	};

	const handleNavPointerEnter = (section: Section) => {
		if (mode !== 'pro') return;
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

const openSNSWindow = (platformId: PlatformId | 'all') => {
	if (platformId !== 'all' && !snsPlatformMap.has(platformId)) return;
	const key = 'sns';
	const existing = windows.find((window) => window.key === key && window.type === 'sns') as
		| SNSWindowState
		| undefined;

	if (!existing) {
		const position = createWindowPosition();
		const selectedPlatforms: PlatformId[] =
			platformId === 'all' ? [...allPlatformIds] : [platformId];
		const nextWindow: SNSWindowState = {
			key,
			type: 'sns',
			platforms: selectedPlatforms,
			position,
			size: { width: 360, height: 340 },
			z: ++zCounter,
			view: 'list',
			selectedIndex: null
		};

		windows = [...windows, nextWindow];
		return;
	}

	let nextPlatforms: PlatformId[];

	if (platformId === 'all') {
		nextPlatforms = [...allPlatformIds];
	} else {
		const hasPlatform = existing.platforms.includes(platformId);
		if (hasPlatform) {
			nextPlatforms = existing.platforms.filter((id) => id !== platformId);
		} else {
			nextPlatforms = [...existing.platforms, platformId];
		}
	}

	const uniquePlatforms = allPlatformIds.filter((id) => nextPlatforms.includes(id));

	if (uniquePlatforms.length === 0) {
		windows = windows.filter((window) => window.key !== key);
		return;
	}

	updateWindowState(key, (window) => {
		if (window.type !== 'sns') return window;
		return { ...window, platforms: uniquePlatforms, view: 'list', selectedIndex: null };
	});
	bringToFront(key);
};

	const openNewsWindow = (sourceId: string) => {
		if (sourceId !== 'all' && !newsSourceMap.has(sourceId)) return;
		const key = 'news';
		const allIds = newsSources.map((source) => source.id);
		const existing = windows.find((window) => window.key === key && window.type === 'news') as
			| NewsWindowState
			| undefined;

		if (!existing) {
			const position = createWindowPosition();
			const selectedSources = sourceId === 'all' ? allIds : [sourceId];
		const nextWindow: NewsWindowState = {
			key,
			type: 'news',
			sources: selectedSources,
			position,
			size: { width: 420, height: 360 },
			z: ++zCounter,
			view: 'list',
			selectedIndex: null
		};

		windows = [...windows, nextWindow];
			return;
		}

		let nextSources: string[];

		if (sourceId === 'all') {
			nextSources = allIds;
		} else {
			const hasSource = existing.sources.includes(sourceId);
			if (hasSource) {
				nextSources = existing.sources.filter((id) => id !== sourceId);
			} else {
				nextSources = [...existing.sources, sourceId];
			}
		}

		const uniqueSources = allIds.filter((id) => nextSources.includes(id));

		if (uniqueSources.length === 0) {
			windows = windows.filter((window) => window.key !== key);
			return;
		}

		updateWindowState(key, (window) => {
			if (window.type !== 'news') return window;
			return { ...window, sources: uniqueSources, view: 'list', selectedIndex: null };
		});
		bringToFront(key);
	};

	const isInstrumentActive = (instrumentId: string) =>
		windows.some((window) => window.type === 'chart' && window.instrumentId === instrumentId);

	const isEventsActive = () => windows.some((window) => window.type === 'events');
	const isSNSActive = (platformId: PlatformId | 'all') => {
		const window = windows.find((entry) => entry.type === 'sns') as SNSWindowState | undefined;
		if (!window) return false;
		if (platformId === 'all') {
			return window.platforms.length === snsPlatforms.length;
		}
		return window.platforms.includes(platformId);
	};
	const isNewsActive = (sourceId: string) => {
		const window = windows.find((entry) => entry.type === 'news') as NewsWindowState | undefined;
		if (!window) return false;
		if (sourceId === 'all') {
			return window.sources.length === newsSources.length;
		}
		return window.sources.includes(sourceId);
	};

	const selectInstrument = (instrumentId: string) => {
		openChart(instrumentId);
		hoveredSection = null;
	};

	const openEventsFromMenu = () => {
		openEventsWindow();
		hoveredSection = null;
	};

	const openSNSFromMenu = (platformId: PlatformId | 'all') => {
		openSNSWindow(platformId);
		if (mode === 'pro') {
			hoveredSection = null;
		}
	};

const openNewsFromMenu = (sourceId: string) => {
	openNewsWindow(sourceId);
	if (mode === 'pro') {
		hoveredSection = null;
	}
};

type SNSListItem = SocialPlatform['posts'][number] & {
	platformId: PlatformId;
	platformLabel: string;
};

const getSNSItems = (platformIds: PlatformId[]) => {
	const selected = platformIds.length
		? new Set(platformIds)
		: new Set(allPlatformIds);
	const items: SNSListItem[] = [];
	for (const platform of snsPlatforms) {
		if (!selected.has(platform.id)) continue;
		for (const post of platform.posts) {
			items.push({ ...post, platformId: platform.id, platformLabel: platform.label });
		}
	}
	return items;
};

type NewsListItem = NewsSource['headlines'][number] & {
	sourceId: string;
	sourceLabel: string;
	region: string;
};

const getNewsItems = (sourceIds: string[]) => {
	const selected = sourceIds.length ? new Set(sourceIds) : new Set(newsSources.map((source) => source.id));
	const items: NewsListItem[] = [];
	for (const source of newsSources) {
		if (!selected.has(source.id)) continue;
		for (const headline of source.headlines) {
			items.push({
				...headline,
				sourceId: source.id,
				sourceLabel: source.label,
				region: source.region
			});
		}
	}

	return items;
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
						class:active={mode === 'pro' ? activeSection === section.id : generalSection === section.id}
						on:click={() => handleNavClick(section.id)}
						on:pointerenter={() => handleNavPointerEnter(section.id)}
						on:focus={() => handleNavPointerEnter(section.id)}
						aria-selected={mode === 'pro' ? activeSection === section.id : generalSection === section.id}
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

	{#if mode === 'pro' && hoveredSection}
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
					<button
						type="button"
						class="modal-action"
						class:disabled={isSNSActive('all')}
						on:click={() => openSNSFromMenu('all')}
						disabled={isSNSActive('all')}
					>
						{isSNSActive('all') ? 'SNS 창이 열려 있습니다' : '모든 플랫폼 함께 보기'}
					</button>
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
					<button
						type="button"
						class="modal-action"
						class:disabled={isNewsActive('all')}
						on:click={() => openNewsFromMenu('all')}
						disabled={isNewsActive('all')}
					>
						{isNewsActive('all') ? '뉴스 창이 열려 있습니다' : '모든 뉴스 함께 보기'}
					</button>
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

	{#if mode === 'general'}
		<main class="general-container" style={`padding-top: ${navHeight + 32}px;`}>
			{#if generalSection === 'chart'}
				<GeneralDashboard />
			{:else if generalSection === 'events'}
				<EconomicCalendar />
			{:else if generalSection === 'sns'}
				<GeneralSNSFeed />
			{:else if generalSection === 'news'}
				<GeneralNewsFeed />
			{:else}
				<GeneralPlaceholder
					title="커뮤니티 라운지"
					description="커뮤니티 기능은 일반 모드에 맞춰 업데이트될 예정입니다."
				/>
			{/if}
		</main>
	{:else}
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
				{@const selectedPlatforms = window.platforms}
				{@const hasAllPlatforms = selectedPlatforms.length === snsPlatforms.length}
				{@const platformLabels = selectedPlatforms
					.map((id) => snsPlatformMap.get(id)?.label ?? id)}
				{@const singlePlatform =
					!hasAllPlatforms && selectedPlatforms.length === 1
						? snsPlatformMap.get(selectedPlatforms[0])
						: null}
				{@const primaryPlatformLabel = hasAllPlatforms
					? '전체'
					: platformLabels.length <= 2
						? platformLabels.join(', ')
						: `${platformLabels.slice(0, 2).join(', ')} 외 ${platformLabels.length - 2}곳`}
				{@const platformSubtitle = hasAllPlatforms
					? '모든 플랫폼의 실시간 커뮤니티 업데이트를 한 곳에서 확인하세요.'
					: singlePlatform
						? singlePlatform.description
						: `선택한 ${platformLabels.length}개 플랫폼의 실시간 커뮤니티 업데이트입니다.`}
				{@const snsItems = getSNSItems(selectedPlatforms)}
				<InfoWindow
					title={`SNS — ${primaryPlatformLabel}`}
					subtitle={platformSubtitle}
					position={window.position}
					size={window.size}
					zIndex={window.z}
					lockedTop={navHeight}
					minWidth={320}
					minHeight={300}
					on:move={(event) => handleMove(window.key, event.detail)}
					on:resize={(event) => handleResize(window.key, event.detail)}
					on:focus={() => bringToFront(window.key)}
					on:close={() => closeWindow(window.key)}
					>
						{#if window.view === 'detail' && window.selectedIndex !== null}
							{@const post = snsItems[window.selectedIndex]}
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
											<span class="sns-detail-source">{post.platformLabel}</span>
										</div>
									</div>
									<p class="detail-description">{post.content}</p>
									<p class="detail-body">{post.detail}</p>
								{:else}
									<p class="detail-description">선택된 게시글을 찾을 수 없습니다.</p>
								{/if}
							</div>
							{:else}
								<p class="filter-label">
									{hasAllPlatforms
										? '전체 플랫폼 실시간 업데이트'
										: `${primaryPlatformLabel} 실시간 업데이트`}
								</p>
								<ul class="window-list window-list--sns">
									{#each snsItems as post, index}
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
												<div class="sns-meta-row">
													<span class="sns-time">{post.timeAgo}</span>
													<span class="sns-source">{post.platformLabel}</span>
												</div>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
					</InfoWindow>
			{:else if window.type === 'news'}
				{@const selectedSources = window.sources}
				{@const hasAllSources = selectedSources.length === newsSources.length}
				{@const sourceLabels = selectedSources
					.map((id) => newsSourceMap.get(id)?.label ?? id)}
				{@const singleSource =
					!hasAllSources && selectedSources.length === 1
						? newsSourceMap.get(selectedSources[0])
						: null}
				{@const primarySourceLabel = hasAllSources
					? '전체'
					: sourceLabels.length <= 2
						? sourceLabels.join(', ')
						: `${sourceLabels.slice(0, 2).join(', ')} 외 ${sourceLabels.length - 2}곳`}
				{@const sourceSubtitle = hasAllSources
					? '신뢰도 높은 언론사의 최신 헤드라인을 모았습니다.'
					: singleSource
						? `${singleSource.region} 주요 헤드라인`
						: `선택한 ${sourceLabels.length}개 언론사의 최신 헤드라인을 모았습니다.`}
				{@const newsItems = getNewsItems(selectedSources)}
				<InfoWindow
					title={`뉴스 — ${primarySourceLabel}`}
					subtitle={sourceSubtitle}
					position={window.position}
					size={window.size}
					zIndex={window.z}
					lockedTop={navHeight}
					minWidth={360}
					minHeight={300}
					on:move={(event) => handleMove(window.key, event.detail)}
					on:resize={(event) => handleResize(window.key, event.detail)}
					on:focus={() => bringToFront(window.key)}
						on:close={() => closeWindow(window.key)}
						>
							{#if window.view === 'detail' && window.selectedIndex !== null}
								{@const headline = newsItems[window.selectedIndex]}
								<div class="detail-view">
									<button type="button" class="detail-back" on:click={() => closeNewsDetail(window.key)}>
										← 뒤로가기
								</button>
								{#if headline}
									<div class="detail-header">
										<h4>{headline.title}</h4>
										<span class="meta">{headline.timeAgo} · {headline.sourceLabel}</span>
									</div>
									<p class="detail-description">{headline.summary}</p>
									<p class="detail-body">{headline.body}</p>
								{:else}
									<p class="detail-description">선택한 뉴스 기사를 표시하지 못했습니다.</p>
								{/if}
							</div>
							{:else}
								<p class="filter-label">
									{hasAllSources
										? '전체 언론사 최신 헤드라인'
										: `${primarySourceLabel} 최신 헤드라인`}
								</p>
								<ol class="window-list window-list--news">
									{#each newsItems as headline, index}
										<li>
											<button type="button" class="list-button news-button" on:click={() => openNewsDetail(window.key, index)}>
												<span class="news-index">{index + 1}</span>
												<div class="news-body">
													<strong>{headline.title}</strong>
													<span class="meta">{headline.timeAgo} · {headline.sourceLabel}</span>
													<p class="list-description">{headline.summary}</p>
												</div>
											</button>
										</li>
									{/each}
								</ol>
							{/if}
					</InfoWindow>
			{/if}
		{/each}
		</main>
	{/if}
</div>

<style>
	:global(body) {
		background: var(--c-bg-900);
		color: var(--c-text-primary);
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
		background: var(--c-bg-800);
		border-bottom: 1px solid var(--c-bg-700);
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
		border-radius: var(--radius-sm);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.brand__mode {
		color: var(--c-text-muted);
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
		border-radius: var(--radius-sm);
		border: none;
		background: transparent;
		color: var(--c-text-secondary);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.menu button:hover {
		color: var(--c-text-primary);
		background: var(--c-bg-700);
	}

	.menu button.active {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.mode-toggle {
		display: inline-flex;
		background: var(--c-bg-900);
		border-radius: var(--radius-sm);
		padding: 4px;
		gap: 4px;
		border: 1px solid var(--c-bg-700);
	}

	.mode-toggle button {
		border: none;
		background: transparent;
		color: var(--c-text-muted);
		padding: 6px 16px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.82rem;
		transition: all 0.2s ease;
	}

	.mode-toggle button.active {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.menu-modal {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		width: min(920px, calc(100vw - 48px));
		z-index: 1100;
	}

	.menu-modal__panel {
		background: var(--c-bg-800);
		border-radius: var(--radius-lg);
		border: 1px solid var(--c-bg-700);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
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
		color: var(--c-text-primary);
	}

	.menu-modal__header p {
		margin: 0;
		color: var(--c-text-muted);
		font-size: 0.82rem;
	}

	.general-container {
		width: 100%;
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 32px 80px;
		box-sizing: border-box;
		min-height: 100vh;
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
		border-radius: var(--radius-sm);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		color: var(--c-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.instrument-list button:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.instrument-list button.active {
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
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
		color: var(--c-text-muted);
	}

	.chart-stage {
		position: fixed;
		top: var(--nav-offset);
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 0;
		background: var(--c-bg-900);
		border-top: 1px solid var(--c-bg-700);
		z-index: 0;
		pointer-events: none;
	}

	.chart-grid {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(var(--c-bg-700) 1px, transparent 1px),
			linear-gradient(90deg, var(--c-bg-700) 1px, transparent 1px);
		background-size: 60px 60px;
		opacity: 0.3;
	}

	.empty-state {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: var(--c-text-muted);
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
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
	}

	.modal-list li strong {
		font-size: 0.86rem;
		color: var(--c-text-primary);
	}

	.modal-list li span {
		font-size: 0.82rem;
		color: var(--c-text-muted);
	}

	.modal-note {
		margin: 0;
		font-size: 0.78rem;
		color: var(--c-text-muted);
		line-height: 1.4;
	}

	.modal-action {
		justify-self: flex-end;
		border: none;
		padding: 10px 18px;
		border-radius: var(--radius-sm);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		cursor: pointer;
		font-size: 0.82rem;
		transition: all 0.2s ease;
	}

	.modal-action:hover {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.modal-action.disabled,
	.modal-action[disabled] {
		opacity: 0.55;
		cursor: not-allowed;
		background: rgba(255, 255, 255, 0.04);
		color: var(--c-text-muted);
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
		border-radius: var(--radius-md);
		border: 1px solid var(--c-bg-700);
		background: var(--c-bg-900);
		color: var(--c-text-secondary);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.option-card:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.option-card.active {
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.option-card__badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		align-self: flex-start;
		padding: 4px 10px;
		border-radius: 4px;
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.option-card__meta {
		font-size: 0.75rem;
		color: var(--c-text-muted);
	}

	.modal-placeholder {
		padding: 28px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px dashed var(--c-bg-700);
		text-align: center;
		color: var(--c-text-muted);
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
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
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
		border-radius: 4px;
		background: var(--c-bg-700);
		color: var(--c-text-primary);
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
		color: var(--c-text-primary);
	}

	.event-info .meta {
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.filter-label {
		margin: 0 0 12px;
		font-size: 0.76rem;
		color: var(--c-text-muted);
	}

	.window-list--sns li p {
		margin: 0;
		color: var(--c-text-secondary);
		line-height: 1.45;
	}

	.sns-author {
		font-weight: 600;
		color: var(--c-text-primary);
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
		border-radius: 4px;
		background: var(--c-bg-700);
		color: var(--c-text-primary);
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
		color: var(--c-text-primary);
	}

	.news-body .meta {
		font-size: 0.76rem;
		color: var(--c-text-muted);
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
		color: var(--c-text-primary);
	}

	.list-button:focus-visible {
		outline: 2px solid rgba(255, 255, 255, 0.12);
		outline-offset: 3px;
	}

	.list-description {
		margin: 0;
		font-size: 0.8rem;
		color: var(--c-text-muted);
		line-height: 1.4;
	}

	.detail-view {
		display: grid;
		gap: 16px;
	}

	.detail-back {
		align-self: flex-start;
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		color: var(--c-text-secondary);
		padding: 6px 12px;
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-size: 0.78rem;
		transition: all 0.2s ease;
	}

	.detail-back:hover {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
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
		color: var(--c-text-primary);
	}

	.detail-description {
		margin: 0;
		font-size: 0.85rem;
		color: var(--c-text-secondary);
		line-height: 1.45;
	}

	.detail-body {
		margin: 0;
		font-size: 0.86rem;
		color: var(--c-text-primary);
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

	.sns-meta-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: 8px;
	}

	.sns-author {
		display: block;
		font-weight: 600;
		color: var(--c-text-primary);
	}

	.sns-handle {
		display: block;
		font-size: 0.75rem;
		color: var(--c-text-muted);
	}

	.sns-time {
		display: inline-flex;
		font-size: 0.75rem;
		color: var(--c-text-muted);
	}

	.sns-button p {
		margin: 8px 0 0;
		font-size: 0.9rem;
		color: var(--c-text-secondary);
	}

	.sns-detail-profile div strong {
		display: block;
		font-size: 0.92rem;
		color: var(--c-text-primary);
	}

	.sns-detail-profile div .meta {
		display: block;
		font-size: 0.76rem;
		color: var(--c-text-muted);
		margin-top: 2px;
	}

	.sns-source {
		font-size: 0.74rem;
		color: var(--c-text-muted);
		margin-left: auto;
	}

	.sns-detail-source {
		display: inline-block;
		margin-top: 6px;
		font-size: 0.76rem;
		color: var(--c-text-muted);
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
		background: var(--c-bg-700);
		border-radius: 4px;
	}

	:global(*::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.12);
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--c-bg-700) transparent;
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
