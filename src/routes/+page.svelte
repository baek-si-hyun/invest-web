<script lang="ts">
	import ChartWindow from '$lib/components/ChartWindow.svelte';
	import EconomicCalendar from '$lib/components/EconomicCalendar.svelte';
	import GeneralAssetMap from '$lib/components/GeneralAssetMap.svelte';
	import GeneralSNSFeed from '$lib/components/GeneralSNSFeed.svelte';
	import GeneralNewsFeed from '$lib/components/GeneralNewsFeed.svelte';
	import { economicEvents as calendarEconomicEvents, type EconomicEvent } from '$lib/data/economicEvents';
	import GeneralPlaceholder from '$lib/components/GeneralPlaceholder.svelte';
	import GeneralCommunity from '$lib/components/GeneralCommunity.svelte';
	import InfoWindow from '$lib/components/InfoWindow.svelte';
	import { instruments } from '$lib/data/instruments';
	import { socialPlatforms as snsPlatforms, type SocialPlatform } from '$lib/data/social';
	import { newsSources, type NewsSource } from '$lib/data/news';
	import { communityBoards, featuredCommunityPosts } from '$lib/data/community';

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




const snsPlatformMap = new Map(snsPlatforms.map((platform) => [platform.id, platform] as const));
type PlatformId = SocialPlatform['id'];
const allPlatformIds: PlatformId[] = snsPlatforms.map((platform) => platform.id);

	const newsSourceMap = new Map(newsSources.map((source) => [source.id, source] as const));
	const communityBoardMap = new Map(communityBoards.map((board) => [board.slug, board] as const));
	const communityBoardsByActivity = [...communityBoards].sort(
		(a, b) => (b.metrics.postsToday ?? 0) - (a.metrics.postsToday ?? 0)
	);
	const communityMenuBoards = communityBoardsByActivity.slice(0, 6);
	const communityPosts = featuredCommunityPosts;
	const communityMenuPosts = communityPosts.slice(0, 3);

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

type CommunityWindowState = WindowBase & {
	type: 'community';
	selectedBoard: string | null;
	view: 'list' | 'detail';
	selectedIndex: number | null;
};

type WindowState =
	| ChartWindowState
	| EventsWindowState
	| SNSWindowState
	| NewsWindowState
	| CommunityWindowState;

const eventDateFormatter = new Intl.DateTimeFormat('ko-KR', {
	month: 'numeric',
	day: 'numeric',
	weekday: 'short'
});

const eventDateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
	month: 'numeric',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
});

const toEventDate = (event: EconomicEvent) => {
	const isoString = `${event.date}T${event.time || '00:00'}`;
	return new Date(isoString);
};

const sortedCalendarEvents: EconomicEvent[] = [...calendarEconomicEvents].sort(
	(a, b) => toEventDate(a).getTime() - toEventDate(b).getTime()
);

const nowPointer = new Date();
const upcomingCalendarEvents = sortedCalendarEvents.filter((event) => toEventDate(event) >= nowPointer);
const economicEvents: EconomicEvent[] =
	upcomingCalendarEvents.length ? upcomingCalendarEvents : sortedCalendarEvents;
const menuPreviewEvents = economicEvents.slice(0, 3);

const formatEventDateLabel = (event: EconomicEvent) => eventDateFormatter.format(toEventDate(event));
const formatEventDateTimeLabel = (event: EconomicEvent) => eventDateTimeFormatter.format(toEventDate(event));
const formatEventTimeLabel = (event: EconomicEvent) =>
	event.time + (event.timezone ? ` ${event.timezone}` : '');

let theme: 'dark' | 'light' = 'dark';

const toggleTheme = () => {
	theme = theme === 'dark' ? 'light' : 'dark';
};

let mode: Mode = 'pro';
	let hoveredSection: Section | null = null;
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;
	let activeSection: Section | null = 'chart';
	let generalSection: Section = 'chart';
	let navHeight = 72;

$: if (typeof document !== 'undefined') {
	const root = document.documentElement;
	root.dataset.theme = theme;
}

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

	const handleLogoClick = () => {
		setMode('general');
		generalSection = 'chart';
		cancelHoverHide();
		hoveredSection = null;
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
		console.log('Bringing window to front:', key);
		zCounter += 1;
		
		// 안전한 배열 업데이트
		const newWindows = windows.map((window) => 
			window.key === key ? { ...window, z: zCounter } : window
		);
		windows = newWindows;
	};

