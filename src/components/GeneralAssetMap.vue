<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AssetTreemap from '@/components/AssetTreemap.vue'
import { assetGroups, assetGroupMap, type AssetGroupId } from '@/data/asset-map'

const props = withDefaults(
  defineProps<{
    initialGroupId?: AssetGroupId
    mapHeight?: number
  }>(),
  {
    initialGroupId: assetGroups[0]?.id ?? 'domestic',
    mapHeight: 560
  }
)

const selectedGroupId = ref<AssetGroupId>(
  assetGroupMap.has(props.initialGroupId) ? props.initialGroupId : assetGroups[0]?.id ?? 'domestic'
)

const selectedGroup = computed(() => assetGroupMap.get(selectedGroupId.value) ?? assetGroups[0])
const mapHeight = computed(() => props.mapHeight)

watch(
  () => props.initialGroupId,
  (next) => {
    if (next && assetGroupMap.has(next)) {
      selectedGroupId.value = next
    }
  }
)
</script>

<template>
  <section class="asset-map">
    <header class="asset-map__header">
      <div>
        <h1>자산군 맵</h1>
        <p>섹터별 시가총액 규모와 변동률을 한눈에 비교해보세요.</p>
      </div>
      <div class="pill-group" role="tablist" aria-label="자산군 선택">
        <button
          v-for="group in assetGroups"
          :key="group.id"
          type="button"
          role="tab"
          class="pill"
          :class="{ active: selectedGroupId === group.id }"
          :aria-selected="selectedGroupId === group.id"
          @click="selectedGroupId = group.id"
        >
          <span class="pill__label">{{ group.label }}</span>
          <small>{{ group.description }}</small>
        </button>
      </div>
    </header>

    <div v-if="selectedGroup" class="asset-map__meta">
      <span class="meta-label">{{ selectedGroup?.label }}</span>
      <p>{{ selectedGroup?.description }}</p>
      <span class="meta-hint">최근 변동률 기준 | 실시간 데이터는 추후 연결 예정</span>
    </div>
    <div v-if="selectedGroup" class="asset-map__chart">
      <AssetTreemap :data="selectedGroup!.tree" :height="mapHeight" />
    </div>
    <div v-else class="asset-map__empty">
      <p>선택한 자산군 데이터를 불러오지 못했습니다.</p>
    </div>
  </section>
</template>

<style scoped>
.asset-map {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 36px;
  background: var(--c-bg-800);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-strong);
  box-shadow: 0 8px 24px var(--c-overlay-strong);
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
  border-radius: var(--radius-md);
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

@media (min-width: 1440px) {
  .asset-map__header h1 {
    font-size: 2.5rem;
  }

  .asset-map__chart {
    min-height: 420px;
  }
}

@media (max-width: 1439px) and (min-width: 1200px) {
  .asset-map__chart {
    min-height: 400px;
  }
}

@media (max-width: 1199px) and (min-width: 1024px) {
  .asset-map__header h1 {
    font-size: 2rem;
  }

  .asset-map__chart {
    min-height: 380px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .asset-map {
    padding: 28px;
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

@media (max-width: 767px) and (min-width: 640px) {
  .asset-map {
    padding: 24px;
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

@media (max-width: 639px) and (min-width: 480px) {
  .asset-map {
    padding: 20px;
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

@media (max-width: 479px) {
  .asset-map {
    padding: 16px;
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

@media (hover: none) and (pointer: coarse) {
  .pill {
    min-height: 44px;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .asset-map__header h1 {
    font-weight: 800;
  }
}

@media (prefers-color-scheme: dark) {
  .asset-map {
    background: var(--c-bg-800);
  }
}
</style>
