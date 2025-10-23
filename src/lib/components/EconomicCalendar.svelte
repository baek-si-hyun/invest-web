<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

import { economicEvents, type EconomicEvent } from '$lib/data/economicEvents';

	type CalendarEvent = {
		id?: string;
		title: string;
		start: string;
		end?: string;
		url?: string;
		allDay?: boolean;
		extendedProps?: Record<string, unknown>;
	};

	type EventFilterBucket =
		| 'domestic-economic'
		| 'foreign-economic'
		| 'domestic-earnings'
		| 'foreign-earnings';
	type FilterType = 'all' | EventFilterBucket;

	const FILTER_COLORS: Record<EventFilterBucket, string> = {
		'domestic-economic': '#38bdf8',
		'foreign-economic': '#f97316',
		'domestic-earnings': '#22c55e',
		'foreign-earnings': '#a855f7'
	};

const DEFAULT_EVENT_COLOR = '#6366f1';

type DateClickArg = {
	dateStr: string;
};

type EventClickArg = {
	event: {
		url?: string;
	};
	jsEvent?: {
		preventDefault?: () => void;
	};
};

const formatCalendarTitle = (event: EconomicEvent) =>
	`${event.time}${event.timezone ? ` ${event.timezone}` : ''} · ${event.title}`;

const events: CalendarEvent[] = economicEvents.map((event) => ({
	id: event.id,
	title: formatCalendarTitle(event),
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
}));


	const filterOptions: { id: FilterType; label: string }[] = [
		{ id: 'all', label: '전체' },
		{ id: 'domestic-economic', label: '국내 경제 지표' },
		{ id: 'foreign-economic', label: '해외 경제 지표' },
		{ id: 'domestic-earnings', label: '국내 기업 실적' },
		{ id: 'foreign-earnings', label: '해외 기업 실적' }
	];

	let activeFilter: FilterType = 'all';
	let selectedDate: string | null = null;
	let selectedDateEvents: CalendarEvent[] = [];

	const today = new Date();
	const initialDate = today.toISOString().slice(0, 10);

let calendarEl: HTMLDivElement | null = null;
let calendar: any = null;



	const formatEventTime = (event: CalendarEvent) => {
		if (event.allDay) return '종일';
		const date = new Date(event.start);
		if (Number.isNaN(date.getTime())) return null;
		return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
	};

	const stripTimeFromTitle = (title: string) =>
		title.replace(/^\s*\d{1,2}:\d{2}(?:\s*[A-Z]{2,5})?\s*(?:·\s*)?/, '');

	const buildEventMeta = (event: CalendarEvent) => {
		const props = event.extendedProps ?? {};
		const parts = [props.country, props.indicator].filter(Boolean);
		return parts.join(' · ');
	};

	const resolveEventColor = (event: CalendarEvent) =>
		FILTER_COLORS[event.extendedProps?.filterCategory as EventFilterBucket] ?? DEFAULT_EVENT_COLOR;

const transformEvent = (event: CalendarEvent) => {
	const color = resolveEventColor(event);
	return {
		...event,
		title: stripTimeFromTitle(event.title),
		backgroundColor: 'rgba(248, 250, 255, 0.96)',
		borderColor: color,
		textColor: '#0f172a'
	};
};

const computeFilteredEvents = () =>
	activeFilter === 'all'
		? events
		: events.filter((event) => event.extendedProps?.filterCategory === activeFilter);


$: if (!selectedDate) {
	selectedDateEvents = [];
} else {
	const targetDate = selectedDate;
	selectedDateEvents = filteredEvents.filter((event) => event.start.startsWith(targetDate));
}

const updateCalendarEvents = () => {
	if (!calendar) return;
	const nextEvents = filteredEvents.map(transformEvent);
	calendar.removeAllEvents();
	nextEvents.forEach((eventData) => {
		calendar.addEvent(eventData);
	});
	calendar.render();
};

	const initialiseCalendar = () => {
	if (!calendarEl) return;

	calendar = new Calendar(calendarEl, {
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
		events: filteredEvents.map(transformEvent),
		initialDate,
		dateClick: (info: DateClickArg) => {
			selectedDate = info.dateStr;
		},
		eventClick: (info: EventClickArg) => {
			if (info.event.url) return;
			info.jsEvent?.preventDefault?.();
		}
	});

	calendar.render();
};