const updateWindowState = (key: string, updater: (window: WindowState) => WindowState) => {
	console.log('Updating window state:', key);
	
	// 안전한 배열 업데이트
	const newWindows = windows.map((window) => 
		window.key === key ? updater(window) : window
	);
	windows = newWindows;
};

const handleMove = (key: string, detail: { x: number; y: number }) => {
	console.log('Moving window:', key, 'to position:', detail);
	
	// 안전한 배열 업데이트
	const newWindows = windows.map((window) =>
		window.key === key ? { ...window, position: { x: detail.x, y: detail.y } } : window
	);
	windows = newWindows;
};

	const handleResize = (key: string, detail: { width: number; height: number }) => {
		console.log('Resizing window:', key, 'to size:', detail);
		
		// 안전한 배열 업데이트
		const newWindows = windows.map((window) =>
			window.key === key ? { ...window, size: { width: detail.width, height: detail.height } } : window
		);
		windows = newWindows;
	};

	const closeWindow = (key: string) => {
		console.log('Closing window:', key, 'Current windows count:', windows.length);
		
		// 안전한 배열 업데이트를 위해 새로운 배열 생성
		const newWindows = windows.filter((window) => window.key !== key);
		
		console.log('New windows count after close:', newWindows.length);
		
		// 배열이 완전히 비어있을 때도 안전하게 처리
		if (newWindows.length === 0) {
			console.log('All windows closed, resetting to empty array');
			windows = [];
		} else {
			windows = newWindows;
		}
	};

	const openChart = (instrumentId: string) => {
		console.log('Opening chart for instrument:', instrumentId);
		const key = `chart:${instrumentId}`;
		const existing = windows.find((window) => window.key === key);
		if (existing) {
			console.log('Chart already exists, bringing to front');
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

		console.log('Adding new chart window:', nextWindow);
		// 안전한 배열 업데이트
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

	const openCommunityWindow = (boardSlug: string | 'all' = 'all') => {
		const key = 'community';
		const normalized = boardSlug === 'all' ? null : communityBoardMap.has(boardSlug) ? boardSlug : null;
		const existing = windows.find((window) => window.key === key && window.type === 'community') as
			| CommunityWindowState
			| undefined;

		if (!existing) {
			const position = createWindowPosition();
			const nextWindow: CommunityWindowState = {
				key,
				type: 'community',
				position,
				size: { width: 420, height: 360 },
				z: ++zCounter,
				selectedBoard: normalized,
				view: 'list',
				selectedIndex: null
			};

			windows = [...windows, nextWindow];
			return;
		}

		updateWindowState(key, (window) => {
			if (window.type !== 'community') return window;
			return { ...window, selectedBoard: normalized, view: 'list', selectedIndex: null };
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
	const isCommunityActive = (boardSlug: string | 'all') => {
		const window = windows.find((entry) => entry.type === 'community') as CommunityWindowState | undefined;
		if (!window) return false;
		if (boardSlug === 'all') {
			return window.selectedBoard === null;
		}
		return window.selectedBoard === boardSlug;
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

	const openCommunityFromMenu = (boardSlug: string | 'all') => {
		openCommunityWindow(boardSlug);
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

type CommunityListItem = (typeof communityPosts)[number];

const getCommunityItems = (boardSlug: string | null) => {
	if (!boardSlug) return communityPosts;
	return communityPosts.filter((post) => post.boardSlug === boardSlug);
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

const openCommunityDetail = (key: string, index: number) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'community') return window;
		return { ...window, view: 'detail', selectedIndex: index };
	});
};

const closeCommunityDetail = (key: string) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'community') return window;
		return { ...window, view: 'list', selectedIndex: null };
	});
};

const setCommunityFilter = (key: string, boardSlug: string | null) => {
	updateWindowState(key, (window) => {
		if (window.type !== 'community') return window;
		return { ...window, selectedBoard: boardSlug, view: 'list', selectedIndex: null };
	});
};

</script>

