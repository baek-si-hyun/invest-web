<script lang="ts">
	import { base } from '$app/paths';
	import { categories } from '$lib/data/categories';
	import { economicEvents } from '$lib/data/economicEvents';
	import { communityBoards } from '$lib/data/community';
	import {
		marketOverviewCards,
		todayEventSchedule,
		todayMarketIssues
	} from '$lib/data/home';

	const formatTime = new Intl.DateTimeFormat('ko-KR', {
		hour: '2-digit',
		minute: '2-digit'
	});

	const formatDate = new Intl.DateTimeFormat('ko-KR', {
		month: 'long',
		day: 'numeric',
		weekday: 'long'
	});

	const now = new Date();
	const currentTime = formatTime.format(now);
	const currentDate = formatDate.format(now);

	const upcomingEvents = [...economicEvents]
		.sort((a, b) => a.date.localeCompare(b.date))
		.slice(0, 5);

	const featuredBoards = communityBoards.slice(0, 4);

	const todayEvents = todayEventSchedule.slice(0, 5);
	const todayIssues = todayMarketIssues.slice(0, 5);

	const withBase = (path: string) => `${base}${path}`;
</script>

<div class="general-dashboard">
	<header class="dashboard-header">
		<div class="header-top">
			<div class="header-brand">
				<h1>Invest Hub</h1>
				<p>투자 정보를 한눈에</p>
			</div>
			<div class="header-clock" aria-label="현재 시각">
				<strong>{currentTime}</strong>
				<span>{currentDate}</span>
			</div>
		</div>

		<div class="header-panels">
			<section class="focus-panel">
				<h3>오늘의 중요 이벤트</h3>
				<ul class="focus-list">
					{#each todayEvents as event}
						<li class={`focus-card impact-${event.impact}`}>
							<span class="focus-time">{event.time}</span>
							<span class="focus-title">{event.title}</span>
						</li>
					{/each}
				</ul>
			</section>
			<section class="focus-panel">
				<h3>주요 시장 이슈</h3>
				<ul class="focus-list">
					{#each todayIssues as issue}
						<li class={`focus-card trend-${issue.trend}`}>
							<span class="focus-chip">{issue.category}</span>
							<span class="focus-title">{issue.title}</span>
							<span class="focus-trend">{issue.trend === 'up' ? '↗' : '↘'}</span>
						</li>
					{/each}
				</ul>
			</section>
		</div>
	</header>

	<section class="dashboard-section">
		<div class="section-header">
			<h2>주요 지표</h2>
			<p>자산군 별 대표 지표를 빠르게 확인하세요.</p>
		</div>
		<div class="metrics-grid">
			{#each marketOverviewCards as item}
				<article class={`metric-card trend-${item.trend}`}>
					<header>
						<span class="metric-name">{item.name}</span>
						<span class="metric-symbol">{item.symbol}</span>
					</header>
					<div class="metric-body">
						<strong>{item.price}</strong>
						<span class="metric-change">
							{item.trend === 'up' ? '+' : ''}
							{item.change}%
						</span>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<h2>자산군</h2>
			<p>관심 있는 자산군을 선택해 세부 인사이트를 확인하세요.</p>
		</div>
		<div class="category-grid">
			{#each categories as category}
				<a class="category-card" href={withBase(`/${category.slug}/`)}>
					<span class="category-icon">{category.emoji}</span>
					<div class="category-body">
						<strong>{category.name}</strong>
						<p>{category.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<h2>경제 이벤트</h2>
			<p>다가오는 주요 일정을 미리 확인하고 대응 전략을 준비하세요.</p>
		</div>
		<div class="events-grid">
			{#if upcomingEvents.length === 0}
				<p class="empty-copy">예정된 이벤트가 없습니다.</p>
			{:else}
				{#each upcomingEvents as event}
					<article class="event-card">
						<header>
							<div class="event-header">
								<span class="event-flag">{event.flag}</span>
								<div>
									<strong>{event.title}</strong>
									<span class="event-meta">{event.country} · {event.indicator}</span>
								</div>
							</div>
							<span class="event-date">{event.date}</span>
						</header>
						<p>{event.description}</p>
						<footer>
							<span class={`event-badge importance-${event.importance}`}>
								{event.importance === 'high'
									? '중요'
									: event.importance === 'medium'
										? '관심'
										: '체크'}
							</span>
							{#if event.forecast}
								<span class="event-forecast">예상 {event.forecast}</span>
							{/if}
						</footer>
					</article>
				{/each}
			{/if}
		</div>
	</section>

	<section class="dashboard-section">
		<div class="section-header">
			<h2>커뮤니티</h2>
			<p>전문가와 트레이더들이 모여 인사이트를 공유하는 공간입니다.</p>
		</div>
		<div class="community-grid">
			{#each featuredBoards as board}
				<article class="community-card">
					<div class="community-icon">{board.emoji}</div>
					<div class="community-body">
						<strong>{board.title}</strong>
						<p>{board.description}</p>
						<div class="community-meta">
							<span>멤버 {board.metrics.members}</span>
							<span>오늘 {board.metrics.postsToday}개 글</span>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>

<style>
	.general-dashboard {
		max-width: 1240px;
		margin: 0 auto;
		padding: 36px 36px 72px;
		display: grid;
		gap: 48px;
		color: var(--c-text-primary);
	}

	.dashboard-header {
		display: grid;
		gap: 32px;
		background: var(--c-bg-800);
		border: 1px solid var(--c-bg-700);
		border-radius: var(--radius-lg);
		padding: 32px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}

	.header-brand h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		letter-spacing: 0.03em;
	}

	.header-brand p {
		margin: 6px 0 0;
		font-size: 1rem;
		color: var(--c-text-muted);
	}

	.header-clock {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		min-width: 160px;
		text-align: right;
	}

	.header-clock strong {
		font-size: 2rem;
		font-weight: 700;
		color: var(--c-text-primary);
	}

	.header-clock span {
		font-size: 0.9rem;
		color: var(--c-text-muted);
	}

	.header-panels {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}

	.focus-panel {
		display: grid;
		gap: 16px;
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		border-radius: var(--radius-md);
		padding: 20px;
	}

	.focus-panel h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--c-text-primary);
	}

	.focus-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}

	.focus-card {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		border-radius: var(--radius-sm);
		background: var(--c-bg-700);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.focus-card.impact-high {
		border-left: 4px solid rgba(255, 99, 132, 0.75);
	}

	.focus-card.impact-medium {
		border-left: 4px solid rgba(255, 177, 66, 0.75);
	}

	.focus-card.impact-low {
		border-left: 4px solid rgba(104, 196, 255, 0.75);
	}

	.focus-card.trend-up {
		border-left: 4px solid rgba(56, 189, 149, 0.85);
	}

	.focus-card.trend-down {
		border-left: 4px solid rgba(239, 68, 97, 0.85);
	}

	.focus-time {
		font-size: 0.78rem;
		color: var(--c-text-primary);
		font-weight: 600;
		text-transform: uppercase;
	}

	.focus-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 2px 10px;
		font-size: 0.75rem;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.12);
		color: var(--c-text-primary);
		font-weight: 600;
	}

	.focus-title {
		font-size: 0.9rem;
		color: var(--c-text-primary);
	}

	.focus-trend {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--c-text-primary);
	}

	.dashboard-section {
		display: grid;
		gap: 20px;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.6rem;
		letter-spacing: 0.02em;
	}

	.section-header p {
		margin: 6px 0 0;
		color: var(--c-text-muted);
		font-size: 0.92rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 16px;
	}

	.metric-card {
		display: grid;
		gap: 12px;
		padding: 18px 20px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		transition: all 0.2s ease;
	}

	.metric-card:hover {
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
	}

	.metric-card header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.82rem;
		color: var(--c-text-muted);
	}

	.metric-body {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 12px;
	}

	.metric-body strong {
		font-size: 1.4rem;
		color: var(--c-text-primary);
	}

	.metric-change {
		font-size: 0.85rem;
		font-weight: 700;
		padding: 4px 10px;
		border-radius: 4px;
		background: var(--c-bg-700);
	}

	.metric-card.trend-up .metric-change {
		color: #4ade80;
	}

	.metric-card.trend-down .metric-change {
		color: #f87171;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 16px;
	}

	.category-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px;
		border-radius: var(--radius-md);
		text-decoration: none;
		color: inherit;
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		transition: all 0.2s ease;
	}

	.category-card:hover {
		transform: translateY(-3px);
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
	}

	.category-icon {
		width: 52px;
		height: 52px;
		border-radius: var(--radius-md);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--c-bg-700);
		font-size: 1.6rem;
	}

	.category-body strong {
		display: block;
		font-size: 1.05rem;
		margin-bottom: 6px;
	}

	.category-body p {
		margin: 0;
		font-size: 0.88rem;
		color: var(--c-text-muted);
		line-height: 1.45;
	}

	.events-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}

	.event-card {
		display: grid;
		gap: 12px;
		padding: 20px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
	}

	.event-card header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.event-header {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.event-flag {
		font-size: 1.6rem;
	}

	.event-header strong {
		display: block;
		font-size: 1rem;
	}

	.event-meta {
		display: block;
		font-size: 0.8rem;
		color: var(--c-text-muted);
		margin-top: 4px;
	}

	.event-date {
		font-size: 0.82rem;
		color: var(--c-text-muted);
	}

	.event-card p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--c-text-secondary);
	}

	.event-card footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	.event-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 10px;
		border-radius: 4px;
		font-weight: 600;
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.event-badge.importance-high {
		background: rgba(94, 36, 62, 0.8);
		color: rgba(255, 196, 220, 0.9);
	}

	.event-badge.importance-medium {
		background: rgba(96, 72, 34, 0.8);
		color: rgba(255, 230, 190, 0.9);
	}

	.event-badge.importance-low {
		background: rgba(48, 72, 96, 0.8);
		color: rgba(210, 226, 255, 0.9);
	}

	.empty-copy {
		margin: 0;
		padding: 32px;
		text-align: center;
		font-size: 0.95rem;
		color: var(--c-text-muted);
		background: var(--c-bg-900);
		border: 1px dashed var(--c-bg-700);
		border-radius: var(--radius-md);
	}

	.community-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 16px;
	}

	.community-card {
		display: flex;
		gap: 16px;
		padding: 20px;
		border-radius: var(--radius-md);
		background: var(--c-bg-900);
		border: 1px solid var(--c-bg-700);
		transition: all 0.2s ease;
	}

	.community-card:hover {
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.12);
		background: var(--c-bg-700);
	}

	.community-icon {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-md);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--c-bg-700);
		font-size: 1.5rem;
	}

	.community-body strong {
		display: block;
		font-size: 1.05rem;
		margin-bottom: 4px;
	}

	.community-body p {
		margin: 0;
		font-size: 0.88rem;
		color: var(--c-text-muted);
		line-height: 1.5;
	}

	.community-meta {
		display: flex;
		gap: 12px;
		margin-top: 12px;
		font-size: 0.78rem;
		color: var(--c-text-muted);
	}

	@media (max-width: 720px) {
		.general-dashboard {
			padding: 24px 20px 48px;
			gap: 36px;
		}

		.dashboard-header {
			padding: 24px;
			gap: 24px;
		}

		.metrics-grid,
		.events-grid,
		.community-grid,
		.category-grid {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
</style>
