<script lang="ts">
	import { socialPlatforms, type SocialPost } from '$lib/data/social';

	type PlatformId = (typeof socialPlatforms)[number]['id'];

	const platformTabs: Array<{ id: 'all' | PlatformId; label: string }> = [
		{ id: 'all', label: '전체' },
		...socialPlatforms.map((platform) => ({ id: platform.id, label: platform.label }))
	];

	const platformAccents: Record<PlatformId, string> = {
		x: '#38bdf8',
		facebook: '#22c55e'
	};

	const deriveFigureKey = (handle: string) => handle.trim().toLowerCase();

	type FeedPost = SocialPost & {
		platformId: PlatformId;
		accent: string;
		figureKey: string;
	};

	const allPosts: FeedPost[] = socialPlatforms.flatMap((platform) =>
		platform.posts.map((post) => ({
			...post,
			platformId: platform.id,
			accent: platformAccents[platform.id] ?? '#818cf8',
			figureKey: deriveFigureKey(post.handle)
		}))
	);

let activeTab: (typeof platformTabs)[number]['id'] = 'all';
let selectedFigureId: string | null = null;

type HotFigure = {
	id: string;
	name: string;
		handle: string;
		avatar: string;
		platform: PlatformId;
		accent: string;
	};

	const hotFigures: HotFigure[] = (() => {
		const figures = new Map<string, HotFigure>();
		for (const post of allPosts) {
			if (figures.has(post.figureKey)) continue;
			figures.set(post.figureKey, {
				id: post.figureKey,
				name: post.nickname,
				handle: post.handle,
				avatar: post.avatar,
				platform: post.platformId,
				accent: post.accent
			});
		}
		return Array.from(figures.values());
	})();

$: filteredPosts = (() => {
	const platformFiltered =
		activeTab === 'all'
				? allPosts
				: allPosts.filter((post) => post.platformId === activeTab);
		if (selectedFigureId) {
			return platformFiltered.filter((post) => post.figureKey === selectedFigureId);
		}
	return platformFiltered;
})();

const findFigure = (id: string | null) => (id ? hotFigures.find((figure) => figure.id === id) ?? null : null);

$: activeFigure = findFigure(selectedFigureId);
$: feedHeadline = activeFigure ? `${activeFigure.name} 인사이트` : '실시간 SNS 브리핑';
$: feedDescription = activeFigure
	? `${activeFigure.name}의 최신 게시물을 한 번에 확인하세요.`
	: '트위터(X)와 페이스북 유명 인사의 최신 게시물을 한눈에 요약했습니다.';

const resolvePlatformLabel = (id: 'all' | PlatformId) => {
	if (id === 'all') return '전체';
	return platformTabs.find((tab) => tab.id === id)?.label ?? '선택한 플랫폼';
};

$: feedCountLabel = activeFigure
	? `${activeFigure.name} 게시물 ${filteredPosts.length}건`
	: `${resolvePlatformLabel(activeTab)} 게시물 ${filteredPosts.length}건`;

const selectPlatform = (platformId: 'all' | PlatformId) => {
	activeTab = platformId;
	selectedFigureId = null;
};

	const selectFigure = (figure: HotFigure) => {
		if (selectedFigureId === figure.id) {
			selectedFigureId = null;
			return;
		}
		selectedFigureId = figure.id;
		activeTab = figure.platform;
	};
</script>