<div class="layout">
	<nav class="top-nav" bind:clientHeight={navHeight} on:pointerenter={cancelHoverHide} on:pointerleave={scheduleHoverHide}>
		<button type="button" class="brand" on:click={handleLogoClick}>
			<span class="brand__logo">INVEST</span>
			<span class="brand__mode">{mode === 'pro' ? 'PRO' : 'BASIC'} HTS</span>
		</button>

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
						{section.id === 'chart' && mode === 'general' ? '자산군' : section.label}
					</button>
				</li>
			{/each}
		</ul>

		<div class="nav-right">
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
			<button
				type="button"
				class="theme-toggle"
				aria-label={`테마 전환 (${theme === 'dark' ? '라이트' : '다크'})`}
				on:click={toggleTheme}
			>
				<div class="material-icons-round">
					{theme === 'dark' ? 'light_mode' : 'dark_mode'}
				</div>
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
						{#each menuPreviewEvents as event}
							<li>
								<strong>{formatEventDateLabel(event)}</strong>
								<span>{event.country} · {event.title}</span>
								<p class="modal-note">{formatEventTimeLabel(event)} · {event.indicator}</p>
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
						<p>보드별 실시간 토론과 트렌드를 창으로 띄워보세요.</p>
					</header>
					<div class="community-menu">
						<div class="community-menu__boards">
							{#each communityMenuBoards as board}
								<button
									type="button"
									class="community-board-card"
									class:active={isCommunityActive(board.slug)}
									on:click={() => openCommunityFromMenu(board.slug)}
								>
									<div class="community-board-card__title">
										<span aria-hidden="true">{board.emoji}</span>
										<strong>{board.title}</strong>
									</div>
									<p>{board.description}</p>
									<span class="community-board-card__meta">오늘 {board.metrics.postsToday}건</span>
								</button>
							{/each}
						</div>
						<div class="community-menu__posts">
							{#each communityMenuPosts as post}
								{@const board = communityBoardMap.get(post.boardSlug)}
								<button
									type="button"
									class="community-post-card"
									on:click={() => openCommunityFromMenu(board?.slug ?? 'all')}
								>
									<div>
										<p class="community-post-card__board">{board?.emoji} {board?.title}</p>
										<strong>{post.title}</strong>
										<span class="community-post-card__meta">{post.author} · {post.postedAt}</span>
									</div>
									<p class="community-post-card__summary">{post.summary}</p>
								</button>
							{/each}
						</div>
					</div>
					<button
						type="button"
						class="modal-action"
						class:disabled={isCommunityActive('all')}
						on:click={() => openCommunityFromMenu('all')}
						disabled={isCommunityActive('all')}
					>
						{isCommunityActive('all') ? '커뮤니티 창이 열려 있습니다' : '전체 커뮤니티 피드 열기'}
					</button>
				{/if}
			</section>
		</div>
	{/if}

	{#if mode === 'general'}
		<main class="general-container" style={`padding-top: ${navHeight + 32}px;`}>
			{#if generalSection === 'chart'}
				<GeneralAssetMap />
			{:else if generalSection === 'events'}
				<EconomicCalendar />
			{:else if generalSection === 'sns'}
				<GeneralSNSFeed />
			{:else if generalSection === 'news'}
				<GeneralNewsFeed />
			{:else if generalSection === 'community'}
				<GeneralCommunity />
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
			{:else}
				<!-- 창이 있을 때의 상태 표시 (디버깅용) -->
				<div class="debug-info" style="position: fixed; top: 10px; right: 10px; background: var(--c-bg-900); color: var(--c-text-primary); padding: 8px; border-radius: 4px; font-size: 12px; z-index: 9999;">
					창 개수: {windows.length}
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
									<span class="badge">{formatEventTimeLabel(event)}</span>
									<div class="detail-titles">
										<h4>{event.title}</h4>
										<span class="meta">{formatEventDateTimeLabel(event)} · {event.country}</span>
										<span class="meta meta-indicator">{event.indicator}</span>
									</div>
								</div>
								<p class="detail-description">{event.description}</p>
								{#if event.forecast || event.previous}
									<div class="detail-stats">
										{#if event.forecast}
											<span><strong>예상</strong> {event.forecast}</span>
										{/if}
										{#if event.previous}
											<span><strong>이전</strong> {event.previous}</span>
										{/if}
									</div>
								{/if}
								{#if event.relatedThemes.length}
									<p class="detail-tags">연관 테마: {event.relatedThemes.join(', ')}</p>
								{/if}
								{#if event.source}
									<a class="detail-link" href={event.source} target="_blank" rel="noopener noreferrer">
										공식 자료 보기
									</a>
								{/if}
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
											<span class="badge">{formatEventTimeLabel(event)}</span>
											<div class="event-info">
												<strong>{event.title}</strong>
												<span class="meta">{formatEventDateLabel(event)} · {event.country}</span>
												<span class="meta meta-indicator">{event.indicator}</span>
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
			{:else if window.type === 'community'}
				{@const boardFilter = window.selectedBoard}
				{@const filterBoard = boardFilter ? communityBoardMap.get(boardFilter) : null}
				{@const filterLabel = filterBoard ? filterBoard.title : '전체'}
				{@const posts = getCommunityItems(boardFilter)}
				<InfoWindow
					title={`커뮤니티 — ${filterLabel}`}
					subtitle={boardFilter
						? `${filterLabel} 실시간 토론`
						: '전체 커뮤니티 하이라이트'}
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
						{@const post = posts[window.selectedIndex]}
						<div class="detail-view">
							<button type="button" class="detail-back" on:click={() => closeCommunityDetail(window.key)}>
								← 뒤로가기
							</button>
							{#if post}
								<div class="detail-header">
									<h4>{post.title}</h4>
									<span class="meta">{post.author} · {post.postedAt}</span>
								</div>
								<p class="detail-description">{post.summary}</p>
								<div class="community-detail__stats">
									<span>좋아요 {post.likes}</span>
									<span>댓글 {post.comments}</span>
								</div>
								{#if post.tags.length}
									<div class="community-detail__tags">
										{#each post.tags as tag}
											<span>{tag}</span>
										{/each}
									</div>
								{/if}
							{:else}
								<p class="detail-description">선택한 게시글 정보를 불러오지 못했습니다.</p>
							{/if}
						</div>
					{:else}
						<div class="community-window__filters">
							<button
								type="button"
								class:active={!boardFilter}
								on:click={() => setCommunityFilter(window.key, null)}
							>
								전체
							</button>
							{#each communityBoardsByActivity.slice(0, 6) as board}
								<button
									type="button"
									class:active={board.slug === boardFilter}
									on:click={() => setCommunityFilter(window.key, board.slug)}
								>
									{board.emoji} {board.title}
									<span>오늘 {board.metrics.postsToday}건</span>
								</button>
							{/each}
						</div>
						{#if posts.length === 0}
							<p class="empty-state">선택한 보드에 게시글이 없습니다.</p>
						{:else}
							<ul class="window-list window-list--community">
								{#each posts as post, index}
									<li>
										<button type="button" class="list-button community-button" on:click={() => openCommunityDetail(window.key, index)}>
											<div class="community-button__header">
												<span>{communityBoardMap.get(post.boardSlug)?.title ?? '커뮤니티'}</span>
											</div>
											<strong>{post.title}</strong>
											<p class="list-description">{post.summary}</p>
											<div class="community-button__meta">
												<span>{post.author}</span>
												<span>{post.postedAt}</span>
												<span>👍 {post.likes}</span>
												<span>💬 {post.comments}</span>
											</div>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
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
		border-bottom: 1px solid var(--c-border-strong);
		z-index: 1000;
		gap: 24px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		background: transparent;
		border: none;
		color: inherit;
		padding: 0;
		cursor: pointer;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.brand__logo {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 10px;
		border-radius: var(--radius-sm);
		background: var(--c-surface-hover);
		color: var(--c-text-primary);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.brand__mode {
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}

	.brand:hover .brand__logo {
		background: var(--c-bg-700);
	}

	.brand:hover {
		transform: translateY(-1px);
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
		background: var(--c-surface-hover);
	}

	.menu button.active {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		border: 1px solid var(--c-border-hover);
	}

	.nav-right {
		display: inline-flex;
		align-items: center;
		gap: 12px;
	}

	.mode-toggle {
		display: inline-flex;
		background: var(--c-bg-900);
		border-radius: var(--radius-sm);
		padding: 4px;
		gap: 4px;
		border: 1px solid var(--c-border-strong);
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

	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		background: var(--c-bg-900);
		color: var(--c-text-secondary);
		padding: 6px 10px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.theme-toggle:hover {
		color: var(--c-text-primary);
		background: var(--c-surface-hover);
		border-color: var(--c-border-hover);
	}

	.theme-toggle .material-icons-round {
		font-size: 1.2rem;
		line-height: 1;
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
		border: 1px solid var(--c-border-strong);
		box-shadow: 0 8px 24px var(--c-overlay-strong);
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

	.community-menu {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
		gap: 16px;
	}

	.community-menu__boards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 12px;
	}

	.community-board-card,
	.community-post-card {
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		padding: 14px;
		text-align: left;
		color: inherit;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.9rem;
		transition: border-color 0.2s ease, background 0.2s ease;
	}

	.community-board-card.active,
	.community-board-card:hover,
	.community-post-card:hover {
		border-color: var(--c-border-hover);
		background: var(--c-bg-800);
	}

	.community-board-card__title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
	}

	.community-board-card__meta,
	.community-post-card__meta {
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.community-post-card__board {
		margin: 0;
		font-size: 0.82rem;
		color: var(--c-text-muted);
	}

	.community-post-card__summary {
		margin: 4px 0 0;
		font-size: 0.85rem;
		color: var(--c-text-secondary);
		line-height: 1.4;
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
		border: 1px solid var(--c-border-strong);
		color: var(--c-text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.instrument-list button:hover {
		border-color: var(--c-border-hover);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.instrument-list button.active {
		border-color: var(--c-border-hover);
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
		border-top: 1px solid var(--c-border-strong);
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
		padding: 20px;
		text-align: center;
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
		border: 1px solid var(--c-border-strong);
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
		background: var(--c-surface-hover);
		border: 1px solid var(--c-border-hover);
	}

	.modal-action.disabled,
	.modal-action[disabled] {
		opacity: 0.55;
		cursor: not-allowed;
		background: var(--c-overlay-soft);
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
		border: 1px solid var(--c-border-strong);
		background: var(--c-bg-900);
		color: var(--c-text-secondary);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.option-card:hover {
		border-color: var(--c-border-hover);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.option-card.active {
		border-color: var(--c-border-hover);
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
		border: 1px solid var(--c-border-strong);
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

	.event-info .meta-indicator {
		color: var(--c-text-secondary);
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

	.window-list--community li {
		padding: 0;
		border: none;
		background: transparent;
	}

	.community-button {
		width: 100%;
		text-align: left;
		background: var(--c-bg-900);
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: inherit;
		cursor: pointer;
	}

	.community-button__header {
		display: flex;
		font-size: 0.8rem;
		color: var(--c-text-muted);
	}

	.community-button__meta {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		font-size: 0.76rem;
		color: var(--c-text-muted);
	}

	.community-window__filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 14px;
	}

	.community-window__filters button {
		border: 1px solid var(--c-border);
		background: var(--c-bg-900);
		color: var(--c-text-secondary);
		border-radius: 999px;
		padding: 6px 12px;
		font-size: 0.78rem;
		cursor: pointer;
	}

	.community-window__filters button span {
		margin-left: 6px;
		color: var(--c-text-muted);
		font-weight: 500;
	}

	.community-window__filters button.active,
	.community-window__filters button:hover {
		border-color: var(--c-border-hover);
		color: var(--c-text-primary);
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
		outline: 2px solid var(--c-border-hover);
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
		border: 1px solid var(--c-border-strong);
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

	.detail-titles .meta {
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.detail-titles .meta-indicator {
		font-size: 0.75rem;
		color: var(--c-text-secondary);
	}

	.detail-description {
		margin: 0;
		font-size: 0.85rem;
		color: var(--c-text-secondary);
		line-height: 1.45;
	}

	.detail-stats {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		font-size: 0.78rem;
		color: var(--c-text-secondary);
	}

	.detail-stats strong {
		color: var(--c-text-primary);
		margin-right: 4px;
	}

	.detail-tags {
		margin: 0;
		font-size: 0.76rem;
		color: var(--c-text-muted);
	}

	.detail-link {
		font-size: 0.78rem;
		color: var(--c-link);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.detail-link:hover {
		text-decoration: underline;
	}

	.community-detail__stats {
		margin: 12px 0;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		font-size: 0.8rem;
		color: var(--c-text-secondary);
	}

	.community-detail__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.community-detail__tags span {
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--c-border);
		background: var(--c-bg-900);
		font-size: 0.75rem;
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
		box-shadow: 0 4px 12px var(--c-overlay-soft);
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

	/* 반응형 브레이크포인트 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		.workspace {
			max-width: 1400px;
		}
		
		.menu-modal {
			width: min(1200px, calc(100vw - 48px));
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.workspace {
			max-width: 1180px;
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.workspace {
			padding: 0 24px 60px;
		}
		
		.menu-modal {
			width: min(900px, calc(100vw - 40px));
		}
		
		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.top-nav {
			padding: 12px 20px;
			gap: 16px;
		}
		
		.workspace {
			padding: 0 20px 60px;
		}
		
		.general-container {
			padding: 0 24px 60px;
		}
		
		.menu-modal {
			width: min(800px, calc(100vw - 32px));
		}
		
		.menu-modal__panel {
			padding: 20px 24px;
		}
		
		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		}
		
		.option-grid {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
		
		.community-menu {
			grid-template-columns: 1fr;
		}
		
		.community-menu__boards {
			grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		.top-nav {
			flex-wrap: wrap;
			padding: 12px 16px;
			gap: 12px;
		}
		
		.brand__mode {
			display: none;
		}
		
		.menu {
			order: 3;
			width: 100%;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 8px;
		}
		
		.menu button {
			padding: 6px 10px;
			font-size: 0.85rem;
		}
		
		.workspace {
			padding: 0 16px 60px;
		}
		
		.general-container {
			padding: 0 20px 60px;
		}
		
		.menu-modal {
			width: calc(100vw - 24px);
		}
		
		.menu-modal__panel {
			padding: 18px 20px;
		}
		
		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
			gap: 8px;
		}
		
		.option-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}
		
		.community-menu {
			grid-template-columns: 1fr;
		}
		
		.community-menu__boards {
			grid-template-columns: 1fr;
		}
		
		.detail-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.top-nav {
			flex-direction: column;
			align-items: stretch;
			padding: 12px 16px;
			gap: 12px;
		}
		
		.brand {
			justify-content: center;
		}
		
		.brand__mode {
			display: none;
		}
		
		.nav-right {
			justify-content: center;
		}
		
		.menu {
			justify-content: center;
			flex-wrap: wrap;
			gap: 6px;
		}
		
		.menu button {
			padding: 8px 12px;
			font-size: 0.8rem;
		}
		
		.workspace {
			padding: 0 12px 60px;
		}
		
		.general-container {
			padding: 0 16px 60px;
		}
		
		.menu-modal {
			width: calc(100vw - 16px);
			left: 8px;
			right: 8px;
			transform: none;
		}
		
		.menu-modal__panel {
			padding: 16px 18px;
		}
		
		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
			gap: 6px;
		}
		
		.instrument-list button {
			padding: 8px 10px;
		}
		
		.option-grid {
			grid-template-columns: 1fr;
		}
		
		.community-menu {
			grid-template-columns: 1fr;
		}
		
		.community-menu__boards {
			grid-template-columns: 1fr;
		}
		
		.detail-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.top-nav {
			flex-direction: column;
			align-items: stretch;
			padding: 10px 12px;
			gap: 10px;
		}
		
		.brand {
			justify-content: center;
		}
		
		.brand__logo {
			padding: 4px 8px;
			font-size: 0.7rem;
		}
		
		.brand__mode {
			display: none;
		}
		
		.nav-right {
			justify-content: center;
			gap: 8px;
		}
		
		.mode-toggle button {
			padding: 4px 12px;
			font-size: 0.75rem;
		}
		
		.theme-toggle {
			padding: 4px 8px;
		}
		
		.menu {
			justify-content: center;
			flex-wrap: wrap;
			gap: 4px;
		}
		
		.menu button {
			padding: 6px 8px;
			font-size: 0.75rem;
		}
		
		.workspace {
			padding: 0 8px 60px;
		}
		
		.general-container {
			padding: 0 12px 60px;
		}
		
		.menu-modal {
			width: calc(100vw - 8px);
			left: 4px;
			right: 4px;
			transform: none;
		}
		
		.menu-modal__panel {
			padding: 14px 16px;
		}
		
		.instrument-list {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			gap: 4px;
		}
		
		.instrument-list button {
			padding: 6px 8px;
			font-size: 0.8rem;
		}
		
		.instrument-list .name {
			font-size: 0.8rem;
		}
		
		.instrument-list .symbol {
			font-size: 0.7rem;
		}
		
		.option-grid {
			grid-template-columns: 1fr;
		}
		
		.option-card {
			padding: 12px 14px;
		}
		
		.community-menu {
			grid-template-columns: 1fr;
		}
		
		.community-menu__boards {
			grid-template-columns: 1fr;
		}
		
		.community-board-card,
		.community-post-card {
			padding: 12px;
		}
		
		.detail-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.menu button,
		.instrument-list button,
		.option-card,
		.community-board-card,
		.community-post-card {
			min-height: 44px;
		}
		
		.theme-toggle,
		.mode-toggle button {
			min-height: 44px;
			min-width: 44px;
		}
	}

	/* Theme Toggle Icon 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.theme-toggle .material-icons-round {
			font-size: 1.1rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.theme-toggle .material-icons-round {
			font-size: 1rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.theme-toggle .material-icons-round {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 479px) {
		.theme-toggle .material-icons-round {
			font-size: 0.8rem;
		}
	}

	/* Layout 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.layout {
			min-height: 100vh;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.layout {
			min-height: 100vh;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.layout {
			min-height: 100vh;
		}
	}

	@media (max-width: 479px) {
		.layout {
			min-height: 100vh;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.brand__logo {
			font-weight: 700;
		}
	}


	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		:global(body) {
			background: var(--c-bg-900);
		}
	}

	/* 스크롤바 스타일링 */
	:global(*::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
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
		background: var(--c-overlay-strong);
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--c-bg-700) transparent;
	}

	/* 모바일에서 스크롤바 숨기기 */
	@media (max-width: 768px) {
		:global(*::-webkit-scrollbar) {
			width: 4px;
			height: 4px;
		}
	}

	/* 추가 반응형 요소들 */
	/* Empty State 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.empty-state {
			font-size: 0.9rem;
			padding: 16px;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.empty-state {
			font-size: 0.85rem;
			padding: 12px;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.empty-state {
			font-size: 0.8rem;
			padding: 10px;
		}
	}

	@media (max-width: 479px) {
		.empty-state {
			font-size: 0.75rem;
			padding: 8px;
		}
	}

	/* Debug Info 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.debug-info {
			top: 8px !important;
			right: 8px !important;
			padding: 6px !important;
			font-size: 11px !important;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.debug-info {
			top: 6px !important;
			right: 6px !important;
			padding: 4px 6px !important;
			font-size: 10px !important;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.debug-info {
			top: 4px !important;
			right: 4px !important;
			padding: 3px 5px !important;
			font-size: 9px !important;
		}
	}

	@media (max-width: 479px) {
		.debug-info {
			display: none !important;
		}
	}

	/* Chart Stage 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.chart-grid {
			background-size: 50px 50px;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.chart-grid {
			background-size: 40px 40px;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.chart-grid {
			background-size: 30px 30px;
		}
	}

	@media (max-width: 479px) {
		.chart-grid {
			background-size: 25px 25px;
		}
	}

	/* Modal List 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.modal-list li {
			padding: 12px 16px;
		}
		
		.modal-list li strong {
			font-size: 0.8rem;
		}
		
		.modal-list li span {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.modal-list {
			gap: 10px;
		}
		
		.modal-list li {
			padding: 10px 14px;
		}
		
		.modal-list li strong {
			font-size: 0.75rem;
		}
		
		.modal-list li span {
			font-size: 0.7rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.modal-list {
			gap: 8px;
		}
		
		.modal-list li {
			padding: 8px 12px;
		}
		
		.modal-list li strong {
			font-size: 0.7rem;
		}
		
		.modal-list li span {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 479px) {
		.modal-list {
			gap: 6px;
		}
		
		.modal-list li {
			padding: 6px 10px;
		}
		
		.modal-list li strong {
			font-size: 0.65rem;
		}
		
		.modal-list li span {
			font-size: 0.6rem;
		}
	}

	/* Modal Action 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.modal-action {
			padding: 8px 16px;
			font-size: 0.8rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.modal-action {
			padding: 6px 14px;
			font-size: 0.75rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.modal-action {
			padding: 5px 12px;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 479px) {
		.modal-action {
			padding: 4px 10px;
			font-size: 0.65rem;
		}
	}

	/* Modal Note 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.modal-note {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.modal-note {
			font-size: 0.7rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.modal-note {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 479px) {
		.modal-note {
			font-size: 0.6rem;
		}
	}
</style>
