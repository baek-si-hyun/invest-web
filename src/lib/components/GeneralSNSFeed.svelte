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
		color: #e5e5e5;
		background: #282a2c;
		border: 1px solid #3b3b3b;
		border-radius: 12px;
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
		color: #b0b0b0;
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
		background: #3b3b3b;
		color: #ffffff;
	}

	.meta-chip--notice {
		background: #5a5a5a;
	}

	.platform-tabs {
		display: inline-flex;
		gap: 10px;
		background: #222222;
		padding: 6px;
		border-radius: 6px;
		border: 1px solid #3b3b3b;
		width: fit-content;
	}

	.platform-tabs button {
		border: none;
		background: transparent;
		color: #b0b0b0;
		padding: 7px 16px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		transition: all 0.2s ease;
	}

	.platform-tabs button:hover {
		color: #ffffff;
		background: #3b3b3b;
	}

	.platform-tabs button.active {
		background: #3b3b3b;
		color: #ffffff;
	}

	.feed-disclaimer {
		margin: 0;
		font-size: 0.85rem;
		color: #b0b0b0;
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
		background: #222222;
		border: 1px solid #3b3b3b;
		border-radius: 8px;
		padding: 20px 18px;
		min-height: 0;
		max-height: clamp(320px, 60vh, 520px);
		overflow: hidden;
	}

	.hot-sidebar h2 {
		margin: 0;
		font-size: 0.96rem;
		color: #ffffff;
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
		scrollbar-color: rgba(120, 138, 188, 0.55) transparent;
	}

	.hot-sidebar ul::-webkit-scrollbar {
		width: 8px;
	}

	.hot-sidebar ul::-webkit-scrollbar-track {
		background: transparent;
	}

	.hot-sidebar ul::-webkit-scrollbar-thumb {
		background: rgba(120, 138, 188, 0.35);
		border-radius: 999px;
	}

	.hot-sidebar ul::-webkit-scrollbar-thumb:hover {
		background: rgba(120, 138, 188, 0.5);
	}

	.hot-sidebar button {
		display: flex;
		align-items: center;
		width: 100%;
		border: none;
		background: #3b3b3b;
		border-radius: 6px;
		padding: 8px 10px;
		gap: 10px;
		color: inherit;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.hot-sidebar button:hover {
		transform: translateY(-1px);
		background: #5a5a5a;
	}

	.hot-sidebar button.selected {
		background: #5a5a5a;
		border: 1px solid #7a7a7a;
	}

	.platform-dot {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--accent);
		color: #0b1024;
		box-shadow: 0 0 0 2px rgba(12, 16, 32, 0.8);
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
		color: #ffffff;
	}

	.figure-meta span {
		font-size: 0.72rem;
		color: #b0b0b0;
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

	.feed-scroll::-webkit-scrollbar-track {
		background: transparent;
	}

	.feed-scroll::-webkit-scrollbar-thumb {
		background: rgba(120, 138, 188, 0.4);
		border-radius: 999px;
	}

	.feed-scroll::-webkit-scrollbar-thumb:hover {
		background: rgba(120, 138, 188, 0.6);
	}

	.feed-card {
		display: grid;
		gap: 14px;
		padding: 24px;
		border-radius: 8px;
		background: #222222;
		border: 1px solid #3b3b3b;
		position: relative;
	}

	.feed-card::before {
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
		align-items: center;
		gap: 14px;
	}

	.card-header img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid rgba(120, 144, 240, 0.6);
	}

	.card-profile strong {
		display: block;
		font-size: 1rem;
		color: #ffffff;
	}

	.card-profile .handle {
		font-size: 0.8rem;
		color: #b0b0b0;
	}

	.platform-label {
		margin-left: auto;
		font-size: 0.76rem;
		color: #ffffff;
		padding: 4px 10px;
		border-radius: 4px;
		background: #3b3b3b;
	}

	.card-content {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: #e5e5e5;
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
		color: #b0b0b0;
	}

	.card-meta a {
		color: #6a9eff;
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
		color: #b0b0b0;
	}

	.card-detail {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.55;
		color: #b0b0b0;
	}

	.empty {
		grid-column: 1 / -1;
		padding: 48px;
		border-radius: 8px;
		background: #222222;
		border: 1px dashed #3b3b3b;
		text-align: center;
		color: #b0b0b0;
	}

	@media (max-width: 640px) {
		.sns-feed {
			padding: 28px 20px;
			border-radius: 22px;
		}

		.feed-body {
			grid-template-columns: 1fr;
		}

		.hot-sidebar {
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
