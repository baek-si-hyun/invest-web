<script setup lang="ts">
import { computed, ref } from 'vue'
import { trendingPeople, type TrendingPerson } from '@/data/trendingPeople'

type IndustryId = 'all' | TrendingPerson['industry']
type TrendFilter = 'all' | TrendingPerson['trend']

const industryOrder = Array.from(new Set(trendingPeople.map((person) => person.industry)))

const industryTabs: Array<{ id: IndustryId; label: string }> = [
  { id: 'all', label: '전체' },
  ...industryOrder.map((industry) => ({ id: industry as IndustryId, label: industry }))
]

const trendTabs: Array<{ id: TrendFilter; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'up', label: '상승세' },
  { id: 'stable', label: '안정세' },
  { id: 'down', label: '하락세' }
]

const INDUSTRY_ACCENTS: Record<string, string> = {
  '자동차/에너지': '#f97316',
  '반도체/AI': '#6366f1',
  '테크': '#8b5cf6',
  '클라우드/AI': '#06b6d4',
  'AI/검색': '#10b981',
  '클라우드/이커머스': '#f59e0b',
  '소셜/메타버스': '#ec4899',
  '스트리밍/엔터테인먼트': '#ef4444',
  '암호화폐/핀테크': '#84cc16',
  '이커머스/클라우드': '#f97316',
  '반도체': '#3b82f6'
}

const DEFAULT_ACCENT = '#6366f1'

const activeIndustry = ref<IndustryId>('all')
const activeTrend = ref<TrendFilter>('all')
const selectedPersonId = ref<string | null>(null)

const filteredPeople = computed(() => {
  let filtered = trendingPeople

  if (activeIndustry.value !== 'all') {
    filtered = filtered.filter((person) => person.industry === activeIndustry.value)
  }

  if (activeTrend.value !== 'all') {
    filtered = filtered.filter((person) => person.trend === activeTrend.value)
  }

  return filtered
})

const activePerson = computed(() =>
  selectedPersonId.value
    ? trendingPeople.find((person) => person.id === selectedPersonId.value) ?? null
    : null
)

const feedHeadline = computed(() =>
  activePerson.value ? `${activePerson.value.name} 프로필` : '요즘 핫한 인물들'
)

const feedDescription = computed(() =>
  activePerson.value
    ? `${activePerson.value.name}의 최신 동향과 소셜미디어 활동을 확인하세요.`
    : '투자 시장을 움직이는 핵심 인물들의 최신 동향을 모았습니다.'
)

const feedCountLabel = computed(() =>
  activePerson.value
    ? `${activePerson.value.name} 관련 정보`
    : `총 ${filteredPeople.value.length}명의 트렌딩 인물`
)

const selectIndustry = (industryId: IndustryId) => {
  activeIndustry.value = industryId
  selectedPersonId.value = null
}

const selectTrend = (trendId: TrendFilter) => {
  activeTrend.value = trendId
  selectedPersonId.value = null
}

const selectPerson = (personId: string) => {
  if (selectedPersonId.value === personId) {
    selectedPersonId.value = null
    return
  }
  selectedPersonId.value = personId
  const person = trendingPeople.find((entry) => entry.id === personId)
  if (person) {
    activeIndustry.value = person.industry as IndustryId
  }
}

const getTrendIcon = (trend: TrendingPerson['trend']) => {
  switch (trend) {
    case 'up':
      return '📈'
    case 'down':
      return '📉'
    case 'stable':
      return '➡️'
    default:
      return '📊'
  }
}

const getTrendColor = (trend: TrendingPerson['trend']) => {
  switch (trend) {
    case 'up':
      return '#10b981'
    case 'down':
      return '#ef4444'
    case 'stable':
      return '#6b7280'
    default:
      return '#6366f1'
  }
}
</script>

