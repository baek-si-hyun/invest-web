<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import ChartWindow from '@/components/home/windows/ChartWindow.vue'
import InfoWindow from '@/components/home/windows/InfoWindow.vue'
import EconomicCalendar from '@/components/EconomicCalendar.vue'
import GeneralAssetMap from '@/components/GeneralAssetMap.vue'
import GeneralSNSFeed from '@/components/home/GeneralSNSFeed.vue'
import GeneralNewsFeed from '@/components/GeneralNewsFeed.vue'
import GeneralCommunity from '@/components/home/GeneralCommunity.vue'
import GeneralPlaceholder from '@/components/home/GeneralPlaceholder.vue'
import { instruments } from '@/data/instruments'
import { economicEvents as calendarEconomicEvents } from '@/data/economicEvents'
import { socialPlatforms, type SocialPlatform } from '@/data/social'
import { newsSources } from '@/data/news'
import { featuredCommunityPosts } from '@/data/community'
import type {
  SNSWindowState,
  NewsWindowState,
  CommunityWindowState
} from '@/types'
import { SECTIONS, DEFAULT_NAV_HEIGHT } from '@/constants'
import { useDataMaps } from '@/composables/useDataMaps'
import { useNavigation } from '@/composables/useNavigation'
import { useWindowManagement } from '@/composables/useWindowManagement'
import { useEventData } from '@/composables/useEventData'
import { useWindowItems } from '@/composables/useWindowItems'
import {
  formatEventDateLabel,
  formatEventTimeLabel,
  formatEventDateTimeLabel
} from '@/utils/formatters'
import { useTheme } from '@/stores/theme'

// Constants
const sections = SECTIONS

// Theme
const { theme, toggleTheme } = useTheme()

// Data maps
const {
  instrumentMap,
  snsPlatformMap,
  allPlatformIds,
  newsSourceMap,
  allNewsSourceIds,
  communityBoardMap,
  communityBoardsByActivity
} = useDataMaps()

const communityMenuBoards = computed(() => communityBoardsByActivity.value.slice(0, 6))
const communityPosts = featuredCommunityPosts
const communityMenuPosts = computed(() => communityPosts.slice(0, 3))

// Navigation
const {
  mode,
  hoveredSection,
  activeSection,
  generalSection,
  setMode,
  handleLogoClick,
  cancelHoverHide,
  scheduleHoverHide,
  handleNavClick,
  handleNavPointerEnter
} = useNavigation()

// Nav height tracking
const navRef = ref<HTMLElement | null>(null)
const navHeight = ref(DEFAULT_NAV_HEIGHT)
let navResizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (navRef.value) {
    navHeight.value = navRef.value.getBoundingClientRect().height
    navResizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        navHeight.value = entry.contentRect.height
      }
    })
    navResizeObserver.observe(navRef.value)
  }
})

onBeforeUnmount(() => {
  navResizeObserver?.disconnect()
  navResizeObserver = null
})

// Window management
const {
  windows,
  bringToFront,
  handleMove,
  handleResize,
  closeWindow,
  openChart,
  openEventsWindow,
  openSNSWindow,
  openNewsWindow,
  openCommunityWindow,
  openEventDetail,
  closeEventDetail,
  openSNSDetail,
  closeSNSDetail,
  openNewsDetail,
  closeNewsDetail,
  openCommunityDetail,
  closeCommunityDetail,
  setCommunityFilter
} = useWindowManagement(navHeight)

// Event data
const { economicEventsList, menuPreviewEvents, calendarEvents } = useEventData(
  calendarEconomicEvents
)

// Window items
const {
  getSNSWindowMeta,
  getNewsWindowMeta,
  getCommunityWindowMeta,
  getSNSDetail,
  getNewsDetail,
  getCommunityDetail
} = useWindowItems()

type PlatformId = SocialPlatform['id']

// Wrapper functions that use composable functions with proper types
const openSNSFromMenu = (platformId: PlatformId | 'all') => {
  openSNSWindow(platformId, allPlatformIds.value)
  if (mode.value === 'pro') {
    hoveredSection.value = null
  }
}

const openNewsFromMenu = (sourceId: string) => {
  openNewsWindow(sourceId, allNewsSourceIds.value)
  if (mode.value === 'pro') {
    hoveredSection.value = null
  }
}

const isInstrumentActive = (instrumentId: string) =>
  windows.value.some((window) => window.type === 'chart' && window.instrumentId === instrumentId)

const isEventsActive = () => windows.value.some((window) => window.type === 'events')

const isSNSActive = (platformId: PlatformId | 'all') => {
  const window = windows.value.find((entry) => entry.type === 'sns') as
    | SNSWindowState
    | undefined
  if (!window) return false
  if (platformId === 'all') {
    return window.platforms.length === allPlatformIds.value.length
  }
  return window.platforms.includes(platformId)
}

const isNewsActive = (sourceId: string) => {
  const window = windows.value.find((entry) => entry.type === 'news') as
    | NewsWindowState
    | undefined
  if (!window) return false
  if (sourceId === 'all') {
    return window.sources.length === newsSources.length
  }
  return window.sources.includes(sourceId)
}

const isCommunityActive = (boardSlug: string | 'all') => {
  const window = windows.value.find((entry) => entry.type === 'community') as
    | CommunityWindowState
    | undefined
  if (!window) return false
  if (boardSlug === 'all') {
    return window.selectedBoard === null
  }
  return window.selectedBoard === boardSlug
}

const selectInstrument = (instrumentId: string) => {
  openChart(instrumentId)
  hoveredSection.value = null
}