<section class="sns-feed">
	<header class="feed-header">
		<div class="feed-copy">
			<h1>{feedHeadline}</h1>
			<p>{feedDescription}</p>
		</div>
		<div class="feed-meta">
			<span class="meta-chip">{feedCountLabel}</span>
			<span class="meta-chip meta-chip--notice">※ 공식 계정 게시물 기반 큐레이션</span>
		</div>
	</header>

	<nav class="platform-tabs" aria-label="플랫폼 필터">
		{#each platformTabs as tab}
			<button
				type="button"
				class:active={activeTab === tab.id}
				on:click={() => selectPlatform(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</nav>

	<p class="feed-disclaimer">
		Invest Hub이 공식 계정 게시물을 모니터링해 키 포인트만 요약합니다. 실시간 데이터
		동기화는 베타 단계입니다.
	</p>

	<div class="feed-body">
		<aside class="hot-sidebar">
			<h2>요즘 핫한 인물들</h2>
			<ul>
				{#each hotFigures as figure}
					<li>
						<button
							type="button"
							class:selected={selectedFigureId === figure.id}
							on:click={() => selectFigure(figure)}
						>
							<span class="platform-dot" style={`--accent:${figure.accent};`}>
								{#if figure.platform === 'x'}
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path
											fill="currentColor"
											d="M18.9 3H21l-6.44 7.37L21.77 21h-5.68l-4.06-5.3L7.1 21H3l6.82-7.81L2.23 3h5.74l3.7 4.89L18.9 3Zm-1.99 16h1.1L7.24 4h-1.2Z"
										/>
									</svg>
								{:else}
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path
											fill="currentColor"
											d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0 1 14.3 6h3v3h-3c-.28 0-.5.22-.5.5V12H17l-.5 3h-2.7v7A10 10 0 0 0 22 12Z"
										/>
									</svg>
								{/if}
							</span>
							<div class="figure-meta">
								<strong>{figure.name}</strong>
								<span>{figure.handle}</span>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		</aside>

		<div class="feed-content" aria-live="polite">
			{#if filteredPosts.length === 0}
				<div class="empty">
					<p>선택한 플랫폼에서 표시할 게시물이 없습니다.</p>
				</div>
			{:else}
				<div class="feed-scroll">
					<div class="feed-grid">
						{#each filteredPosts as post}
							<article class={`feed-card platform-${post.platform}`} style={`--accent:${post.accent};`}>
								<header class="card-header">
									<img src={post.avatar} alt={`${post.nickname} 프로필`} loading="lazy" />
									<div class="card-profile">
										<strong>{post.nickname}</strong>
										<span class="handle">{post.handle}</span>
									</div>
									<span class="platform-label">{post.platformLabel}</span>
								</header>
								<p class="card-content">{post.content}</p>
								<footer class="card-footer">
									<div class="card-meta">
										<span>{post.timeAgo}</span>
										{#if post.url}
											<a href={post.url} rel="noopener" target="_blank">원문 보기</a>
										{/if}
									</div>
									{#if post.reactions}
										{@const reactions = post.reactions}
										<ul class="card-reactions">
											<li>👍 {reactions.likes.toLocaleString('ko-KR')}</li>
											<li>💬 {reactions.comments.toLocaleString('ko-KR')}</li>
											<li>↗ {reactions.shares.toLocaleString('ko-KR')}</li>
										</ul>
									{/if}
									<p class="card-detail">{post.detail}</p>
								</footer>
							</article>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.sns-feed {
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

	.platform-tabs {
		display: inline-flex;
		gap: 10px;
		background: var(--c-bg-900);
		padding: 6px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--c-border-strong);
		width: fit-content;
	}

	.platform-tabs button {
		border: none;
		background: transparent;
		color: var(--c-text-muted);
		padding: 7px 16px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.platform-tabs button:hover {
		color: var(--c-text-primary);
		background: var(--c-surface-hover);
	}

	.platform-tabs button.active {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.feed-disclaimer {
		margin: 0;
		font-size: 0.85rem;
		color: var(--c-text-muted);
		line-height: 1.5;
	}

	.feed-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 22px;
	}

	.feed-body {
		display: grid;
		grid-template-columns: minmax(220px, 240px) minmax(0, 1fr);
		gap: 28px;
		align-items: stretch;
		min-height: 0;
	}

	.hot-sidebar {
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

	.hot-sidebar h2 {
		margin: 0;
		font-size: 0.96rem;
		color: var(--c-text-primary);
		letter-spacing: 0.01em;
	}

	.hot-sidebar ul {
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

	.hot-sidebar ul::-webkit-scrollbar {
		width: 8px;
	}

	.hot-sidebar ul::-webkit-scrollbar-track {
		background: transparent;
	}

	.hot-sidebar ul::-webkit-scrollbar-thumb {
		background: var(--c-border-soft);
		border-radius: 999px;
	}

	.hot-sidebar ul::-webkit-scrollbar-thumb:hover {
		background: var(--c-border-hover);
	}

	.hot-sidebar button {
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

	.hot-sidebar button:hover {
		transform: translateY(-1px);
		background: var(--c-overlay-strong);
		border-color: var(--c-border-soft);
	}

	.hot-sidebar button.selected {
		background: var(--c-overlay-strong);
		border: 1px solid var(--c-border-hover);
	}

	.platform-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--c-text-primary);
		box-shadow: 0 0 0 2px var(--c-bg-900);
	}

	.platform-dot svg {
		width: 16px;
		height: 16px;
	}

	.figure-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.figure-meta strong {
		font-size: 0.88rem;
		color: var(--c-text-primary);
	}

	.figure-meta span {
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

	.feed-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.feed-scroll::-webkit-scrollbar-thumb {
		background: var(--c-border-soft);
		border-radius: 999px;
	}

	.feed-scroll::-webkit-scrollbar-thumb:hover {
		background: var(--c-border-hover);
	}

	.feed-card {
		display: grid;
		gap: 14px;
		padding: 24px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-border-strong);
		position: relative;
	}

	.feed-card::before {
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
		align-items: center;
		gap: 14px;
	}

	.card-header img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--c-border-hover);
	}

	.card-profile strong {
		display: block;
		font-size: 1rem;
		color: var(--c-text-primary);
	}

	.card-profile .handle {
		font-size: 0.8rem;
		color: var(--c-text-muted);
	}

	.platform-label {
		margin-left: auto;
		font-size: 0.76rem;
		color: var(--c-text-primary);
		padding: 4px 10px;
		border-radius: 4px;
		background: var(--c-bg-700);
	}

	.card-content {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--c-text-primary);
	}

	.card-footer {
		display: grid;
		gap: 10px;
	}

	.card-meta {
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.card-meta a {
		color: var(--c-link);
		text-decoration: none;
		font-weight: 600;
	}

	.card-meta a:hover {
		text-decoration: underline;
	}

	.card-reactions {
		display: flex;
		gap: 14px;
		list-style: none;
		margin: 0;
		padding: 0;
		font-size: 0.8rem;
		color: var(--c-text-muted);
	}

	.card-detail {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--c-text-muted);
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
		.sns-feed {
			padding: 40px;
			max-width: 1400px;
			margin: 0 auto;
		}
		
		.sns-feed h2 {
			font-size: 2rem;
		}
		
		.feed-scroll {
			max-height: min(600px, 70vh);
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.sns-feed {
			padding: 36px;
			max-width: 1200px;
			margin: 0 auto;
		}
		
		.sns-feed h2 {
			font-size: 1.75rem;
		}
		
		.feed-scroll {
			max-height: min(550px, 65vh);
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.sns-feed {
			padding: 32px;
			max-width: 1000px;
			margin: 0 auto;
		}
		
		.sns-feed h2 {
			font-size: 1.5rem;
		}
		
		.feed-scroll {
			max-height: min(500px, 60vh);
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.sns-feed {
			padding: 28px;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 24px;
		}
		
		.hot-sidebar {
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
		.sns-feed {
			padding: 24px 20px;
			border-radius: 16px;
		}
		
		.sns-feed h2 {
			font-size: 1.25rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		
		.hot-sidebar {
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
		
		.feed-card {
			padding: 16px;
		}
		
		.card-content {
			font-size: 0.9rem;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.sns-feed {
			padding: 20px 16px;
			border-radius: 12px;
		}
		
		.sns-feed h2 {
			font-size: 1.125rem;
		}
		
		.sns-feed p {
			font-size: 0.85rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 16px;
		}
		
		.hot-sidebar {
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
		
		.feed-card {
			padding: 14px;
		}
		
		.card-content {
			font-size: 0.85rem;
		}
		
		.card-meta {
			font-size: 0.75rem;
		}
		
		.card-reactions {
			font-size: 0.75rem;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.sns-feed {
			padding: 16px 12px;
			border-radius: 8px;
		}
		
		.sns-feed h2 {
			font-size: 1rem;
		}
		
		.sns-feed p {
			font-size: 0.8rem;
		}
		
		.feed-body {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		
		.hot-sidebar {
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
		
		.feed-card {
			padding: 12px;
		}
		
		.card-content {
			font-size: 0.8rem;
		}
		
		.card-meta {
			font-size: 0.7rem;
		}
		
		.card-reactions {
			font-size: 0.7rem;
		}
		
		.card-detail {
			font-size: 0.8rem;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.feed-card {
			min-height: 44px;
		}
		
		.card-meta a {
			min-height: 44px;
			display: flex;
			align-items: center;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.sns-feed h2 {
			font-weight: 700;
		}
	}

	/* Card Footer 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.card-footer {
			gap: 8px;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.card-footer {
			gap: 6px;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.card-footer {
			gap: 4px;
		}
	}

	@media (max-width: 479px) {
		.card-footer {
			gap: 3px;
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

	/* Platform Tabs 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.platform-tabs {
			gap: 8px;
			padding: 5px;
		}
		
		.platform-tabs button {
			padding: 6px 14px;
			font-size: 0.8rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.platform-tabs {
			gap: 6px;
			padding: 4px;
		}
		
		.platform-tabs button {
			padding: 5px 12px;
			font-size: 0.75rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.platform-tabs {
			gap: 4px;
			padding: 3px;
		}
		
		.platform-tabs button {
			padding: 4px 10px;
			font-size: 0.7rem;
		}
	}

	@media (max-width: 479px) {
		.platform-tabs {
			gap: 3px;
			padding: 2px;
		}
		
		.platform-tabs button {
			padding: 3px 8px;
			font-size: 0.65rem;
		}
	}

	/* Hot Sidebar 반응형 */
	@media (max-width: 1023px) and (min-width: 768px) {
		.hot-sidebar {
			min-width: 200px;
		}
		
		.hot-sidebar ul {
			gap: 8px;
		}
		
		.hot-sidebar li {
			padding: 6px 8px;
		}
		
		.platform-meta strong {
			font-size: 0.8rem;
		}
		
		.platform-meta span {
			font-size: 0.65rem;
		}
	}

	@media (max-width: 767px) and (min-width: 640px) {
		.hot-sidebar {
			min-width: 180px;
		}
		
		.hot-sidebar ul {
			gap: 6px;
		}
		
		.hot-sidebar li {
			padding: 5px 6px;
		}
		
		.platform-meta strong {
			font-size: 0.75rem;
		}
		
		.platform-meta span {
			font-size: 0.6rem;
		}
	}

	@media (max-width: 639px) and (min-width: 480px) {
		.hot-sidebar {
			min-width: 160px;
		}
		
		.hot-sidebar ul {
			gap: 4px;
		}
		
		.hot-sidebar li {
			padding: 4px 5px;
		}
		
		.platform-meta strong {
			font-size: 0.7rem;
		}
		
		.platform-meta span {
			font-size: 0.55rem;
		}
	}

	@media (max-width: 479px) {
		.hot-sidebar {
			min-width: 140px;
		}
		
		.hot-sidebar ul {
			gap: 3px;
		}
		
		.hot-sidebar li {
			padding: 3px 4px;
		}
		
		.platform-meta strong {
			font-size: 0.65rem;
		}
		
		.platform-meta span {
			font-size: 0.5rem;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		.sns-feed {
			background: var(--c-bg-800);
		}
	}
</style>