<template>
  <section class="trending-people">
    <header class="feed-header">
      <div class="feed-copy">
        <h1>{{ feedHeadline }}</h1>
        <p>{{ feedDescription }}</p>
      </div>
      <div class="feed-meta">
        <span class="meta-chip">{{ feedCountLabel }}</span>
        <span class="meta-chip meta-chip--notice">※ 실시간 소셜미디어 데이터 기반</span>
      </div>
    </header>

    <div class="filter-tabs">
      <nav class="industry-tabs" aria-label="산업 필터">
        <button
          v-for="tab in industryTabs"
          :key="tab.id"
          type="button"
          :class="{ active: activeIndustry === tab.id }"
          @click="selectIndustry(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <nav class="trend-tabs" aria-label="트렌드 필터">
        <button
          v-for="tab in trendTabs"
          :key="tab.id"
          type="button"
          :class="{ active: activeTrend === tab.id }"
          @click="selectTrend(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <p class="feed-disclaimer">
      투자 시장에 영향을 미치는 핵심 인물들의 최신 동향과 소셜미디어 활동을 실시간으로 추적합니다.
    </p>

    <div class="feed-body">
      <aside class="people-sidebar">
        <h2>인물 목록</h2>
        <ul>
          <li v-for="person in filteredPeople" :key="person.id">
            <button
              type="button"
              :class="{ selected: selectedPersonId === person.id }"
              @click="selectPerson(person.id)"
            >
              <img :src="person.avatar" :alt="`${person.name} 프로필`" class="person-avatar" />
              <div class="person-meta">
                <strong>{{ person.name }}</strong>
                <span>{{ person.company }} · {{ person.title }}</span>
                <div class="person-trend">
                  <span class="trend-icon">{{ getTrendIcon(person.trend) }}</span>
                  <span 
                    class="trend-value" 
                    :style="{ color: getTrendColor(person.trend) }"
                  >
                    {{ person.trendValue }}
                  </span>
                </div>
              </div>
            </button>
          </li>
        </ul>
      </aside>

      <div class="feed-content" aria-live="polite">
        <div v-if="filteredPeople.length === 0" class="empty">
          <p>선택한 조건에 맞는 인물이 없습니다.</p>
        </div>
        <div v-else-if="activePerson" class="person-detail">
          <div class="detail-header">
            <img :src="activePerson.avatar" :alt="`${activePerson.name} 프로필`" class="detail-avatar" />
            <div class="detail-info">
              <h2>{{ activePerson.name }}</h2>
              <p class="detail-title">{{ activePerson.title }} · {{ activePerson.company }}</p>
              <p class="detail-industry">{{ activePerson.industry }}</p>
              <div class="detail-trend">
                <span class="trend-icon">{{ getTrendIcon(activePerson.trend) }}</span>
                <span 
                  class="trend-value" 
                  :style="{ color: getTrendColor(activePerson.trend) }"
                >
                  {{ activePerson.trendValue }}
                </span>
                <span class="last-updated">{{ activePerson.lastUpdated }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-content">
            <div class="detail-section">
              <h3>소개</h3>
              <p>{{ activePerson.description }}</p>
            </div>
            
            <div class="detail-section">
              <h3>최신 소식</h3>
              <p>{{ activePerson.recentNews }}</p>
            </div>
            
            <div class="detail-section">
              <h3>소셜미디어</h3>
              <div class="social-media-list">
                <div 
                  v-for="social in activePerson.socialMedia" 
                  :key="social.platform"
                  class="social-item"
                >
                  <span class="social-platform">{{ social.platform }}</span>
                  <div class="social-stats">
                    <span class="followers">{{ social.followers }} 팔로워</span>
                    <span class="engagement">{{ social.engagement }} 참여도</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="people-grid">
          <article 
            v-for="person in filteredPeople" 
            :key="person.id" 
            class="person-card"
            :style="{ '--accent': INDUSTRY_ACCENTS[person.industry] ?? DEFAULT_ACCENT }"
            @click="selectPerson(person.id)"
          >
            <header class="card-header">
              <img :src="person.avatar" :alt="`${person.name} 프로필`" class="card-avatar" />
              <div class="card-meta">
                <span class="industry-badge" :style="{ background: INDUSTRY_ACCENTS[person.industry] ?? DEFAULT_ACCENT }">
                  {{ person.industry }}
                </span>
                <div class="trend-info">
                  <span class="trend-icon">{{ getTrendIcon(person.trend) }}</span>
                  <span 
                    class="trend-value" 
                    :style="{ color: getTrendColor(person.trend) }"
                  >
                    {{ person.trendValue }}
                  </span>
                </div>
              </div>
            </header>
            <div class="card-content">
              <h3>{{ person.name }}</h3>
              <p class="person-title">{{ person.title }} · {{ person.company }}</p>
              <p class="description">{{ person.description }}</p>
              <p class="recent-news">{{ person.recentNews }}</p>
            </div>
            <footer class="card-footer">
              <span class="last-updated">{{ person.lastUpdated }}</span>
              <div class="social-preview">
                <span 
                  v-for="social in person.socialMedia.slice(0, 2)" 
                  :key="social.platform"
                  class="social-platform"
                >
                  {{ social.platform }}
                </span>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trending-people {
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

.filter-tabs {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.industry-tabs,
.trend-tabs {
  display: inline-flex;
  gap: 10px;
  background: var(--c-bg-900);
  padding: 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-strong);
  width: fit-content;
}

.industry-tabs button,
.trend-tabs button {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  padding: 7px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.industry-tabs button:hover,
.trend-tabs button:hover {
  color: var(--c-text-primary);
  background: var(--c-surface-hover);
}

.industry-tabs button.active,
.trend-tabs button.active {
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
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  gap: 28px;
  align-items: stretch;
  min-height: 0;
}

.people-sidebar {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 14px;
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-md);
  padding: 20px 18px;
  min-height: 0;
  max-height: clamp(400px, 70vh, 600px);
  overflow: hidden;
}

.people-sidebar h2 {
  margin: 0;
  font-size: 0.96rem;
  color: var(--c-text-primary);
  letter-spacing: 0.01em;
}

.people-sidebar ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border-soft) transparent;
}

.people-sidebar ul::-webkit-scrollbar {
  width: 8px;
}

.people-sidebar ul::-webkit-scrollbar-track {
  background: transparent;
}