const openEventsFromMenu = () => {
  openEventsWindow()
  hoveredSection.value = null
}


const openCommunityFromMenu = (boardSlug: string | 'all') => {
  openCommunityWindow(boardSlug)
  if (mode.value === 'pro') {
    hoveredSection.value = null
  }
}


const navOffsetStyle = computed<CSSProperties>(() => ({
  '--nav-offset': `${navHeight.value}px`
}))

const workspacePaddingStyle = computed<CSSProperties>(() => ({
  paddingTop: `${navHeight.value}px`
}))

const generalPaddingStyle = computed<CSSProperties>(() => ({
  paddingTop: `${navHeight.value + 48}px`
}))

const getEconomicEventDetail = (index: number | null) =>
  index === null ? null : economicEventsList.value[index] ?? null

// Window meta helpers are now in useWindowItems composable
const getSNSWindowMetaWrapper = (window: SNSWindowState) =>
  getSNSWindowMeta(window, allPlatformIds.value, snsPlatformMap.value)

const getNewsWindowMetaWrapper = (window: NewsWindowState) =>
  getNewsWindowMeta(window, newsSourceMap.value)

const getCommunityWindowMetaWrapper = (window: CommunityWindowState) =>
  getCommunityWindowMeta(window, communityBoardMap.value)

// Alias for template usage
const getSNSWindowMetaForTemplate = getSNSWindowMetaWrapper
const getNewsWindowMetaForTemplate = getNewsWindowMetaWrapper
const getCommunityWindowMetaForTemplate = getCommunityWindowMetaWrapper
</script>

