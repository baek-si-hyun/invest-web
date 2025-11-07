<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import koLocale from '@fullcalendar/core/locales/ko'

export type EventFilterBucket =
  | 'domestic-economic'
  | 'foreign-economic'
  | 'domestic-earnings'
  | 'foreign-earnings'

export type CalendarEvent = {
  id?: string
  title: string
  start: string
  end?: string
  url?: string
  allDay?: boolean
  extendedProps?: {
    indicator?: string
    relatedThemes?: string[]
    country?: string
    importance?: 'high' | 'medium' | 'low'
    flag?: string
    forecast?: string
    previous?: string
    description?: string
    filterCategory?: EventFilterBucket
    timezone?: string
  }
}

type FilterType = 'all' | EventFilterBucket

const FILTER_COLORS: Record<EventFilterBucket, string> = {
  'domestic-economic': '#38bdf8',
  'foreign-economic': '#f97316',
  'domestic-earnings': '#22c55e',
  'foreign-earnings': '#a855f7'
}

const DEFAULT_EVENT_COLOR = '#6366f1'

const filterOptions: { id: FilterType; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'domestic-economic', label: '국내 경제 지표' },
  { id: 'foreign-economic', label: '해외 경제 지표' },
  { id: 'domestic-earnings', label: '국내 기업 실적' },
  { id: 'foreign-earnings', label: '해외 기업 실적' }
]

const props = withDefaults(
  defineProps<{
    events: CalendarEvent[]
    initialDate?: string
  }>(),
  {
    initialDate: new Date().toISOString().slice(0, 10)
  }
)

const calendarEl = ref<HTMLDivElement | null>(null)
let calendar: Calendar | null = null

const activeFilter = ref<FilterType>('all')
const selectedDate = ref<string | null>(null)

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') {
    return props.events
  }
  return props.events.filter(
    (event) => event.extendedProps?.filterCategory === activeFilter.value
  )
})

const stripTimeFromTitle = (title: string) =>
  title.replace(/^\s*\d{1,2}:\d{2}(?:\s*[A-Z]{2,5})?\s*(?:·\s*)?/, '')

const resolveEventColor = (event: CalendarEvent) => {
  const category = event.extendedProps?.filterCategory
  return (category && FILTER_COLORS[category]) ?? DEFAULT_EVENT_COLOR
}

const transformEvent = (event: CalendarEvent) => ({
  ...event,
  title: stripTimeFromTitle(event.title),
  backgroundColor: 'var(--c-bg-800)',
  borderColor: resolveEventColor(event),
  textColor: 'var(--c-text-primary)'
})

const transformedEvents = computed(() => filteredEvents.value.map(transformEvent))

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  return filteredEvents.value.filter((event) => event.start?.startsWith(selectedDate.value ?? ''))
})

const selectedDateLabel = computed(() =>
  selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString('ko-KR')
    : ''
)

