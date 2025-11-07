import type { EconomicEvent } from '@/data/economicEvents'

export const eventDateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  weekday: 'short'
})

export const eventDateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

export const toEventDate = (event: EconomicEvent): Date => {
  return new Date(`${event.date}T${event.time || '00:00'}`)
}

export const formatEventDateLabel = (event: EconomicEvent): string => {
  return eventDateFormatter.format(toEventDate(event))
}

export const formatEventTimeLabel = (event: EconomicEvent): string => {
  return `${event.time}${event.timezone ? ` ${event.timezone}` : ''}`
}

export const formatEventDateTimeLabel = (event: EconomicEvent): string => {
  return eventDateTimeFormatter.format(toEventDate(event))
}

export const formatCalendarTitleForCalendar = (event: EconomicEvent): string => {
  return `${event.time}${event.timezone ? ` ${event.timezone}` : ''} · ${event.title}`
}

export const formatChange = (change: number): string => {
  if (!Number.isFinite(change)) return '0.0%'
  const rounded = Number(change.toFixed(1))
  const sign = rounded > 0 ? '+' : ''
  return `${sign}${rounded.toFixed(1)}%`
}