<template>
  <div class="layout">
    <nav
      ref="navRef"
      class="top-nav"
      @pointerenter="cancelHoverHide"
      @pointerleave="scheduleHoverHide"
    >
      <button type="button" class="brand" @click="handleLogoClick">
        <span class="brand__logo">INVEST</span>
        <span class="brand__mode">{{ mode === 'pro' ? 'PRO' : 'BASIC' }} HTS</span>
      </button>

      <ul class="menu" role="tablist">
        <li v-for="section in sections" :key="section.id">
          <button
            role="tab"
            type="button"
            :class="{
              active:
                mode === 'pro'
                  ? activeSection === section.id
                  : generalSection === section.id
            }"
            :aria-selected="
              mode === 'pro'
                ? activeSection === section.id
                : generalSection === section.id
            "
            @click="handleNavClick(section.id)"
            @pointerenter="handleNavPointerEnter(section.id)"
            @focus="handleNavPointerEnter(section.id)"
          >
            {{
              section.id === 'chart' && mode === 'general' ? '자산군' : section.label
            }}
          </button>
        </li>
      </ul>

      <div class="nav-right">
        <div class="mode-toggle" role="group" aria-label="화면 모드 전환">
          <button
            type="button"
            :class="{ active: mode === 'general' }"
            @click="setMode('general')"
          >
            일반
          </button>
          <button
            type="button"
            :class="{ active: mode === 'pro' }"
            @click="setMode('pro')"
          >
            트레이딩
          </button>
        </div>
        <button
          type="button"
          class="theme-toggle"
          :aria-label="`테마 전환 (${theme === 'dark' ? '라이트' : '다크'})`"
          @click="toggleTheme"
        >
          <div class="material-icons-round">
            {{ theme === 'dark' ? 'light_mode' : 'dark_mode' }}
          </div>
        </button>
      </div>
    </nav>

    <div
      v-if="mode === 'pro' && hoveredSection"
      class="menu-modal"
      :style="{ top: `${navHeight + 56}px` }"
    >
      <section
        class="menu-modal__panel"
        @pointerenter="cancelHoverHide"
        @pointerleave="scheduleHoverHide"
      >
        <template v-if="hoveredSection === 'chart'">
          <header class="menu-modal__header">
            <h3>차트보기</h3>
            <p>모든 종목 차트를 창 형태로 띄우고 자유롭게 이동하세요.</p>
          </header>
          <div class="instrument-list">
            <button
              v-for="instrument in instruments"
              :key="instrument.id"
              type="button"
              :class="{ active: isInstrumentActive(instrument.id) }"
              @click="selectInstrument(instrument.id)"
            >
              <span
                class="dot"
                :style="{ background: instrument.color }"
                aria-hidden="true"
              />
              <span class="name">{{ instrument.name }}</span>
              <span class="symbol">{{ instrument.symbol }}</span>
            </button>
          </div>
        </template>
        <template v-else-if="hoveredSection === 'events'">
          <header class="menu-modal__header">
            <h3>경제 이벤트</h3>
            <p>오늘 예정된 발표 일정을 빠르게 훑어보세요.</p>
          </header>
          <ul class="modal-list">
            <li v-for="event in menuPreviewEvents" :key="event.id">
              <strong>{{ formatEventDateLabel(event) }}</strong>
              <span>{{ event.country }} · {{ event.title }}</span>
              <p class="modal-note">
                {{ formatEventTimeLabel(event) }} · {{ event.indicator }}
              </p>
            </li>
          </ul>
          <button
            type="button"
            class="modal-action"
            :class="{ disabled: isEventsActive() }"
            :disabled="isEventsActive()"
            @click="openEventsFromMenu"
          >
            {{ isEventsActive() ? '경제 이벤트 창이 열려 있습니다' : '경제 이벤트 창 열기' }}
          </button>
        </template>
        <template v-else-if="hoveredSection === 'sns'">
          <header class="menu-modal__header">
            <h3>SNS</h3>
            <p>원하는 플랫폼의 실시간 투자 커뮤니티를 선택하세요.</p>
          </header>
          <div class="option-grid">
            <button
              v-for="platform in socialPlatforms"
              :key="platform.id"
              type="button"
              class="option-card"
              :class="{ active: isSNSActive(platform.id) }"
              @click="openSNSFromMenu(platform.id)"
            >
              <span class="option-card__badge">{{ platform.label }}</span>
              <p>{{ platform.description }}</p>
              <span class="option-card__meta">
                최근 업데이트 {{ platform.posts[0]?.timeAgo }}
              </span>
            </button>
          </div>
          <button
            type="button"
            class="modal-action"
            :class="{ disabled: isSNSActive('all') }"
            :disabled="isSNSActive('all')"
            @click="openSNSFromMenu('all')"
          >
            {{ isSNSActive('all') ? 'SNS 창이 열려 있습니다' : '모든 플랫폼 함께 보기' }}
          </button>
        </template>
        <template v-else-if="hoveredSection === 'news'">
          <header class="menu-modal__header">
            <h3>뉴스</h3>
            <p>글로벌 주요 언론사의 헤드라인을 창으로 띄울 수 있어요.</p>
          </header>
          <div class="option-grid news-grid">
            <button
              v-for="source in newsSources"
              :key="source.id"
              type="button"
              class="option-card"
              :class="{ active: isNewsActive(source.id) }"
              @click="openNewsFromMenu(source.id)"
            >
              <span class="option-card__badge">{{ source.label }}</span>
              <p>{{ source.region }} · 최신 {{ source.headlines.length }}건 헤드라인</p>
            </button>
          </div>
          <button
            type="button"
            class="modal-action"
            :class="{ disabled: isNewsActive('all') }"
            :disabled="isNewsActive('all')"
            @click="openNewsFromMenu('all')"
          >
            {{ isNewsActive('all') ? '뉴스 창이 열려 있습니다' : '모든 뉴스 함께 보기' }}
          </button>
        </template>
        <template v-else>
          <header class="menu-modal__header">
            <h3>커뮤니티</h3>
            <p>보드별 실시간 토론과 트렌드를 창으로 띄워보세요.</p>
          </header>
          <div class="community-menu">
            <div class="community-menu__boards">
              <button
                v-for="board in communityMenuBoards"
                :key="board.slug"
                type="button"
                class="community-board-card"
                :class="{ active: isCommunityActive(board.slug) }"
                @click="openCommunityFromMenu(board.slug)"
              >
                <div class="community-board-card__title">
                  <span aria-hidden="true">{{ board.emoji }}</span>
                  <strong>{{ board.title }}</strong>
                </div>
                <p>{{ board.description }}</p>
                <span class="community-board-card__meta">
                  오늘 {{ board.metrics.postsToday }}건
                </span>
              </button>
            </div>
            <div class="community-menu__posts">
              <button
                v-for="post in communityMenuPosts"
                :key="post.id"
                type="button"
                class="community-post-card"
                @click="openCommunityFromMenu(post.boardSlug ?? 'all')"
              >
                <div>
                  <p class="community-post-card__board">
                    {{ communityBoardMap.get(post.boardSlug)?.emoji }}
                    {{ communityBoardMap.get(post.boardSlug)?.title ?? '커뮤니티' }}
                  </p>
                  <strong>{{ post.title }}</strong>
                  <span class="community-post-card__meta">
                    {{ post.author }} · {{ post.postedAt }}
                  </span>
                </div>
                <p class="community-post-card__summary">{{ post.summary }}</p>
              </button>
            </div>
          </div>
          <button
            type="button"
            class="modal-action"
            :class="{ disabled: isCommunityActive('all') }"
            :disabled="isCommunityActive('all')"
            @click="openCommunityFromMenu('all')"
          >
            {{
              isCommunityActive('all')
                ? '커뮤니티 창이 열려 있습니다'
                : '전체 커뮤니티 피드 열기'
            }}
          </button>
        </template>
      </section>
    </div>

    <main v-if="mode === 'general'" class="general-container" :style="generalPaddingStyle">
      <GeneralAssetMap v-if="generalSection === 'chart'" />
      <EconomicCalendar
        v-else-if="generalSection === 'events'"
        :events="calendarEvents"
      />
      <GeneralSNSFeed v-else-if="generalSection === 'sns'" />
      <GeneralNewsFeed v-else-if="generalSection === 'news'" />
      <GeneralCommunity v-else-if="generalSection === 'community'" />
      <GeneralPlaceholder
        v-else
        title="커뮤니티 라운지"
        description="커뮤니티 기능은 일반 모드에 맞춰 업데이트될 예정입니다."
      />
    </main>
    <main v-else class="workspace" :style="workspacePaddingStyle">
      <section class="chart-stage" :style="navOffsetStyle">
        <div class="chart-grid"></div>
        <div v-if="windows.length === 0" class="empty-state">
          <p>상단 메뉴에서 차트, 경제 이벤트, SNS, 뉴스 등을 선택해 창을 띄워보세요.</p>
        </div>
        <div v-else class="debug-info">
          창 개수: {{ windows.length }}
        </div>
      </section>

      <template v-for="window in windows" :key="window.key">
        <ChartWindow
          v-if="window.type === 'chart' && instrumentMap.has(window.instrumentId)"
          :instrument="instrumentMap.get(window.instrumentId)!"
          :position="window.position"
          :size="window.size"
          :z-index="window.z"
          :locked-top="navHeight"
          @move="(detail) => handleMove(window.key, detail)"
          @resize="(detail) => handleResize(window.key, detail)"
          @focus="bringToFront(window.key)"
          @close="closeWindow(window.key)"
        />

        <InfoWindow
          v-else-if="window.type === 'events'"
          title="경제 이벤트 일정"
          subtitle="발표 시간과 전망치를 한눈에"
          :position="window.position"
          :size="window.size"
          :z-index="window.z"
          :locked-top="navHeight"
          :min-width="360"
          :min-height="260"
          @move="(detail) => handleMove(window.key, detail)"
          @resize="(detail) => handleResize(window.key, detail)"
          @focus="bringToFront(window.key)"
          @close="closeWindow(window.key)"
        >
          <template v-if="window.view === 'detail' && window.selectedIndex !== null">
            <template v-for="event in [getEconomicEventDetail(window.selectedIndex)]" :key="event?.id ?? window.selectedIndex">
              <div class="detail-view">
                <button
                  type="button"
                  class="detail-back"
                  @click="closeEventDetail(window.key)"
                >
                  ← 뒤로가기
                </button>
                <template v-if="event">
                  <div class="detail-header">
                    <span class="badge">{{ formatEventTimeLabel(event) }}</span>
                    <div class="detail-titles">
                      <h4>{{ event.title }}</h4>
                      <span class="meta">
                        {{ formatEventDateTimeLabel(event) }} · {{ event.country }}
                      </span>
                      <span class="meta meta-indicator">{{ event.indicator }}</span>
                    </div>
                  </div>
                  <p class="detail-description">{{ event.description }}</p>
                  <div v-if="event.forecast || event.previous" class="detail-stats">
                    <span v-if="event.forecast"><strong>예상</strong> {{ event.forecast }}</span>
                    <span v-if="event.previous"><strong>이전</strong> {{ event.previous }}</span>
                  </div>
                  <p v-if="event.relatedThemes.length" class="detail-tags">
                    연관 테마: {{ event.relatedThemes.join(', ') }}
                  </p>
                  <a
                    v-if="event.source"
                    class="detail-link"
                    :href="event.source"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    공식 자료 보기
                  </a>
                </template>
                <p v-else class="detail-description">
                  선택한 이벤트 정보를 불러오지 못했습니다.
                </p>
              </div>
            </template>
          </template>
          <template v-else>
            <ul class="window-list window-list--events">
              <li v-for="(event, index) in economicEventsList" :key="event.id">
                <button
                  type="button"
                  class="list-button"
                  @click="openEventDetail(window.key, index)"
                >
                  <div class="event-main">
                    <span class="badge">{{ formatEventTimeLabel(event) }}</span>
                    <div class="event-info">
                      <strong>{{ event.title }}</strong>
                      <span class="meta">
                        {{ formatEventDateLabel(event) }} · {{ event.country }}
                      </span>
                      <span class="meta meta-indicator">{{ event.indicator }}</span>
                    </div>
                  </div>
                  <p class="list-description">{{ event.description }}</p>
                </button>
              </li>
            </ul>
          </template>
        </InfoWindow>

        <template v-else-if="window.type === 'sns'">
          <template v-for="meta in [getSNSWindowMetaForTemplate(window)]" :key="window.key">
            <InfoWindow
              :title="`SNS — ${meta.primaryPlatformLabel}`"
              :subtitle="meta.platformSubtitle"
              :position="window.position"
              :size="window.size"
              :z-index="window.z"
              :locked-top="navHeight"
              :min-width="320"
              :min-height="300"
              @move="(detail) => handleMove(window.key, detail)"
              @resize="(detail) => handleResize(window.key, detail)"
              @focus="bringToFront(window.key)"
              @close="closeWindow(window.key)"
            >
              <template v-if="window.view === 'detail' && window.selectedIndex !== null">
                <template v-for="post in [getSNSDetail(meta.snsItems, window.selectedIndex)]" :key="post?.id ?? window.selectedIndex">
                  <div class="detail-view">
                    <button
                      type="button"
                      class="detail-back"
                      @click="closeSNSDetail(window.key)"
                    >
                      ← 뒤로가기
                    </button>
                    <template v-if="post">
                      <div class="sns-detail-profile">
                        <img :src="post.avatar" :alt="`${post.nickname} avatar`" />
                        <div>
                          <strong>{{ post.nickname }}</strong>
                          <span class="meta">
                            {{ post.handle }} · {{ post.timeAgo }}
                          </span>
                          <span class="sns-detail-source">{{ post.platformLabel }}</span>
                        </div>
                      </div>
                      <p class="detail-description">{{ post.content }}</p>
                      <p class="detail-body">{{ post.detail }}</p>
                    </template>
                    <p v-else class="detail-description">
                      선택된 게시글을 찾을 수 없습니다.
                    </p>
                  </div>
                </template>
              </template>
              <template v-else>
                <p class="filter-label">
                  {{
                    meta.hasAllPlatforms
                      ? '전체 플랫폼 실시간 업데이트'
                      : `${meta.primaryPlatformLabel} 실시간 업데이트`
                  }}
                </p>
                <ul class="window-list window-list--sns">
                  <li v-for="(post, index) in meta.snsItems" :key="post.id">
                    <button
                      type="button"
                      class="list-button sns-button"
                      @click="openSNSDetail(window.key, index)"
                    >
                      <div class="sns-profile">
                        <img :src="post.avatar" :alt="`${post.nickname} avatar`" />
                        <div>
                          <span class="sns-author">{{ post.nickname }}</span>
                          <span class="sns-handle">{{ post.handle }}</span>
                        </div>
                      </div>
                      <p>{{ post.content }}</p>
                      <div class="sns-meta-row">
                        <span class="sns-time">{{ post.timeAgo }}</span>
                        <span class="sns-source">{{ post.platformLabel }}</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </template>
            </InfoWindow>
          </template>
        </template>

        <template v-else-if="window.type === 'news'">
          <template v-for="meta in [getNewsWindowMetaForTemplate(window)]" :key="window.key">
            <InfoWindow
              :title="`뉴스 — ${meta.primarySourceLabel}`"
              :subtitle="meta.sourceSubtitle"
              :position="window.position"
              :size="window.size"
              :z-index="window.z"
              :locked-top="navHeight"
              :min-width="360"
              :min-height="300"
              @move="(detail) => handleMove(window.key, detail)"
              @resize="(detail) => handleResize(window.key, detail)"
              @focus="bringToFront(window.key)"
              @close="closeWindow(window.key)"
            >
              <template v-if="window.view === 'detail' && window.selectedIndex !== null">
                <template v-for="headline in [getNewsDetail(meta.newsItems, window.selectedIndex)]" :key="headline?.id ?? window.selectedIndex">
                  <div class="detail-view">
                    <button
                      type="button"
                      class="detail-back"
                      @click="closeNewsDetail(window.key)"
                    >
                      ← 뒤로가기
                    </button>
                    <template v-if="headline">
                      <div class="detail-header">
                        <h4>{{ headline.title }}</h4>
                        <span class="meta">
                          {{ headline.timeAgo }} · {{ headline.sourceLabel }}
                        </span>
                      </div>
                      <p class="detail-description">{{ headline.summary }}</p>
                      <p class="detail-body">{{ headline.body }}</p>
                    </template>
                    <p v-else class="detail-description">
                      선택한 뉴스 기사를 표시하지 못했습니다.
                    </p>
                  </div>
                </template>
              </template>
              <template v-else>
                <p class="filter-label">
                  {{
                    meta.hasAllSources
                      ? '전체 언론사 최신 헤드라인'
                      : `${meta.primarySourceLabel} 최신 헤드라인`
                  }}
                </p>
                <ol class="window-list window-list--news">
                  <li v-for="(headline, index) in meta.newsItems" :key="headline.id">
                    <button
                      type="button"
                      class="list-button news-button"
                      @click="openNewsDetail(window.key, index)"
                    >
                      <span class="news-index">{{ index + 1 }}</span>
                      <div class="news-body">
                        <strong>{{ headline.title }}</strong>
                        <span class="meta">
                          {{ headline.timeAgo }} · {{ headline.sourceLabel }}
                        </span>
                        <p class="list-description">{{ headline.summary }}</p>
                      </div>
                    </button>
                  </li>
                </ol>
              </template>
            </InfoWindow>
          </template>
        </template>

        <template v-else-if="window.type === 'community'">
          <template v-for="meta in [getCommunityWindowMetaForTemplate(window)]" :key="window.key">
            <InfoWindow
              :title="`커뮤니티 — ${meta.filterLabel}`"
              :subtitle="
                meta.boardFilter
                  ? `${meta.filterLabel} 실시간 토론`
                  : '전체 커뮤니티 하이라이트'
              "
              :position="window.position"
              :size="window.size"
              :z-index="window.z"
              :locked-top="navHeight"
              :min-width="360"
              :min-height="300"
              @move="(detail) => handleMove(window.key, detail)"
              @resize="(detail) => handleResize(window.key, detail)"
              @focus="bringToFront(window.key)"
              @close="closeWindow(window.key)"
            >
              <template v-if="window.view === 'detail' && window.selectedIndex !== null">
                <template v-for="post in [getCommunityDetail(meta.posts, window.selectedIndex)]" :key="post?.id ?? window.selectedIndex">
                  <div class="detail-view">
                    <button
                      type="button"
                      class="detail-back"
                      @click="closeCommunityDetail(window.key)"
                    >
                      ← 뒤로가기
                    </button>
                    <template v-if="post">
                      <div class="detail-header">
                        <h4>{{ post.title }}</h4>
                        <span class="meta">{{ post.author }} · {{ post.postedAt }}</span>
                      </div>
                      <p class="detail-description">{{ post.summary }}</p>
                      <div class="community-detail__stats">
                        <span>좋아요 {{ post.likes }}</span>
                        <span>댓글 {{ post.comments }}</span>
                      </div>
                      <div v-if="post.tags.length" class="community-detail__tags">
                        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
                      </div>
                    </template>
                    <p v-else class="detail-description">
                      선택한 게시글 정보를 불러오지 못했습니다.
                    </p>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="community-window__filters">
                  <button
                    type="button"
                    :class="{ active: !meta.boardFilter }"
                    @click="setCommunityFilter(window.key, null)"
                  >
                    전체
                  </button>
                  <button
                    v-for="board in communityBoardsByActivity.slice(0, 6)"
                    :key="board.slug"
                    type="button"
                    :class="{ active: board.slug === meta.boardFilter }"
                    @click="setCommunityFilter(window.key, board.slug)"
                  >
                    {{ board.emoji }} {{ board.title }}
                    <span>오늘 {{ board.metrics.postsToday }}건</span>
                  </button>
                </div>
                <p v-if="meta.posts.length === 0" class="empty-state">
                  선택한 보드에 게시글이 없습니다.
                </p>
                <ul v-else class="window-list window-list--community">
                  <li v-for="(post, index) in meta.posts" :key="post.id">
                    <button
                      type="button"
                      class="list-button community-button"
                      @click="openCommunityDetail(window.key, index)"
                    >
                      <div class="community-button__header">
                        <span>
                          {{ communityBoardMap.get(post.boardSlug)?.title ?? '커뮤니티' }}
                        </span>
                      </div>
                      <strong>{{ post.title }}</strong>
                      <p class="list-description">{{ post.summary }}</p>
                      <div class="community-button__meta">
                        <span>{{ post.author }}</span>
                        <span>{{ post.postedAt }}</span>
                        <span>👍 {{ post.likes }}</span>
                        <span>💬 {{ post.comments }}</span>
                      </div>
                    </button>
                  </li>
                </ul>
              </template>
            </InfoWindow>
          </template>
        </template>
      </template>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: var(--c-bg-800);
  border-bottom: 1px solid var(--c-border-strong);
  z-index: 1000;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: transparent;
  border: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.brand__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: var(--c-surface-hover);
  color: var(--c-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
}

