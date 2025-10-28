<script lang="ts">
	import AssetTreemap from '$lib/components/AssetTreemap.svelte';
	import {
		assetGroupMap,
		assetGroups,
		type AssetGroup,
		type AssetGroupId
	} from '$lib/data/asset-map';

	export let initialGroupId: AssetGroupId = assetGroups[0]?.id ?? 'domestic';
	export let mapHeight = 560;

	let selectedGroupId: AssetGroupId = initialGroupId;

	$: selectedGroup =
		(assetGroupMap.get(selectedGroupId) as AssetGroup | undefined) ?? assetGroups[0];

	const handleSelect = (groupId: AssetGroupId) => {
		if (!assetGroupMap.has(groupId)) return;
		selectedGroupId = groupId;
	};
</script>

<section class="asset-map">
	<header class="asset-map__header">
		<div>
			<h1>자산군 맵</h1>
			<p>섹터별 시가총액 규모와 변동률을 한눈에 비교해보세요.</p>
		</div>
		<div class="pill-group" role="tablist" aria-label="자산군 선택">
			{#each assetGroups as group}
				<button
					type="button"
					role="tab"
					class="pill"
					class:active={selectedGroupId === group.id}
					on:click={() => handleSelect(group.id)}
					aria-selected={selectedGroupId === group.id}
				>
					<span class="pill__label">{group.label}</span>
					<small>{group.description}</small>
				</button>
			{/each}
		</div>
	</header>

	{#if selectedGroup}
		<div class="asset-map__meta">
			<span class="meta-label">{selectedGroup.label}</span>
			<p>{selectedGroup.description}</p>
			<span class="meta-hint">최근 변동률 기준 | 실시간 데이터는 추후 연결 예정</span>
		</div>
		<div class="asset-map__chart">
			<AssetTreemap data={selectedGroup.tree} height={mapHeight} />
		</div>
	{:else}
		<div class="asset-map__empty">
			<p>선택한 자산군 데이터를 불러오지 못했습니다.</p>
		</div>
	{/if}
</section>

<style>
	.asset-map {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2.5rem;
		background: var(--c-bg-800);
		border-radius: 32px;
		border: 1px solid var(--c-border-soft);
		backdrop-filter: blur(20px);
		box-shadow: 0 24px 64px var(--c-bg-900);
	}

	.asset-map__header {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.asset-map__header h1 {
		font-size: 1.9rem;
		font-weight: 700;
		margin-bottom: 0.4rem;
	}

	.asset-map__header p {
		color: var(--c-text-secondary);
		font-size: 0.95rem;
	}

	.pill-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.pill {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
		padding: 0.9rem 1.2rem;
		border-radius: 999px;
		border: 1px solid var(--c-border-soft);
		background: var(--c-bg-700);
		color: var(--c-text-primary);
		transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
		cursor: pointer;
		font-size: 0.95rem;
		min-width: 180px;
	}

	.pill small {
		font-size: 0.75rem;
		color: var(--c-text-muted);
		letter-spacing: 0.01em;
	}

	.pill.active {
		background: var(--c-surface-hover);
		color: var(--c-text-primary);
		border-color: var(--c-border-hover);
		box-shadow: 0 12px 32px var(--c-overlay-strong);
		transform: translateY(-2px);
	}

	.pill:not(.active):hover {
		background: var(--c-surface-hover);
		border-color: var(--c-border-hover);
	}

	.asset-map__meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem 1.5rem;
		border-radius: 16px;
		background: var(--c-bg-700);
		border: 1px solid var(--c-border-soft);
		color: var(--c-text-primary);
		font-size: 0.9rem;
	}

	.asset-map__meta .meta-label {
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: var(--c-text-primary);
	}

	.asset-map__meta .meta-hint {
		color: var(--c-text-muted);
		font-size: 0.75rem;
	}

	.asset-map__chart {
		width: 100%;
		min-height: 360px;
		border-radius: 24px;
		overflow: hidden;
		background: var(--c-bg-700);
		border: 1px solid var(--c-border-soft);
	}

	.asset-map__empty {
		padding: 4rem 2rem;
		border-radius: 16px;
		text-align: center;
		background: var(--c-bg-700);
		border: 1px dashed var(--c-border-strong);
		color: var(--c-text-muted);
	}

	/* 반응형 브레이크포인트 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		.asset-map {
			padding: 3rem;
		}
		
		.asset-map__header h1 {
			font-size: 2.5rem;
		}
		
		.asset-map__chart {
			min-height: 420px;
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.asset-map {
			padding: 2.5rem;
		}
		
		.asset-map__chart {
			min-height: 400px;
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.asset-map {
			padding: 2rem;
		}
		
		.asset-map__header h1 {
			font-size: 2rem;
		}
		
		.asset-map__chart {
			min-height: 380px;
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.asset-map {
			padding: 1.75rem;
		}
		
		.asset-map__header h1 {
			font-size: 1.75rem;
		}
		
		.asset-map__chart {
			min-height: 360px;
		}
		
		.pill {
			min-width: 160px;
			width: calc(50% - 0.5rem);
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		.asset-map {
			padding: 1.5rem;
			border-radius: 20px;
		}
		
		.asset-map__header h1 {
			font-size: 1.5rem;
		}
		
		.asset-map__chart {
			min-height: 320px;
		}
		
		.pill {
			width: 100%;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.asset-map {
			padding: 1.25rem;
			border-radius: 16px;
		}
		
		.asset-map__header h1 {
			font-size: 1.25rem;
		}
		
		.asset-map__chart {
			min-height: 280px;
		}
		
		.pill {
			width: 100%;
			padding: 0.75rem 1rem;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.asset-map {
			padding: 1rem;
			border-radius: 12px;
		}
		
		.asset-map__header h1 {
			font-size: 1.125rem;
		}
		
		.asset-map__chart {
			min-height: 240px;
		}
		
		.pill {
			width: 100%;
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.pill {
			min-height: 44px;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.asset-map__header h1 {
			font-weight: 800;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		.asset-map {
			background: var(--c-bg-800);
		}
	}
</style>
