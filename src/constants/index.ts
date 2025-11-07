import type { Section } from '@/types'

export const SECTIONS: Array<{ id: Section; label: string }> = [
  { id: 'chart', label: '차트보기' },
  { id: 'events', label: '경제 이벤트' },
  { id: 'sns', label: 'SNS' },
  { id: 'news', label: '뉴스' },
  { id: 'community', label: '커뮤니티' }
]

export const NEWS_REGION_ACCENTS: Record<string, string> = {
  글로벌: '#60a5fa',
  미국: '#f97316',
  영국: '#a855f7',
  한국: '#22c55e',
  일본: '#facc15',
  홍콩: '#14b8a6',
  중국: '#ef4444'
}

export const DEFAULT_NEWS_ACCENT = '#6366f1'

export const DEFAULT_WINDOW_SIZES = {
  chart: { width: 380, height: 260 },
  events: { width: 420, height: 320 },
  sns: { width: 360, height: 340 },
  news: { width: 420, height: 360 },
  community: { width: 420, height: 360 }
} as const

export const HOVER_HIDE_DELAY = 150
export const DEFAULT_NAV_HEIGHT = 72