.brand__mode {
  color: var(--c-text-muted);
  font-size: 0.8rem;
}

.brand:hover .brand__logo {
  background: var(--c-bg-700);
}

.brand:hover {
  transform: translateY(-1px);
}

.menu {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.menu button {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--c-text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.menu button:hover {
  color: var(--c-text-primary);
  background: var(--c-surface-hover);
}

.menu button.active {
  background: var(--c-bg-700);
  color: var(--c-text-primary);
  border: 1px solid var(--c-border-hover);
}

.nav-right {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.mode-toggle {
  display: inline-flex;
  background: var(--c-bg-900);
  border-radius: var(--radius-sm);
  padding: 4px;
  gap: 4px;
  border: 1px solid var(--c-border-strong);
}

.mode-toggle button {
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.2s ease;
}

.mode-toggle button.active {
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-sm);
  background: var(--c-bg-900);
  color: var(--c-text-secondary);
  padding: 6px 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  color: var(--c-text-primary);
  background: var(--c-surface-hover);
  border-color: var(--c-border-hover);
}

.theme-toggle .material-icons-round {
  font-size: 1.2rem;
  line-height: 1;
}

.menu-modal {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: min(920px, calc(100vw - 48px));
  z-index: 1100;
}

.menu-modal__panel {
  background: var(--c-bg-800);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-strong);
  box-shadow: 0 8px 24px var(--c-overlay-strong);
  padding: 24px 28px 28px;
  display: grid;
  gap: 18px;
}

.menu-modal__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-modal__header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--c-text-primary);
}

