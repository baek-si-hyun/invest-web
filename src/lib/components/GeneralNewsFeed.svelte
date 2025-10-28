<script lang="ts">
	import { newsSources } from '$lib/data/news';

	type SourceId = (typeof newsSources)[number]['id'];
	type RegionId = 'all' | (typeof newsSources)[number]['region'];

	const regionOrder = Array.from(new Set(newsSources.map((source) => source.region)));

	const regionTabs: Array<{ id: RegionId; label: string }> = [
		{ id: 'all', label: '전체' },
		...regionOrder.map((region) => ({ id: region, label: region }))
	];

	const REGION_ACCENTS: Record<string, string> = {
		글로벌: '#60a5fa',
		미국: '#f97316',
		영국: '#a855f7',
		한국: '#22c55e',
		일본: '#facc15',
		홍콩: '#14b8a6',
		중국: '#ef4444'
	};

	const DEFAULT_ACCENT = '#6366f1';

type NewsCard = {
	id: string;
	sourceId: SourceId;
	sourceLabel: string;
	region: string;
	title: string;
	summary: string;
	body: string;
	timeAgo: string;
	accent: string;
	icon?: string;
	iconUrl?: string;
};

const allNews: NewsCard[] = newsSources.flatMap((source) =>
	source.headlines.map((headline, index) => ({
		id: `${source.id}-${index}`,
			sourceId: source.id,
			sourceLabel: source.label,
			region: source.region,
			title: headline.title,
		summary: headline.summary,
		body: headline.body,
		timeAgo: headline.timeAgo,
		accent: REGION_ACCENTS[source.region] ?? DEFAULT_ACCENT,
		icon: source.icon,
		iconUrl: source.iconUrl
	}))
);

const publisherList = newsSources.map((source) => ({
	id: source.id,
	label: source.label,
	region: source.region,
	accent: REGION_ACCENTS[source.region] ?? DEFAULT_ACCENT,
	icon: source.icon,
	iconUrl: source.iconUrl
}));

	let activeRegion: RegionId = 'all';
	let selectedSourceId: SourceId | null = null;

	const resolveRegionLabel = (regionId: RegionId) => {
		if (regionId === 'all') return '전체';
		return regionId;
	};

	$: filteredNews = (() => {
		const regionFiltered =
			activeRegion === 'all'
				? allNews
				: allNews.filter((item) => item.region === activeRegion);
		if (selectedSourceId) {
			return regionFiltered.filter((item) => item.sourceId === selectedSourceId);
		}
		return regionFiltered;
	})();

	const activeSource = selectedSourceId
		? publisherList.find((source) => source.id === selectedSourceId) ?? null
		: null;

	$: feedHeadline = activeSource ? `${activeSource.label} 헤드라인` : '글로벌 뉴스 브리핑';
	$: feedDescription = activeSource
		? `${activeSource.label}의 최신 헤드라인을 한눈에 살펴보세요.`
		: '주요 글로벌 언론사의 최신 헤드라인을 큐레이션했습니다.';
	$: feedCountLabel = activeSource
		? `${activeSource.label} 기사 ${filteredNews.length}건`
		: `${resolveRegionLabel(activeRegion)} 기사 ${filteredNews.length}건`;

	const selectRegion = (regionId: RegionId) => {
		activeRegion = regionId;
		selectedSourceId = null;
	};

	const selectSource = (sourceId: SourceId) => {
		if (selectedSourceId === sourceId) {
			selectedSourceId = null;
			return;
		}
		selectedSourceId = sourceId;
		const source = publisherList.find((entry) => entry.id === sourceId);
		if (source) {
			activeRegion = source.region as RegionId;
		}
	};
</script>

