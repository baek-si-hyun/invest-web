<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { categories } from '@/data/categories'
import { economicEvents } from '@/data/economicEvents'
import { communityBoards } from '@/data/community'
import {
  marketOverviewCards,
  todayEventSchedule,
  todayMarketIssues
} from '@/data/home'

const router = useRouter()

const formatTime = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit'
})

const formatDate = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long'
})

const now = new Date()
const currentTime = computed(() => formatTime.format(now))
const currentDate = computed(() => formatDate.format(now))

const upcomingEventDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  weekday: 'short'
})

const toEventDate = (event: (typeof economicEvents)[number]) => {
  const iso = `${event.date}T${event.time || '00:00'}`
  return new Date(iso)
}

const upcomingSource = economicEvents
  .filter((event) => toEventDate(event) >= now)
  .sort((a, b) => toEventDate(a).getTime() - toEventDate(b).getTime())

const fallbackSource = [...economicEvents].sort(
  (a, b) => toEventDate(a).getTime() - toEventDate(b).getTime()
)

const upcomingEvents = (upcomingSource.length ? upcomingSource : fallbackSource).slice(0, 5)

const formatUpcomingEventDate = (event: (typeof economicEvents)[number]) =>
  upcomingEventDateFormatter.format(toEventDate(event))
const formatUpcomingEventTime = (event: (typeof economicEvents)[number]) =>
  event.time + (event.timezone ? ` ${event.timezone}` : '')

const featuredBoards = communityBoards.slice(0, 4)

const todayEvents = todayEventSchedule.slice(0, 5)
const todayIssues = todayMarketIssues.slice(0, 5)

const withBase = (path: string) => {
  const base = router.options.history.base || ''
  return `${base}${path}`
}
</script>

<template>
  <div class="general-dashboard">
    <header class="dashboard-header">
      <div class="header-top">
        <div class="header-brand">
          <h1>Invest Hub</h1>
          <p>투자 정보를 한눈에</p>
        </div>
        <div class="header-clock" aria-label="현재 시각">
          <strong>{{ currentTime }}</strong>
          <span>{{ currentDate }}</span>
        </div>
      </div>

      <div class="header-panels">
        <section class="focus-panel">
          <h3>오늘의 중요 이벤트</h3>
          <ul class="focus-list">
            <li
              v-for="(event, index) in todayEvents"
              :key="`event-${index}`"
              :class="['focus-card', `impact-${event.impact}`]"
            >
              <span class="focus-time">{{ event.time }}</span>
              <span class="focus-title">{{ event.title }}</span>
            </li>
          </ul>
        </section>
        <section class="focus-panel">
          <h3>주요 시장 이슈</h3>
          <ul class="focus-list">
            <li
              v-for="(issue, index) in todayIssues"
              :key="`issue-${index}`"
              :class="['focus-card', `trend-${issue.trend}`]"
            >
              <span class="focus-chip">{{ issue.category }}</span>
              <span class="focus-title">{{ issue.title }}</span>
              <span class="focus-trend">{{ issue.trend === 'up' ? '↗' : '↘' }}</span>
            </li>
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
        <article
          v-for="item in marketOverviewCards"
          :key="item.symbol"
          :class="['metric-card', `trend-${item.trend}`]"
        >
          <header>
            <span class="metric-name">{{ item.name }}</span>
            <span class="metric-symbol">{{ item.symbol }}</span>
          </header>
          <div class="metric-body">
            <strong>{{ item.price }}</strong>
            <span class="metric-change">
              {{ item.trend === 'up' ? '+' : '' }}{{ item.change }}%
            </span>
          </div>
        </article>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-header">
        <h2>자산군</h2>
        <p>관심 있는 자산군을 선택해 세부 인사이트를 확인하세요.</p>
      </div>
      <div class="category-grid">
        <a
          v-for="category in categories"
          :key="category.slug"
          class="category-card"
          :href="withBase(`/${category.slug}/`)"
        >
          <span class="category-icon">{{ category.emoji }}</span>
          <div class="category-body">
            <strong>{{ category.name }}</strong>
            <p>{{ category.desc }}</p>
          </div>
        </a>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-header">
        <h2>경제 이벤트</h2>
        <p>다가오는 주요 일정을 미리 확인하고 대응 전략을 준비하세요.</p>
      </div>
      <div class="events-grid">
        <p v-if="upcomingEvents.length === 0" class="empty-copy">예정된 이벤트가 없습니다.</p>
        <article v-else v-for="event in upcomingEvents" :key="event.id" class="event-card">
          <header>
            <div class="event-header">
              <span class="event-flag">{{ event.flag }}</span>
              <div>
                <strong>{{ event.title }}</strong>
                <span class="event-meta">{{ event.country }} · {{ event.indicator }}</span>
              </div>
            </div>
            <span class="event-date"
              >{{ formatUpcomingEventDate(event) }} · {{ formatUpcomingEventTime(event) }}</span
            >
          </header>
          <p>{{ event.description }}</p>
          <footer>
            <span :class="['event-badge', `importance-${event.importance}`]">
              {{
                event.importance === 'high'
                  ? '중요'
                  : event.importance === 'medium'
                    ? '관심'
                    : '체크'
              }}
            </span>
            <span v-if="event.forecast" class="event-forecast">예상 {{ event.forecast }}</span>
            <span v-else-if="event.previous" class="event-forecast">이전 {{ event.previous }}</span>
          </footer>
        </article>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-header">
        <h2>커뮤니티</h2>
        <p>전문가와 트레이더들이 모여 인사이트를 공유하는 공간입니다.</p>
      </div>
      <div class="community-grid">
        <article v-for="board in featuredBoards" :key="board.slug" class="community-card">
          <div class="community-icon">{{ board.emoji }}</div>
          <div class="community-body">
            <strong>{{ board.title }}</strong>
            <p>{{ board.description }}</p>
            <div class="community-meta">
              <span>멤버 {{ board.metrics.members }}</span>
              <span>오늘 {{ board.metrics.postsToday }}개 글</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
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
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: 0 8px 24px var(--c-overlay-strong);
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
  border: 1px solid var(--c-border-strong);
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
  border: 1px solid var(--c-border-hover);
}