const formatEventTime = (event: CalendarEvent) => {
  if (event.allDay) return '종일'
  const date = new Date(event.start)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

const buildEventMeta = (event: CalendarEvent) => {
  const props = event.extendedProps ?? {}
  const parts = [props.country, props.indicator].filter(Boolean)
  return parts.join(' · ')
}

const handleFilterClick = (next: FilterType) => {
  if (activeFilter.value === next) return
  activeFilter.value = next
}

const updateCalendarEvents = () => {
  if (!calendar) return
  const events = transformedEvents.value
  calendar.removeAllEvents()
  events.forEach((event) => {
    calendar!.addEvent(event)
  })
  calendar.render()
}

onMounted(() => {
  if (!calendarEl.value) return
  calendar = new Calendar(calendarEl.value, {
    plugins: [dayGridPlugin, interactionPlugin],
    locales: [koLocale],
    locale: 'ko',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    firstDay: 1,
    dayMaxEvents: 2,
    displayEventTime: false,
    height: 'auto',
    events: transformedEvents.value,
    initialDate: props.initialDate,
    dateClick: (info) => {
      selectedDate.value = info.dateStr
    },
    eventClick: (info) => {
      if (info.event.url) {
        return
      }
      info.jsEvent?.preventDefault?.()
    }
  })

  calendar.render()
})

onBeforeUnmount(() => {
  calendar?.destroy()
  calendar = null
})

watch(transformedEvents, () => {
  updateCalendarEvents()
})

watch(
  () => props.initialDate,
  (next) => {
    if (calendar && next) {
      calendar.gotoDate(next)
    }
  }
)

watch(activeFilter, () => {
  selectedDate.value = null
  updateCalendarEvents()
})
</script>

<template>
  <div class="calendar-pane">
    <section class="calendar-intro">
      <div>
        <h2>경제 이벤트 캘린더</h2>
        <p>전 세계 주요 경제 이벤트를 일정으로 확인하고, 발표 일정을 미리 준비하세요.</p>
      </div>
      <div class="filter-group" role="toolbar" aria-label="이벤트 분류 필터">
        <button
          v-for="option in filterOptions"
          :key="option.id"
          type="button"
          class="filter-button"
          :class="{ active: activeFilter === option.id }"
          @click="handleFilterClick(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </section>

    <section class="calendar-surface">
      <div class="calendar-container">
        <div ref="calendarEl" class="calendar-element"></div>
      </div>

      <div v-if="selectedDate && selectedDateEvents.length > 0" class="selected-events">
        <header>
          <strong>{{ selectedDateLabel }}</strong>
          <span>{{ selectedDateEvents.length }}건 예정</span>
        </header>
        <ul>
          <li
            v-for="event in selectedDateEvents"
            :key="event.id ?? `${event.start}-${event.title}`"
          >
            <div class="event-main">
              <span class="color-chip" :style="{ background: resolveEventColor(event) }"></span>
              <div class="event-body">
                <strong>{{ stripTimeFromTitle(event.title) }}</strong>
                <span class="meta">
                  {{ buildEventMeta(event) }}
                  <template v-if="formatEventTime(event)">
                    · {{ formatEventTime(event) }}
                  </template>
                </span>
              </div>
            </div>
            <a
              v-if="event.url"
              :href="event.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              자세히 보기
            </a>
          </li>
        </ul>
      </div>
      <div v-else-if="selectedDate" class="empty-events">
        <p>선택한 날짜에는 예정된 이벤트가 없습니다.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.calendar-pane {
  display: grid;
  gap: 28px;
  color: var(--c-text-primary);
  padding: 36px;
  background: var(--c-bg-800);
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-strong);
  box-shadow: 0 8px 24px var(--c-overlay-strong);
}

.calendar-intro {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-800);
  box-shadow: 0 4px 12px var(--c-overlay-strong);
}

.calendar-intro h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--c-text-primary);
  letter-spacing: -0.01em;
}

.calendar-intro p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-900);
  color: var(--c-text-secondary);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background: var(--c-bg-700);
  border-color: var(--c-border-soft);
  color: var(--c-text-primary);
}

.filter-button.active {
  background: var(--c-bg-700);
  border-color: var(--c-border-hover);
  color: var(--c-text-primary);
  box-shadow: 0 2px 8px var(--c-overlay-soft);
}

.calendar-surface {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-800);
  box-shadow: 0 4px 12px var(--c-overlay-strong);
}

.calendar-container {
  border-radius: var(--radius-md);
  background: var(--c-bg-900);
  border: 1px solid var(--c-border-strong);
  padding: 12px;
  overflow: hidden;
}

.calendar-element {
  min-height: 500px;
}

.calendar-container :deep(.fc) {
  --fc-border-color: var(--c-bg-700);
  --fc-page-bg-color: transparent;
  --fc-neutral-bg-color: var(--c-bg-900);
  --fc-list-event-hover-bg-color: var(--c-bg-700);
  --fc-today-bg-color: var(--c-bg-700);
  color: var(--c-text-primary);
  font-family: 'Inter', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.calendar-container :deep(.fc .fc-toolbar-title) {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--c-text-primary);
}

