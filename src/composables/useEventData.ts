import { computed } from 'vue'
import type { EconomicEvent } from '@/data/economicEvents'
import {
  toEventDate,
  formatCalendarTitleForCalendar
} from '@/utils/formatters'
import type { CalendarEvent } from '@/components/EconomicCalendar.vue'

export function useEventData(calendarEconomicEvents: EconomicEvent[]) {
  const sortedCalendarEvents = computed(() =>
    [...calendarEconomicEvents].sort(
      (a, b) => toEventDate(a).getTime() - toEventDate(b).getTime()
    )
  )

  const nowPointer = computed(() => new Date())

  const upcomingCalendarEvents = computed(() =>
    sortedCalendarEvents.value.filter((event) => toEventDate(event) >= nowPointer.value)
  )

  const economicEventsList = computed(() =>
    upcomingCalendarEvents.value.length > 0
      ? upcomingCalendarEvents.value
      : sortedCalendarEvents.value
  )

  const menuPreviewEvents = computed(() => economicEventsList.value.slice(0, 3))

  const calendarEvents = computed<CalendarEvent[]>(() =>
    economicEventsList.value.map((event) => ({
      id: event.id,
      title: formatCalendarTitleForCalendar(event),
      start: `${event.date}T${event.time || '00:00'}`,
      url: event.source,
      allDay: false,
      extendedProps: {
        indicator: event.indicator,
        relatedThemes: event.relatedThemes,
        country: event.country,
        importance: event.importance,
        flag: event.flag,
        forecast: event.forecast,
        previous: event.previous,
        description: event.description,
        filterCategory: event.filterCategory,
        timezone: event.timezone
      }
    }))
  )

  return {
    sortedCalendarEvents,
    economicEventsList,
    menuPreviewEvents,
    calendarEvents
  }
}


