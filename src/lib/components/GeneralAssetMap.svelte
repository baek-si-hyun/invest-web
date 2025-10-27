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
		background: var(--surface-elevated, rgba(15, 23, 42, 0.1));
		border-radius: 32px;
		border: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(20px);
		box-shadow: 0 24px 64px rgba(15, 23, 42, 0.3);
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
		color: rgba(248, 250, 252, 0.75);
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
		border: 1px solid rgba(148, 163, 184, 0.35);
		background: rgba(15, 23, 42, 0.25);
		color: #e2e8f0;
		transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
		cursor: pointer;
		font-size: 0.95rem;
		min-width: 180px;
	}

	.pill small {
		font-size: 0.75rem;
		color: rgba(226, 232, 240, 0.7);
		letter-spacing: 0.01em;
	}

	.pill.active {
		background: rgba(47, 202, 89, 0.15);
		color: #f8fafc;
		border-color: rgba(47, 202, 89, 0.65);
		box-shadow: 0 12px 32px rgba(47, 202, 89, 0.25);
		transform: translateY(-2px);
	}

	.pill:not(.active):hover {
		background: rgba(15, 23, 42, 0.45);
		border-color: rgba(148, 163, 184, 0.6);
	}

	.asset-map__meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1rem 1.5rem;
		border-radius: 16px;
		background: rgba(15, 23, 42, 0.35);
		border: 1px solid rgba(148, 163, 184, 0.2);
		color: #e2e8f0;
		font-size: 0.9rem;
	}

	.asset-map__meta .meta-label {
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: #f8fafc;
	}

	.asset-map__meta .meta-hint {
		color: rgba(148, 163, 184, 0.8);
		font-size: 0.75rem;
	}

	.asset-map__chart {
		width: 100%;
		min-height: 360px;
		border-radius: 24px;
		overflow: hidden;
		background: rgba(15, 23, 42, 0.15);
		border: 1px solid rgba(148, 163, 184, 0.2);
	}

	.asset-map__empty {
		padding: 4rem 2rem;
		border-radius: 16px;
		text-align: center;
		background: rgba(15, 23, 42, 0.25);
		border: 1px dashed rgba(148, 163, 184, 0.4);
		color: rgba(148, 163, 184, 0.9);
	}

	@media (max-width: 960px) {
		.asset-map {
			padding: 1.75rem;
		}

		.pill {
			min-width: 160px;
			width: calc(50% - 0.5rem);
		}
	}

	@media (max-width: 640px) {
		.asset-map {
			padding: 1.25rem;
			border-radius: 24px;
		}

		.asset-map__header h1 {
			font-size: 1.5rem;
		}

		.pill {
			width: 100%;
		}
	}
</style>
