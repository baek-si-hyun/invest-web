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
		border: 1px solid var(--c-bg-700);
		border-radius: var(--radius-lg);
		padding: 36px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
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
		background: rgba(255, 255, 255, 0.12);
	}

	.region-tabs {
		display: inline-flex;
		gap: 10px;
		background: var(--c-bg-900);
		padding: 6px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--c-bg-700);
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
		background: var(--c-bg-700);
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
		border: 1px solid var(--c-bg-700);
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
		scrollbar-color: rgba(120, 138, 188, 0.55) transparent;
	}

	.publisher-sidebar ul::-webkit-scrollbar {
		width: 8px;
	}

	.publisher-sidebar ul::-webkit-scrollbar-thumb {
		background: rgba(120, 138, 188, 0.35);
		border-radius: 999px;
	}

	.publisher-sidebar ul::-webkit-scrollbar-thumb:hover {
		background: rgba(120, 138, 188, 0.5);
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
		background: rgba(255, 255, 255, 0.12);
	}

	.publisher-sidebar button.selected {
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.16);
	}

	.publisher-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--accent);
		color: #0b1024;
		font-weight: 700;
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		box-shadow: 0 0 0 2px rgba(12, 16, 32, 0.8);
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
		scrollbar-color: rgba(120, 138, 188, 0.65) transparent;
		max-height: inherit;
		height: 100%;
		min-height: 0;
	}

	.feed-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.feed-scroll::-webkit-scrollbar-thumb {
		background: rgba(120, 138, 188, 0.4);
		border-radius: 999px;
	}

	.feed-scroll::-webkit-scrollbar-thumb:hover {
		background: rgba(120, 138, 188, 0.6);
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
		border: 1px solid var(--c-bg-700);
		position: relative;
	}

	.news-card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		border: 1px solid transparent;
		background: linear-gradient(var(--accent), transparent) border-box;
		mask: linear-gradient(#000, #000), linear-gradient(#000, #000);
		mask-composite: exclude;
		-webkit-mask: linear-gradient(#000, #000), linear-gradient(#000, #000);
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
		color: #0b1024;
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

	@media (max-width: 640px) {
		.news-feed {
			padding: 28px 20px;
			border-radius: var(--radius-lg);
		}

		.feed-body {
			grid-template-columns: 1fr;
		}

		.publisher-sidebar {
			order: 2;
		}

		.feed-content {
			order: 1;
			max-height: none;
		}

		.feed-scroll {
			max-height: min(420px, 60vh);
		}

		.feed-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