.people-sidebar ul::-webkit-scrollbar-thumb {
  background: var(--c-border-soft);
  border-radius: 999px;
}

.people-sidebar ul::-webkit-scrollbar-thumb:hover {
  background: var(--c-border-hover);
}

.people-sidebar button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-900);
  color: var(--c-text-secondary);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.people-sidebar button:hover,
.people-sidebar button.selected {
  border-color: var(--c-border-hover);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.person-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px var(--c-overlay-soft);
}

.person-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.person-meta strong {
  font-size: 0.88rem;
  color: var(--c-text-primary);
}

.person-meta span {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.person-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.trend-icon {
  font-size: 0.8rem;
}

.trend-value {
  font-size: 0.75rem;
  font-weight: 600;
}

.feed-content {
  display: grid;
  gap: 22px;
  max-height: clamp(500px, 70vh, 700px);
  min-height: 0;
  overflow: hidden;
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

.person-detail {
  display: grid;
  gap: 24px;
  padding: 24px;
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-md);
}

.detail-header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 24px var(--c-overlay-soft);
}

.detail-info h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  color: var(--c-text-primary);
}

.detail-title {
  margin: 0 0 4px;
  font-size: 1rem;
  color: var(--c-text-secondary);
}

.detail-industry {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: var(--c-text-muted);
}

.detail-trend {
  display: flex;
  align-items: center;
  gap: 8px;
}

.last-updated {
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.detail-content {
  display: grid;
  gap: 20px;
}

.detail-section h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  color: var(--c-text-primary);
}

.detail-section p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
}

.social-media-list {
  display: grid;
  gap: 12px;
}

.social-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--c-bg-800);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-sm);
}

.social-platform {
  font-size: 0.85rem;
  color: var(--c-text-primary);
  font-weight: 500;
}

.social-stats {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--c-border-soft) transparent;
  max-height: inherit;
  height: 100%;
  min-height: 0;
}

.people-grid::-webkit-scrollbar {
  width: 8px;
}

.people-grid::-webkit-scrollbar-track {
  background: transparent;
}

.people-grid::-webkit-scrollbar-thumb {
  background: var(--c-border-soft);
  border-radius: 999px;
}

.people-grid::-webkit-scrollbar-thumb:hover {
  background: var(--c-border-hover);
}

.person-card {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: var(--radius-md);
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.person-card:hover {
  border-color: var(--c-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--c-overlay-strong);
}

.person-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid transparent;
  background: linear-gradient(var(--accent), transparent) border-box;
  mask:
    linear-gradient(var(--c-text-primary), var(--c-text-primary)),
    linear-gradient(var(--c-text-primary), var(--c-text-primary));
  mask-composite: exclude;
  -webkit-mask:
    linear-gradient(var(--c-text-primary), var(--c-text-primary)),
    linear-gradient(var(--c-text-primary), var(--c-text-primary));
  -webkit-mask-composite: xor;
  opacity: 0.3;
}

.card-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.card-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px var(--c-overlay-soft);
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.industry-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-text-primary);
  width: fit-content;
}

.trend-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-content {
  display: grid;
  gap: 12px;
}

.card-content h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--c-text-primary);
}

.person-title {
  margin: 0;
  font-size: 0.9rem;
  color: var(--c-text-secondary);
}

.description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.recent-news {
  margin: 0;
  font-size: 0.8rem;
  color: var(--c-text-muted);
  line-height: 1.4;
  font-style: italic;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--c-border-strong);
}

.social-preview {
  display: flex;
  gap: 8px;
}

.social-preview .social-platform {
  font-size: 0.75rem;
  color: var(--c-text-muted);
  background: var(--c-bg-800);
  padding: 2px 8px;
  border-radius: 4px;
}

@media (max-width: 1023px) and (min-width: 768px) {
  .trending-people {
    padding: 28px;
  }

  .feed-body {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .people-sidebar {
    order: 2;
  }

  .feed-content {
    order: 1;
    max-height: none;
  }

  .people-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .trending-people {
    padding: 24px 20px;
    border-radius: 16px;
  }

  .feed-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .people-sidebar {
    order: 2;
  }

  .feed-content {
    order: 1;
    max-height: none;
  }

  .people-grid {
    grid-template-columns: 1fr;
  }

  .person-card {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .trending-people {
    padding: 20px 16px;
    border-radius: 12px;
  }

  .filter-tabs {
    flex-direction: column;
    gap: 12px;
  }

  .feed-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .people-sidebar {
    order: 2;
  }

  .feed-content {
    order: 1;
    max-height: none;
  }

  .people-grid {
    grid-template-columns: 1fr;
  }

  .person-card {
    padding: 14px;
  }
}

@media (max-width: 479px) {
  .trending-people {
    padding: 16px 12px;
    border-radius: 8px;
  }

  .filter-tabs {
    flex-direction: column;
    gap: 8px;
  }

  .feed-body {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .people-sidebar {
    order: 2;
  }

  .feed-content {
    order: 1;
    max-height: none;
  }

  .people-grid {
    grid-template-columns: 1fr;
  }

  .person-card {
    padding: 12px;
  }
}
</style>