.menu-modal__header p {
  margin: 0;
  color: var(--c-text-muted);
  font-size: 0.82rem;
}

.community-menu {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 16px;
}

.community-menu__boards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.community-board-card,
.community-post-card {
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  background: var(--c-bg-900);
  padding: 14px;
  text-align: left;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.community-board-card.active,
.community-board-card:hover,
.community-post-card:hover {
  border-color: var(--c-border-hover);
  background: var(--c-bg-800);
}

.community-board-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.community-board-card__meta,
.community-post-card__meta {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.community-post-card__board {
  margin: 0;
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.community-post-card__summary {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.4;
}

.general-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px 80px;
  box-sizing: border-box;
  min-height: 100vh;
}

.workspace {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 32px 72px;
  position: relative;
}

.instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.instrument-list button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.instrument-list button:hover {
  border-color: var(--c-border-hover);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.instrument-list button.active {
  border-color: var(--c-border-hover);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.instrument-list .dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.instrument-list .name {
  flex: 1;
  font-size: 0.88rem;
}

.instrument-list .symbol {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.chart-stage {
  position: fixed;
  top: var(--nav-offset);
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0;
  background: var(--c-bg-900);
  border-top: 1px solid var(--c-border-strong);
  z-index: 0;
  pointer-events: none;
}

.chart-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--c-bg-700) 1px, transparent 1px),
    linear-gradient(90deg, var(--c-bg-700) 1px, transparent 1px);
  background-size: 60px 60px;
  opacity: 0.3;
}

.empty-state {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--c-text-muted);
  font-size: 1rem;
  letter-spacing: 0.02em;
  pointer-events: none;
  padding: 20px;
  text-align: center;
}

.debug-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: var(--c-bg-900);
  color: var(--c-text-primary);
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
}