onMount(() => {
	filteredEvents = computeFilteredEvents();
	initialiseCalendar();
});

	onDestroy(() => {
		calendar?.destroy();
		calendar = null;
	});

let filteredEvents: CalendarEvent[] = events;
</script>

<div class="calendar-pane">
	<section class="calendar-intro">
		<div>
			<h2>경제 이벤트 캘린더</h2>
			<p>전 세계 주요 경제 이벤트를 일정으로 확인하고, 발표 일정을 미리 준비하세요.</p>
		</div>
		<div class="filter-group" role="toolbar" aria-label="이벤트 분류 필터">
			{#each filterOptions as option}
		<button
			type="button"
			class="filter-button"
			class:active={activeFilter === option.id}
			on:click={() => {
		activeFilter = option.id;
		selectedDate = null;
		filteredEvents = computeFilteredEvents();
		updateCalendarEvents();
			}}
		>
					<span>{option.label}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="calendar-surface">
		<div class="calendar-container">
			<div bind:this={calendarEl} class="calendar-element"></div>
		</div>

		{#if selectedDate && selectedDateEvents.length > 0}
			<div class="selected-events">
				<header>
					<strong>{new Date(selectedDate).toLocaleDateString('ko-KR')}</strong>
					<span>{selectedDateEvents.length}건 예정</span>
				</header>
				<ul>
					{#each selectedDateEvents as event}
				<li>
					<div class="event-main">
						<span class="color-chip" style={`background:${resolveEventColor(event)};`}></span>
								<div class="event-body">
									<strong>{stripTimeFromTitle(event.title)}</strong>
									<span class="meta">
										{buildEventMeta(event)}
										{#if formatEventTime(event)}
											· {formatEventTime(event)}
										{/if}
									</span>
								</div>
							</div>
							{#if event.url}
								<a href={event.url} target="_blank" rel="noopener noreferrer">자세히 보기</a>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{:else if selectedDate}
			<div class="empty-events">
				<p>선택한 날짜에는 예정된 이벤트가 없습니다.</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.calendar-pane {
		display: grid;
		gap: 20px;
		color: var(--c-text-primary);
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.calendar-intro {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--c-border-strong);
		background: var(--c-bg-800);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.calendar-surface {
		display: grid;
		gap: 16px;
		padding: 20px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--c-border-strong);
		background: var(--c-bg-800);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

	.calendar-container :global(.fc) {
		--fc-border-color: var(--c-bg-700);
		--fc-page-bg-color: transparent;
		--fc-neutral-bg-color: var(--c-bg-900);
		--fc-list-event-hover-bg-color: var(--c-bg-700);
		--fc-today-bg-color: var(--c-bg-700);
		color: var(--c-text-primary);
		font-family: 'Inter', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	.calendar-container :global(.fc .fc-toolbar-title) {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--c-text-primary);
	}

	.calendar-container :global(.fc .fc-button) {
		background: var(--c-bg-700);
		border: 1px solid var(--c-border-soft);
		color: var(--c-text-primary);
		border-radius: var(--radius-sm);
		padding: 6px 12px;
		transition: all 0.2s ease;
	}

	.calendar-container :global(.fc .fc-button:hover),
	.calendar-container :global(.fc .fc-button:focus-visible) {
		background: var(--c-surface-hover);
		color: var(--c-text-primary);
		border-color: var(--c-border-hover);
	}

	.calendar-container :global(.fc .fc-daygrid-day-number) {
		color: var(--c-text-secondary);
		font-weight: 500;
	}

	.calendar-container :global(.fc .fc-col-header-cell) {
		color: var(--c-text-muted);
		font-weight: 600;
	}

	.calendar-container :global(.fc-daygrid-event) {
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
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

	@media (max-width: 880px) {
		.calendar-pane {
			padding: 16px;
		}

		.calendar-intro {
			padding: 20px;
		}

		.calendar-surface {
			padding: 16px;
		}

		.calendar-element {
			min-height: 450px;
		}
	}
</style>