<section class="news-feed">
	<header class="feed-header">
		<div class="feed-copy">
			<h1>{feedHeadline}</h1>
			<p>{feedDescription}</p>
		</div>
		<div class="feed-meta">
			<span class="meta-chip">{feedCountLabel}</span>
			<span class="meta-chip meta-chip--notice">※ 신뢰도 높은 언론사의 주요 기사만 선별했습니다.</span>
		</div>
	</header>

	<nav class="region-tabs" aria-label="지역 필터">
		{#each regionTabs as tab}
			<button
				type="button"
				class:active={activeRegion === tab.id}
				on:click={() => selectRegion(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</nav>

	<p class="feed-disclaimer">
		언론사별 헤드라인을 실시간으로 요약합니다. 제작중인 실시간 알림 기능은 추후 제공될 예정입니다.
	</p>

	<div class="feed-body">
		<aside class="publisher-sidebar">
			<h2>요즘 주목받는 언론사</h2>
			<ul>
				{#each publisherList as source}
					<li>
						<button
							type="button"
							class:selected={selectedSourceId === source.id}
							on:click={() => selectSource(source.id)}
						>
							<span class="publisher-dot" style={`--accent:${source.accent};`}>
								{#if source.iconUrl}
									<img src={source.iconUrl} alt={`${source.label} 로고`} loading="lazy" />
								{:else}
									<span>{source.icon ?? source.label.slice(0, 2)}</span>
								{/if}
							</span>
							<div class="publisher-meta">
								<strong>{source.label}</strong>
								<span>{source.region}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</aside>

		<div class="feed-content" aria-live="polite">
			{#if filteredNews.length === 0}
				<div class="empty">
					<p>선택한 조건에 맞는 뉴스 헤드라인이 없습니다.</p>
				</div>
			{:else}
				<div class="feed-scroll">
					<div class="feed-grid">
						{#each filteredNews as news}
							<article class="news-card" style={`--accent:${news.accent};`}>
								<header class="card-header">
									<span class="badge" style={`background:${news.accent};`}>
										{#if news.iconUrl}
											<img class="badge-img" src={news.iconUrl} alt="" loading="lazy" />
										{:else}
											<span class="badge-icon" aria-hidden="true">{news.icon ?? '📰'}</span>
										{/if}
										<span>{news.sourceLabel}</span>
									</span>
									<div class="card-meta">
										<span>{news.region}</span>
										<span>·</span>
										<span>{news.timeAgo}</span>
									</div>
								</header>
								<h3>{news.title}</h3>
								<p class="summary">{news.summary}</p>
								<p class="body">{news.body}</p>
							</article>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.news-feed {
		display: grid;
		gap: 28px;
		color: var(--c-text-primary);
		background: var(--c-bg-800);
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-lg);
		padding: 36px;
		box-shadow: 0 8px 24px var(--c-overlay-strong);
	}

	.feed-header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 18px;
	}

	.feed-copy h1 {
		margin: 0;
		font-size: 1.8rem;
		letter-spacing: 0.02em;
	}

	.feed-copy p {
		margin: 8px 0 0;
		color: var(--c-text-muted);
		font-size: 0.98rem;
	}

	.feed-meta {
		display: flex;
		gap: 8px;
		align-items: flex-start;
	}

	.meta-chip {
		display: inline-flex;
		align-items: center;
		padding: 6px 12px;
		border-radius: 4px;
		font-size: 0.78rem;
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.meta-chip--notice {
		background: var(--c-overlay-strong);
	}

	.region-tabs {
		display: inline-flex;
		gap: 10px;
		background: var(--c-bg-900);
		padding: 6px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--c-border-strong);
		width: fit-content;
	}

	.region-tabs button {
		border: none;
		background: transparent;
		color: var(--c-text-muted);
		padding: 7px 16px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.region-tabs button:hover {
		color: var(--c-text-primary);
		background: var(--c-surface-hover);
	}

	.region-tabs button.active {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.feed-disclaimer {
		margin: 0;
		font-size: 0.85rem;
		color: var(--c-text-muted);
		line-height: 1.5;
	}

	.feed-body {
		display: grid;
		grid-template-columns: minmax(220px, 240px) minmax(0, 1fr);
		gap: 28px;
		align-items: stretch;
		min-height: 0;
	}

	.publisher-sidebar {
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 14px;
		background: var(--c-bg-900);
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-md);
		padding: 20px 18px;
		min-height: 0;
		max-height: clamp(320px, 60vh, 520px);
		overflow: hidden;
	}

	.publisher-sidebar h2 {
		margin: 0;
		font-size: 0.96rem;
		color: var(--c-text-primary);
		letter-spacing: 0.01em;
	}

	.publisher-sidebar ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 10px;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--c-border-soft) transparent;
	}

	.publisher-sidebar ul::-webkit-scrollbar {
		width: 8px;
	}

	.publisher-sidebar ul::-webkit-scrollbar-thumb {
		background: var(--c-border-soft);
		border-radius: 999px;
	}

	.publisher-sidebar ul::-webkit-scrollbar-thumb:hover {
		background: var(--c-border-hover);
	}

	.publisher-sidebar button {
		display: flex;
		align-items: center;
		width: 100%;
		border: none;
		background: var(--c-bg-700);
		border-radius: var(--radius-sm);
		padding: 8px 10px;
		gap: 10px;
		color: inherit;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.publisher-sidebar button:hover {
		transform: translateY(-1px);
		background: var(--c-overlay-strong);
		border-color: var(--c-border-soft);
	}

	.publisher-sidebar button.selected {
		background: var(--c-overlay-strong);
		border: 1px solid var(--c-border-hover);
	}

	.publisher-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--c-text-primary);
		font-weight: 700;
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		box-shadow: 0 0 0 2px var(--c-bg-900);
	}

	.publisher-dot img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 50%;
	}

	.publisher-dot span {
		line-height: 1;
	}

	.publisher-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.publisher-meta strong {
		font-size: 0.88rem;
		color: var(--c-text-primary);
	}

	.publisher-meta span {
		font-size: 0.72rem;
		color: var(--c-text-muted);
	}

	.feed-content {
		display: grid;
		gap: 22px;
		max-height: clamp(420px, 60vh, 620px);
		min-height: 0;
		overflow: hidden;
	}

	.feed-scroll {
		display: grid;
		gap: 22px;
		overflow-y: auto;
		padding-right: 4px;
		scrollbar-width: thin;
		scrollbar-color: var(--c-border-soft) transparent;
		max-height: inherit;
		height: 100%;
		min-height: 0;
	}

	.feed-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.feed-scroll::-webkit-scrollbar-thumb {
		background: var(--c-border-soft);
		border-radius: 999px;
	}

	.feed-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--c-border-hover);
	}

	.feed-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 22px;
	}

	.news-card {
		display: grid;
		gap: 12px;
		padding: 24px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-border-strong);
		position: relative;
	}

	.news-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		border: 1px solid transparent;
		background: linear-gradient(var(--accent), transparent) border-box;
		mask: linear-gradient(var(--c-text-primary), var(--c-text-primary)), linear-gradient(var(--c-text-primary), var(--c-text-primary));
		mask-composite: exclude;
		-webkit-mask: linear-gradient(var(--c-text-primary), var(--c-text-primary)), linear-gradient(var(--c-text-primary), var(--c-text-primary));
		-webkit-mask-composite: xor;
		opacity: 0.3;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 12px;
		border-radius: 4px;
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--c-text-primary);
	}

	.badge-img {
		width: 18px;
		height: 18px;
		object-fit: contain;
		border-radius: 4px;
	}

	.badge-icon {
		font-size: 1rem;
		line-height: 1;
	}

	.card-meta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.news-card h3 {
		margin: 0;
		font-size: 1.05rem;
		color: var(--c-text-primary);
	}

	.summary {
		margin: 0;
		font-size: 0.9rem;
		color: var(--c-text-secondary);
		line-height: 1.55;
	}

	.body {
		margin: 0;
		font-size: 0.82rem;
		color: var(--c-text-muted);
		line-height: 1.6;
	}

	.empty {
		grid-column: 1 / -1;
		padding: 48px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px dashed var(--c-bg-700);
		text-align: center;
		color: var(--c-text-muted);
	}

	/* 반응형 브레이크포인트 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		.news-feed {
			padding: 40px;
			max-width: 1400px;
			margin: 0 auto;
		}
		
		.news-feed h2 {
			font-size: 2rem;
		}
		
		.feed-scroll {
			max-height: min(600px, 70vh);
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.news-feed {
			padding: 36px;
			max-width: 1200px;
			margin: 0 auto;
		}
		
		.news-feed h2 {
			font-size: 1.75rem;
		}
		
		.feed-scroll {
			max-height: min(550px, 65vh);
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.news-feed {
			padding: 32px;
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.news-feed h2 {
			font-size: 1.5rem;
		}
		
		.feed-scroll {
			max-height: min(500px, 60vh);
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.news-feed {
			padding: 28px;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		
		.publisher-sidebar {
			order: 2;
		}
		
		.feed-content {
			order: 1;
			max-height: none;
		}
		
		.feed-scroll {
			max-height: min(450px, 55vh);
		}
		
		.feed-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		.news-feed {
			padding: 24px 20px;
			border-radius: 16px;
		}
		
		.news-feed h2 {
			font-size: 1.25rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		
		.publisher-sidebar {
			order: 2;
		}
		
		.feed-content {
			order: 1;
			max-height: none;
		}
		
		.feed-scroll {
			max-height: min(400px, 50vh);
		}
		
		.feed-grid {
			grid-template-columns: 1fr;
		}
		
		.news-card {
			padding: 16px;
		}
		
		.news-card h3 {
			font-size: 1rem;
		}
		
		.summary {
			font-size: 0.85rem;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.news-feed {
			padding: 20px 16px;
			border-radius: 12px;
		}
		
		.news-feed h2 {
			font-size: 1.125rem;
		}
		
		.news-feed p {
			font-size: 0.85rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		
		.publisher-sidebar {
			order: 2;
		}
		
		.feed-content {
			order: 1;
			max-height: none;
		}
		
		.feed-scroll {
			max-height: min(350px, 45vh);
		}
		
		.feed-grid {
			grid-template-columns: 1fr;
		}
		
		.news-card {
			padding: 14px;
		}
		
		.news-card h3 {
			font-size: 0.95rem;
		}
		
		.summary {
			font-size: 0.8rem;
		}
		
		.body {
			font-size: 0.75rem;
		}
		
		.card-meta {
			font-size: 0.75rem;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.news-feed {
			padding: 16px 12px;
			border-radius: 8px;
		}
		
		.news-feed h2 {
			font-size: 1rem;
		}
		
		.news-feed p {
			font-size: 0.8rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		
		.publisher-sidebar {
			order: 2;
		}
		
		.feed-content {
			order: 1;
			max-height: none;
		}
		
		.feed-scroll {
			max-height: min(300px, 40vh);
		}
		
		.feed-grid {
			grid-template-columns: 1fr;
		}
		
		.news-card {
			padding: 12px;
		}
		
		.news-card h3 {
			font-size: 0.9rem;
		}
		
		.summary {
			font-size: 0.75rem;
		}
		
		.body {
			font-size: 0.7rem;
		}
		
		.card-meta {
			font-size: 0.7rem;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.news-card {
			min-height: 44px;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.news-feed h2 {
			font-weight: 700;
		}
	}

	/* Badge Icon 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.badge-icon {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.badge-icon {
			font-size: 0.85rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.badge-icon {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 479px) {
		.badge-icon {
			font-size: 0.75rem;
		}
	}

	/* Empty 상태 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.empty {
			padding: 40px;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.empty {
			padding: 32px;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.empty {
			padding: 24px;
		}
	}

	@media (max-width: 479px) {
		.empty {
			padding: 20px;
		}
	}

	/* Feed Copy 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.feed-copy h1 {
			font-size: 1.6rem;
		}
		
		.feed-copy p {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.feed-copy h1 {
			font-size: 1.4rem;
		}
		
		.feed-copy p {
			font-size: 0.85rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.feed-copy h1 {
			font-size: 1.2rem;
		}
		
		.feed-copy p {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 479px) {
		.feed-copy h1 {
			font-size: 1.1rem;
		}
		
		.feed-copy p {
			font-size: 0.75rem;
		}
	}

	/* Meta Chip 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.meta-chip {
			padding: 5px 10px;
			font-size: 0.75rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.meta-chip {
			padding: 4px 8px;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.meta-chip {
			padding: 3px 6px;
			font-size: 0.65rem;
		}
	}

	@media (max-width: 479px) {
		.meta-chip {
			padding: 2px 5px;
			font-size: 0.6rem;
		}
	}

	/* Region Tabs 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.region-tabs {
			gap: 8px;
			padding: 5px;
		}
		
		.region-tabs button {
			padding: 6px 14px;
			font-size: 0.8rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.region-tabs {
			gap: 6px;
			padding: 4px;
		}
		
		.region-tabs button {
			padding: 5px 12px;
			font-size: 0.75rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.region-tabs {
			gap: 4px;
			padding: 3px;
		}
		
		.region-tabs button {
			padding: 4px 10px;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 479px) {
		.region-tabs {
			gap: 3px;
			padding: 2px;
		}
		
		.region-tabs button {
			padding: 3px 8px;
			font-size: 0.65rem;
		}
	}

	/* Feed Disclaimer 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.feed-disclaimer {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.feed-disclaimer {
			font-size: 0.75rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.feed-disclaimer {
			font-size: 0.7rem;
		}
	}

	@media (max-width: 479px) {
		.feed-disclaimer {
			font-size: 0.65rem;
		}
	}

	/* Publisher Sidebar 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.publisher-sidebar {
			min-width: 200px;
		}
		
		.publisher-sidebar ul {
			gap: 8px;
		}
		
		.publisher-sidebar li {
			padding: 6px 8px;
		}
		
		.publisher-meta strong {
			font-size: 0.8rem;
		}
		
		.publisher-meta span {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.publisher-sidebar {
			min-width: 180px;
		}
		
		.publisher-sidebar ul {
			gap: 6px;
		}
		
		.publisher-sidebar li {
			padding: 5px 6px;
		}
		
		.publisher-meta strong {
			font-size: 0.75rem;
		}
		
		.publisher-meta span {
			font-size: 0.6rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.publisher-sidebar {
			min-width: 160px;
		}
		
		.publisher-sidebar ul {
			gap: 4px;
		}
		
		.publisher-sidebar li {
			padding: 4px 5px;
		}
		
		.publisher-meta strong {
			font-size: 0.7rem;
		}
		
		.publisher-meta span {
			font-size: 0.55rem;
		}
	}

	@media (max-width: 479px) {
		.publisher-sidebar {
			min-width: 140px;
		}
		
		.publisher-sidebar ul {
			gap: 3px;
		}
		
		.publisher-sidebar li {
			padding: 3px 4px;
		}
		
		.publisher-meta strong {
			font-size: 0.65rem;
		}
		
		.publisher-meta span {
			font-size: 0.5rem;
		}
	}

	/* Badge 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.badge {
			padding: 3px 10px;
			font-size: 0.75rem;
		}
		
		.badge-img {
			width: 16px;
			height: 16px;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.badge {
			padding: 2px 8px;
			font-size: 0.7rem;
		}
		
		.badge-img {
			width: 14px;
			height: 14px;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.badge {
			padding: 2px 6px;
			font-size: 0.65rem;
		}
		
		.badge-img {
			width: 12px;
			height: 12px;
		}
	}

	@media (max-width: 479px) {
		.badge {
			padding: 1px 5px;
			font-size: 0.6rem;
		}
		
		.badge-img {
			width: 10px;
			height: 10px;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		.news-feed {
			background: var(--c-bg-800);
		}
	}
</style>