.calendar-container :deep(.fc .fc-button) {
  background: var(--c-bg-700);
  border: 1px solid var(--c-border-soft);
  color: var(--c-text-primary);
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  transition: all 0.2s ease;
}

.calendar-container :deep(.fc .fc-button:hover),
.calendar-container :deep(.fc .fc-button:focus-visible) {
  background: var(--c-surface-hover);
  color: var(--c-text-primary);
  border-color: var(--c-border-hover);
}

.calendar-container :deep(.fc .fc-daygrid-day-number) {
  color: var(--c-text-secondary);
  font-weight: 500;
}

.calendar-container :deep(.fc .fc-col-header-cell) {
  color: var(--c-text-muted);
  font-weight: 600;
}

.calendar-container :deep(.fc-daygrid-event) {
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 0.75rem;
  border-width: 1px !important;
  border-style: solid !important;
  background: var(--c-text-primary) !important;
  color: var(--c-bg-900) !important;
  font-weight: 500;
}

.selected-events,
.empty-events {
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-strong);
  background: var(--c-bg-900);
  box-shadow: 0 2px 8px var(--c-overlay-soft);
}

.selected-events header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--c-border-strong);
  font-size: 0.8rem;
  color: var(--c-text-muted);
}

.selected-events header strong {
  font-size: 0.9rem;
  color: var(--c-text-primary);
}

.selected-events ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
  display: grid;
  gap: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.selected-events li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px;
}

.selected-events li + li {
  border-top: 1px solid var(--c-border-strong);
}

.event-main {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.color-chip {
  width: 8px;
  height: 32px;
  border-radius: 4px;
  flex-shrink: 0;
}

.event-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-body strong {
  font-size: 0.85rem;
  color: var(--c-text-primary);
}

.event-body .meta {
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.selected-events a {
  font-size: 0.75rem;
  color: var(--c-link);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.selected-events a:hover {
  color: var(--c-link);
  border-color: var(--c-link);
}

.empty-events {
  padding: 24px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--c-text-muted);
}

@media (min-width: 1440px) {
  .calendar-intro h2 {
    font-size: 1.75rem;
  }

  .calendar-element {
    min-height: 600px;
  }
}

@media (max-width: 1439px) and (min-width: 1200px) {
  .calendar-element {
    min-height: 550px;
  }
}

@media (max-width: 1199px) and (min-width: 1024px) {
  .calendar-element {
    min-height: 520px;
  }
}

@media (max-width: 1023px) and (min-width: 768px) {
  .calendar-pane {
    padding: 28px;
  }

  .calendar-element {
    min-height: 480px;
  }
}

@media (max-width: 767px) and (min-width: 640px) {
  .calendar-pane {
    padding: 24px;
  }

  .calendar-intro {
    padding: 18px;
  }

  .calendar-surface {
    padding: 16px;
  }

  .calendar-element {
    min-height: 420px;
  }

  .selected-events header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .selected-events li {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

@media (max-width: 639px) and (min-width: 480px) {
  .calendar-pane {
    padding: 20px;
  }

  .calendar-intro {
    padding: 16px;
  }

  .calendar-surface {
    padding: 14px;
  }

  .calendar-element {
    min-height: 360px;
  }
}

@media (max-width: 479px) {
  .calendar-pane {
    padding: 16px;
  }

  .calendar-intro {
    padding: 12px;
  }

  .calendar-intro h2 {
    font-size: 1rem;
  }

  .calendar-intro p {
    font-size: 0.8rem;
  }

  .calendar-surface {
    padding: 12px;
  }

  .calendar-element {
    min-height: 320px;
  }

  .calendar-container {
    padding: 8px;
  }

  .filter-button {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
}

@media (hover: none) and (pointer: coarse) {
  .filter-button {
    min-height: 44px;
  }

  .selected-events a {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