.modal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.modal-list li {
  display: grid;
  gap: 4px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
}

.modal-list li strong {
  font-size: 0.86rem;
  color: var(--c-text-primary);
}

.modal-list li span {
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.modal-note {
  margin: 0;
  font-size: 0.78rem;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.modal-action {
  justify-self: flex-end;
  border: none;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
  cursor: pointer;
  font-size: 0.82rem;
  transition: all 0.2s ease;
}

.modal-action:hover {
  background: var(--c-surface-hover);
  border: 1px solid var(--c-border-hover);
}

.modal-action.disabled,
.modal-action[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
  background: var(--c-overlay-soft);
  color: var(--c-text-muted);
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-900);
  color: var(--c-text-secondary);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.option-card:hover {
  border-color: var(--c-border-hover);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.option-card.active {
  border-color: var(--c-border-hover);
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.option-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--c-bg-700);
  color: var(--c-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.option-card__meta {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.window-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.window-list--events li,
.window-list--sns li,
.window-list--news li {
  padding: 16px 18px;
  border-radius: var(--radius-md);
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  display: grid;
  gap: 10px;
}

.event-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--c-bg-700);
  color: var(--c-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 56px;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-info strong {
  font-size: 0.92rem;
  color: var(--c-text-primary);
}

.event-info .meta {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.event-info .meta-indicator {
  color: var(--c-text-secondary);
}

.filter-label {
  margin: 0 0 12px;
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.window-list--sns li p {
  margin: 0;
  color: var(--c-text-secondary);
  line-height: 1.45;
}

.sns-author {
  font-weight: 600;
  color: var(--c-text-primary);
}

.sns-time {
  font-size: 0.74rem;
}

.window-list--news {
  counter-reset: news;
}

.window-list--news li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.window-list--community li {
  padding: 0;
  border: none;
  background: transparent;
}

.community-button {
  width: 100%;
  text-align: left;
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: inherit;
  cursor: pointer;
}

.community-button__header {
  display: flex;
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.community-button__meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.community-window__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.community-window__filters button {
  border: 1px solid var(--c-border);
  background: var(--c-bg-900);
  color: var(--c-text-secondary);
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.78rem;
  cursor: pointer;
}

.community-window__filters button span {
  margin-left: 6px;
  color: var(--c-text-muted);
  font-weight: 500;
}

.community-window__filters button.active,
.community-window__filters button:hover {
  border-color: var(--c-border-hover);
  color: var(--c-text-primary);
}

.news-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: var(--c-bg-700);
  color: var(--c-text-primary);
  font-size: 0.75rem;
  font-weight: 600;
}

.news-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-body strong {
  font-size: 0.92rem;
  color: var(--c-text-primary);
}

.news-body .meta {
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.list-button {
  display: block;
  width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  text-align: left;
  padding: 0;
  cursor: pointer;
  display: grid;
  gap: 10px;
}

.list-button:hover {
  color: var(--c-text-primary);
}

.list-button:focus-visible {
  outline: 2px solid var(--c-border-hover);
  outline-offset: 3px;
}

.list-description {
  margin: 0;
  font-size: 0.8rem;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.detail-view {
  display: grid;
  gap: 16px;
}

.detail-back {
  align-self: flex-start;
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  color: var(--c-text-secondary);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.78rem;
  transition: all 0.2s ease;
}

.detail-back:hover {
  background: var(--c-bg-700);
  color: var(--c-text-primary);
}

.detail-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.detail-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-titles h4 {
  margin: 0;
  font-size: 1rem;
  color: var(--c-text-primary);
}

.detail-titles .meta {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.detail-titles .meta-indicator {
  font-size: 0.75rem;
  color: var(--c-text-secondary);
}

.detail-description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-text-secondary);
  line-height: 1.45;
}

.detail-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.78rem;
  color: var(--c-text-secondary);
}

.detail-stats strong {
  color: var(--c-text-primary);
  margin-right: 4px;
}

.detail-tags {
  margin: 0;
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.detail-link {
  font-size: 0.78rem;
  color: var(--c-link);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.detail-link:hover {
  text-decoration: underline;
}

.community-detail__stats {
  margin: 12px 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--c-text-secondary);
}

.community-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.community-detail__tags span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--c-border);
  background: var(--c-bg-900);
  font-size: 0.75rem;
}

.detail-body {
  margin: 0;
  font-size: 0.86rem;
  color: var(--c-text-primary);
  line-height: 1.6;
}

.sns-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sns-profile img,
.sns-detail-profile img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px var(--c-overlay-soft);
}

.sns-detail-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sns-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.sns-handle {
  display: block;
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.sns-time {
  display: inline-flex;
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.sns-button p {
  margin: 8px 0 0;
  font-size: 0.9rem;
  color: var(--c-text-secondary);
}

.sns-detail-profile div strong {
  display: block;
  font-size: 0.92rem;
  color: var(--c-text-primary);
}

.sns-detail-profile div .meta {
  display: block;
  font-size: 0.76rem;
  color: var(--c-text-muted);
  margin-top: 2px;
}

.sns-source {
  font-size: 0.74rem;
  color: var(--c-text-muted);
  margin-left: auto;
}

.sns-detail-source {
  display: inline-block;
  margin-top: 6px;
  font-size: 0.76rem;
  color: var(--c-text-muted);
}

.news-button {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

@media (min-width: 1440px) {
  .workspace {
    max-width: 1400px;
  }

  .menu-modal {
    width: min(1200px, calc(100vw - 48px));
  }
}

@media (max-width: 1439px) and (min-width: 1200px) {
  .workspace {
    max-width: 1180px;
  }
}

@media (max-width: 1199px) and (min-width: 1024px) {
  .workspace {
    padding: 0 24px 60px;
  }

  .menu-modal {
    width: min(900px, calc(100vw - 40px));
  }

  .instrument-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .top-nav {
    padding: 12px 20px;
    gap: 16px;
  }

  .workspace {
    padding: 0 20px 60px;
  }

  .general-container {
    padding: 0 24px 60px;
  }

  .menu-modal {
    width: min(800px, calc(100vw - 32px));
  }

  .menu-modal__panel {
    padding: 20px 24px;
  }

  .instrument-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .community-menu {
    grid-template-columns: 1fr;
  }

  .community-menu__boards {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .top-nav {
    flex-wrap: wrap;
    padding: 12px 16px;
    gap: 12px;
  }

  .brand__mode {
    display: none;
  }

  .menu {
    order: 3;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .menu button {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .workspace {
    padding: 0 16px 60px;
  }

  .general-container {
    padding: 0 20px 60px;
  }

  .menu-modal {
    width: calc(100vw - 24px);
  }

  .menu-modal__panel {
    padding: 18px 20px;
  }

  .instrument-list {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
  }

  .option-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .community-menu {
    grid-template-columns: 1fr;
  }

  .community-menu__boards {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .top-nav {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
    gap: 12px;
  }

  .brand {
    justify-content: center;
  }

  .brand__mode {
    display: none;
  }

  .nav-right {
    justify-content: center;
  }

  .menu {
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  .menu button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .workspace {
    padding: 0 12px 60px;
  }

  .general-container {
    padding: 0 16px 60px;
  }

  .menu-modal {
    width: calc(100vw - 16px);
    left: 8px;
    right: 8px;
    transform: none;
  }

  .menu-modal__panel {
    padding: 16px 18px;
  }

  .instrument-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 6px;
  }

  .instrument-list button {
    padding: 8px 10px;
  }

  .option-grid {
    grid-template-columns: 1fr;
  }

  .news-window {
    grid-template-columns: 1fr;
  }

  .community-menu {
    grid-template-columns: 1fr;
  }

  .community-menu__boards {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 479px) {
  .top-nav {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 12px;
    gap: 10px;
  }

  .brand {
    justify-content: center;
  }

  .brand__logo {
    padding: 4px 8px;
    font-size: 0.7rem;
  }

  .brand__mode {
    display: none;
  }

  .nav-right {
    justify-content: center;
    gap: 8px;
  }

  .mode-toggle button {
    padding: 4px 12px;
    font-size: 0.75rem;
  }

  .theme-toggle {
    padding: 4px 8px;
  }

  .menu {
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  .menu button {
    padding: 6px 8px;
    font-size: 0.75rem;
  }

  .workspace {
    padding: 0 8px 60px;
  }

  .general-container {
    padding: 0 12px 60px;
  }

  .menu-modal {
    width: calc(100vw - 8px);
    left: 4px;
    right: 4px;
    transform: none;
  }

  .menu-modal__panel {
    padding: 14px 16px;
  }

  .instrument-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 4px;
  }

  .instrument-list button {
    padding: 6px 8px;
    font-size: 0.8rem;
  }

  .instrument-list .name {
    font-size: 0.8rem;
  }

  .instrument-list .symbol {
    font-size: 0.7rem;
  }

  .option-grid {
    grid-template-columns: 1fr;
  }

  .option-card {
    padding: 12px 14px;
  }

  .community-menu {
    grid-template-columns: 1fr;
  }

  .community-menu__boards {
    grid-template-columns: 1fr;
  }

  .community-board-card,
  .community-post-card {
    padding: 12px;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (hover: none) and (pointer: coarse) {
  .menu button,
  .instrument-list button,
  .option-card,
  .community-board-card,
  .community-post-card {
    min-height: 44px;
  }

  .theme-toggle,
  .mode-toggle button {
    min-height: 44px;
    min-width: 44px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .theme-toggle .material-icons-round {
    font-size: 1.1rem;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .theme-toggle .material-icons-round {
    font-size: 1rem;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .theme-toggle .material-icons-round {
    font-size: 0.9rem;
  }
}

@media (max-width: 479px) {
  .theme-toggle .material-icons-round {
    font-size: 0.8rem;
  }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .brand__logo {
    font-weight: 700;
  }
}

:global(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
  background: transparent;
}

:global(*::-webkit-scrollbar-track) {
  background: transparent;
}

:global(*::-webkit-scrollbar-thumb) {
  background: var(--c-bg-700);
  border-radius: 4px;
}

:global(*::-webkit-scrollbar-thumb:hover) {
  background: var(--c-overlay-strong);
}

:global(*) {
  scrollbar-width: thin;
  scrollbar-color: var(--c-bg-700) transparent;
}

@media (max-width: 768px) {
  :global(*::-webkit-scrollbar) {
    width: 4px;
    height: 4px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .empty-state {
    font-size: 0.9rem;
    padding: 16px;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .empty-state {
    font-size: 0.85rem;
    padding: 12px;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .empty-state {
    font-size: 0.8rem;
    padding: 10px;
  }
}

@media (max-width: 479px) {
  .empty-state {
    font-size: 0.75rem;
    padding: 8px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .debug-info {
    top: 8px !important;
    right: 8px !important;
    padding: 6px !important;
    font-size: 11px !important;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .debug-info {
    top: 6px !important;
    right: 6px !important;
    padding: 4px 6px !important;
    font-size: 10px !important;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .debug-info {
    top: 4px !important;
    right: 4px !important;
    padding: 3px 5px !important;
    font-size: 9px !important;
  }
}

@media (max-width: 479px) {
  .debug-info {
    display: none !important;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .chart-grid {
    background-size: 50px 50px;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .chart-grid {
    background-size: 40px 40px;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .chart-grid {
    background-size: 30px 30px;
  }
}

@media (max-width: 479px) {
  .chart-grid {
    background-size: 25px 25px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .modal-list li {
    padding: 12px 16px;
  }

  .modal-list li strong {
    font-size: 0.8rem;
  }

  .modal-list li span {
    font-size: 0.75rem;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .modal-list {
    gap: 10px;
  }

  .modal-list li {
    padding: 10px 14px;
  }

  .modal-list li strong {
    font-size: 0.75rem;
  }

  .modal-list li span {
    font-size: 0.72rem;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .modal-list li {
    padding: 8px 12px;
  }

  .modal-list li strong {
    font-size: 0.72rem;
  }

  .modal-list li span {
    font-size: 0.7rem;
  }
}
</style>
