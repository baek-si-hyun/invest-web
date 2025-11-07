<script setup lang="ts">
import { computed, ref } from 'vue'
import { socialPlatforms, type SocialPost } from '@/data/social'

type PlatformId = (typeof socialPlatforms)[number]['id']
type PlatformTab = { id: 'all' | PlatformId; label: string }

const platformTabs: PlatformTab[] = [
  { id: 'all', label: '전체' },
  ...socialPlatforms.map((platform) => ({ id: platform.id, label: platform.label }))
]

const PLATFORM_ACCENTS: Record<PlatformId, string> = {
  x: '#38bdf8',
  facebook: '#22c55e'
}

const DEFAULT_ACCENT = '#818cf8'

const deriveFigureKey = (handle: string) => handle.trim().toLowerCase()

type FeedPost = SocialPost & {
  platformId: PlatformId
  accent: string
  figureKey: string
}

const allPosts: FeedPost[] = socialPlatforms.flatMap((platform) =>
  platform.posts.map((post) => ({
    ...post,
    platformId: platform.id,
    accent: PLATFORM_ACCENTS[platform.id] ?? DEFAULT_ACCENT,
    figureKey: deriveFigureKey(post.handle)
  }))
)

type HotFigure = {
  id: string
  name: string
  handle: string
  avatar: string
  platform: PlatformId
  accent: string
}

const hotFigures: HotFigure[] = (() => {
  const figures = new Map<string, HotFigure>()
  for (const post of allPosts) {
    if (figures.has(post.figureKey)) continue
    figures.set(post.figureKey, {
      id: post.figureKey,
      name: post.nickname,
      handle: post.handle,
      avatar: post.avatar,
      platform: post.platformId,
      accent: post.accent
    })
  }
  return Array.from(figures.values())
})()

const activeTab = ref<'all' | PlatformId>('all')
const selectedFigureId = ref<string | null>(null)

const filteredPosts = computed(() => {
  const platformFiltered =
    activeTab.value === 'all'
      ? allPosts
      : allPosts.filter((post) => post.platformId === activeTab.value)
  if (selectedFigureId.value) {
    return platformFiltered.filter((post) => post.figureKey === selectedFigureId.value)
  }
  return platformFiltered
})

const activeFigure = computed(() => {
  if (!selectedFigureId.value) return null
  return hotFigures.find((figure) => figure.id === selectedFigureId.value) ?? null
})

const resolvePlatformLabel = (id: 'all' | PlatformId) => {
  if (id === 'all') return '전체'
  return platformTabs.find((tab) => tab.id === id)?.label ?? '선택한 플랫폼'
}

const feedHeadline = computed(() =>
  activeFigure.value ? `${activeFigure.value.name} 인사이트` : '실시간 SNS 브리핑'
)

const feedDescription = computed(() =>
  activeFigure.value
    ? `${activeFigure.value.name}의 최신 게시물을 한 번에 확인하세요.`
    : '트위터(X)와 페이스북 유명 인사의 최신 게시물을 한눈에 요약했습니다.'
)

const feedCountLabel = computed(() =>
  activeFigure.value
    ? `${activeFigure.value.name} 게시물 ${filteredPosts.value.length}건`
    : `${resolvePlatformLabel(activeTab.value)} 게시물 ${filteredPosts.value.length}건`
)

const selectPlatform = (platformId: 'all' | PlatformId) => {
  activeTab.value = platformId
  selectedFigureId.value = null
}

const selectFigure = (figure: HotFigure) => {
  if (selectedFigureId.value === figure.id) {
    selectedFigureId.value = null
    return
  }
  selectedFigureId.value = figure.id
  activeTab.value = figure.platform
}
</script>