.focus-card.impact-high {
  border-left: 4px solid var(--c-link);
}

.focus-card.impact-medium {
  border-left: 4px solid var(--c-text-secondary);
}

.focus-card.impact-low {
  border-left: 4px solid var(--c-text-muted);
}

.focus-card.trend-up {
  border-left: 4px solid var(--c-link);
}

.focus-card.trend-down {
  border-left: 4px solid var(--c-text-muted);
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
  background: var(--c-overlay-strong);
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
  border: 1px solid var(--c-border-strong);
  transition: all 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  border-color: var(--c-border-hover);
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
  color: var(--c-link);
}

.metric-card.trend-down .metric-change {
  color: var(--c-text-muted);
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
  border: 1px solid var(--c-border-strong);
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-border-hover);
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
  border: 1px solid var(--c-border-strong);
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
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.event-badge.importance-medium {
  background: var(--c-bg-700);
  color: var(--c-text-secondary);
}

.event-badge.importance-low {
  background: var(--c-bg-700);
  color: var(--c-text-muted);
}

.event-forecast {
  font-size: 0.78rem;
  color: var(--c-text-secondary);
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
  border: 1px solid var(--c-border-strong);
  transition: all 0.2s ease;
}

.community-card:hover {
  transform: translateY(-2px);
  border-color: var(--c-border-hover);
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

/* 추가 반응형 브레이크포인트 */
/* Large Desktop: 1440px+ */
@media (min-width: 1440px) {
  .general-dashboard {
    padding: 40px;
  }

  .header-brand h1 {
    font-size: 2.2rem;
  }

  .header-brand p {
    font-size: 1.1rem;
  }
}

/* Desktop: 1200px - 1439px */
@media (max-width: 1439px) and (min-width: 1200px) {
  .general-dashboard {
    padding: 36px;
  }

  .header-brand h1 {
    font-size: 2rem;
  }

  .header-brand p {
    font-size: 1rem;
  }
}

/* Tablet Landscape: 1024px - 1199px */
@media (max-width: 1199px) and (min-width: 1024px) {
  .general-dashboard {
    padding: 32px;
  }

  .header-brand h1 {
    font-size: 1.8rem;
  }

  .header-brand p {
    font-size: 0.95rem;
  }

  .header-panels {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .community-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

/* Tablet Portrait: 768px - 1023px */
@media (max-width: 1023px) and (min-width: 768px) {
  .general-dashboard {
    padding: 28px;
  }

  .header-brand h1 {
    font-size: 1.6rem;
  }

  .header-brand p {
    font-size: 0.9rem;
  }

  .header-panels {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .community-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .focus-card {
    padding: 16px;
  }

  .metric-card {
    padding: 16px;
  }

  .category-card {
    padding: 16px;
  }

  .community-card {
    padding: 16px;
  }
}

/* Mobile Landscape: 640px - 767px */
@media (max-width: 767px) and (min-width: 640px) {
  .general-dashboard {
    padding: 24px 20px;
  }

  .header-brand h1 {
    font-size: 1.4rem;
  }

  .header-brand p {
    font-size: 0.85rem;
  }

  .header-panels {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  .community-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .focus-card {
    padding: 14px;
  }

  .metric-card {
    padding: 14px;
  }

  .category-card {
    padding: 14px;
  }

  .community-card {
    padding: 14px;
  }
}

/* Mobile Portrait: 480px - 639px */
@media (max-width: 639px) and (min-width: 480px) {
  .general-dashboard {
    padding: 20px 16px;
  }

  .header-brand h1 {
    font-size: 1.2rem;
  }

  .header-brand p {
    font-size: 0.8rem;
  }

  .header-panels {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }

  .community-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .focus-card {
    padding: 12px;
  }

  .metric-card {
    padding: 12px;
  }

  .category-card {
    padding: 12px;
  }

  .community-card {
    padding: 12px;
  }
}

/* Small Mobile: 320px - 479px */
@media (max-width: 479px) {
  .general-dashboard {
    padding: 16px 12px;
  }

  .header-brand h1 {
    font-size: 1.1rem;
  }

  .header-brand p {
    font-size: 0.75rem;
  }

  .header-panels {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .category-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .community-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .focus-card {
    padding: 10px;
  }

  .metric-card {
    padding: 10px;
  }

  .category-card {
    padding: 10px;
  }

  .community-card {
    padding: 10px;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .focus-card,
  .metric-card,
  .category-card,
  .community-card {
    min-height: 44px;
  }
}

/* 고해상도 디스플레이 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .general-dashboard {
    font-weight: 500;
  }
}
</style>