<template>
  <section class="sns-feed">
    <header class="feed-header">
      <div class="feed-copy">
        <h1>{{ feedHeadline }}</h1>
        <p>{{ feedDescription }}</p>
      </div>
      <div class="feed-meta">
        <span class="meta-chip">{{ feedCountLabel }}</span>
        <span class="meta-chip meta-chip--notice">※ 공식 계정 게시물 기반 큐레이션</span>
      </div>
    </header>

    <nav class="platform-tabs" aria-label="플랫폼 필터">
      <button
        v-for="tab in platformTabs"
        :key="tab.id"
        type="button"
        :class="{ active: activeTab === tab.id }"
        @click="selectPlatform(tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <p class="feed-disclaimer">
      Invest Hub이 공식 계정 게시물을 모니터링해 키 포인트만 요약합니다. 실시간 데이터 동기화는 베타 단계입니다.
    </p>

    <div class="feed-body">
      <aside class="hot-sidebar">
        <h2>요즘 핫한 인물들</h2>
        <ul>
          <li v-for="figure in hotFigures" :key="figure.id">
            <button
              type="button"
              :class="{ selected: selectedFigureId === figure.id }"
              @click="selectFigure(figure)"
            >
              <span class="platform-dot" :style="{ '--accent': figure.accent }">
                <svg v-if="figure.platform === 'x'" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M18.9 3H21l-6.44 7.37L21.77 21h-5.68l-4.06-5.3L7.1 21H3l6.82-7.81L2.23 3h5.74l3.7 4.89L18.9 3Zm-1.99 16h1.1L7.24 4h-1.2Z"
                  />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5A3.5 3.5 0 0 1 14.3 6h3v3h-3c-.28 0-.5.22-.5.5V12H17l-.5 3h-2.7v7A10 10 0 0 0 22 12Z"
                  />
                </svg>
              </span>
              <div class="figure-meta">
                <strong>{{ figure.name }}</strong>
                <span>{{ figure.handle }}</span>
              </div>
            </button>
          </li>
        </ul>
      </aside>

      <div class="feed-content" aria-live="polite">
        <div v-if="filteredPosts.length === 0" class="empty">
          <p>선택한 플랫폼에서 표시할 게시물이 없습니다.</p>
        </div>
        <div v-else class="feed-scroll">
          <div class="feed-grid">
            <article
              v-for="post in filteredPosts"
              :key="post.id"
              :class="['feed-card', `platform-${post.platform}`]"
              :style="{ '--accent': post.accent }"
            >
              <header class="card-header">
                <img :src="post.avatar" :alt="`${post.nickname} 프로필`" loading="lazy" />
                <div class="card-profile">
                  <strong>{{ post.nickname }}</strong>
                  <span class="handle">{{ post.handle }}</span>
                </div>
                <span class="platform-label">{{ post.platformLabel }}</span>
              </header>
              <p class="card-content">{{ post.content }}</p>
              <footer class="card-footer">
                <div class="card-meta">
                  <span>{{ post.timeAgo }}</span>
                  <a v-if="post.url" :href="post.url" rel="noopener" target="_blank">원문 보기</a>
                </div>
                <ul v-if="post.reactions" class="card-reactions">
                  <li>👍 {{ post.reactions.likes.toLocaleString('ko-KR') }}</li>
                  <li>💬 {{ post.reactions.comments.toLocaleString('ko-KR') }}</li>
                  <li>↗ {{ post.reactions.shares.toLocaleString('ko-KR') }}</li>
                </ul>
                <p class="card-detail">{{ post.detail }}</p>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  scrollbar-color: rgba(120, 138, 188, 0.55) transparent;
}

.hot-sidebar ul::-webkit-scrollbar {
  width: 8px;
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
  background: var(--accent, #3b82f6);
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

.feed-card {
  display: grid;
  gap: 12px;
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
  mask: linear-gradient(var(--c-text-primary), var(--c-text-primary)),
    linear-gradient(var(--c-text-primary), var(--c-text-primary));
  mask-composite: exclude;
  -webkit-mask: linear-gradient(var(--c-text-primary), var(--c-text-primary)),
    linear-gradient(var(--c-text-primary), var(--c-text-primary));
  -webkit-mask-composite: xor;
  opacity: 0.3;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.card-header img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
}

.card-profile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-profile strong {
  font-size: 0.95rem;
  color: var(--c-text-primary);
}

.handle {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.platform-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent);
  color: var(--c-bg-900);
  font-size: 0.72rem;
  font-weight: 600;
}

.card-content {
  margin: 0;
  font-size: 0.95rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
  white-space: pre-line;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.card-meta a {
  color: var(--c-link);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.card-meta a:hover {
  border-color: var(--c-link);
}

.card-reactions {
  display: flex;
  gap: 12px;
  font-size: 0.78rem;
  color: var(--c-text-muted);
  list-style: none;
  margin: 0;
  padding: 0;
}

.card-detail {
  margin: 0;
  font-size: 0.88rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
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

  .card-meta,
  .card-reactions {
    font-size: 0.75rem;
  }

  .card-detail {
    font-size: 0.85rem;
  }
}

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

  .card-meta,
  .card-reactions {
    font-size: 0.75rem;
  }

  .card-detail {
    font-size: 0.82rem;
  }
}

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

  .card-meta,
  .card-reactions {
    font-size: 0.7rem;
  }

  .card-detail {
    font-size: 0.8rem;
  }
}

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

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .sns-feed h2 {
    font-weight: 700;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .card-footer {
    gap: 8px;
  }
}

@media (prefers-color-scheme: dark) {
  .sns-feed {
    background: var(--c-bg-800);
  }
}
</style>
