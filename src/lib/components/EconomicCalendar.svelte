<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';

	import { economicEvents } from '$lib/data/economicEvents';

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

	const events: CalendarEvent[] = economicEvents.map((event) => ({
		id: event.id,
		title: `${event.time} · ${event.title}`,
		start: `${event.date}T${event.time}`,
		url: event.source,
		allDay: false,
		extendedProps: {
			indicator: event.indicator,
			relatedThemes: event.relatedThemes,
			country: event.country,
			filterCategory: event.filterCategory
		}
	}));

	// 디버깅: 첫 번째 이벤트의 filterCategory 확인
	console.log('Total events loaded:', events.length);
	console.log('First event filterCategory:', events[0]?.extendedProps?.filterCategory);
	console.log('Sample events with filterCategory:', events.slice(0, 5).map(e => ({
		title: e.title,
		filterCategory: e.extendedProps?.filterCategory
	})));
	console.log('All filterCategories in events:', events.map(e => e.extendedProps?.filterCategory).filter(Boolean));


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

	const computeFilteredEvents = () => {
		console.log('computeFilteredEvents called with activeFilter:', activeFilter);
		if (activeFilter === 'all') {
			console.log('Showing all events:', events.length);
			return events;
		}
		const filtered = events.filter((event) => {
			const matches = event.extendedProps?.filterCategory === activeFilter;
			if (matches) {
				console.log('Event matches filter:', event.title, 'filterCategory:', event.extendedProps?.filterCategory);
			}
			return matches;
		});
		console.log(`Filtered events for ${activeFilter}:`, filtered.length);
		return filtered;
	};


$: if (!selectedDate) {
	selectedDateEvents = [];
} else {
	const targetDate = selectedDate;
	selectedDateEvents = filteredEvents.filter((event) => event.start.startsWith(targetDate));
}

const updateCalendarEvents = () => {
	if (!calendar) return;
	
	console.log('updateCalendarEvents called, filteredEvents length:', filteredEvents.length);
	const nextEvents = filteredEvents.map(transformEvent);
	console.log('nextEvents length:', nextEvents.length);
	
	// 기존 이벤트 제거 후 새 이벤트 추가
	calendar.removeAllEvents();
	nextEvents.forEach((eventData) => {
		calendar.addEvent(eventData);
	});
	// rerenderEvents 대신 render 사용
	calendar.render();
	console.log('Calendar events updated');
};

	const initialiseCalendar = () => {
	if (!calendarEl) return;

	console.log('Initializing calendar with filteredEvents:', filteredEvents.length);
	console.log('Sample filteredEvents:', filteredEvents.slice(0, 3));

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
				console.log('Filter button clicked:', option.id);
				activeFilter = option.id;
				selectedDate = null;
				console.log('activeFilter changed to:', activeFilter);
				
				// 직접 필터링 수행
				if (option.id === 'all') {
					filteredEvents = events;
				} else {
					filteredEvents = events.filter((event) => event.extendedProps?.filterCategory === option.id);
				}
				console.log(`Filtered to ${option.id}:`, filteredEvents.length, 'events');
				
				// 캘린더 업데이트
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
		color: #e5e5e5;
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}

	.calendar-intro {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
		border-radius: 12px;
		border: 1px solid #3b3b3b;
		background: #282a2c;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.calendar-intro h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #ffffff;
		letter-spacing: -0.01em;
	}

	.calendar-intro p {
		margin: 0;
		font-size: 0.9rem;
		color: #b0b0b0;
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
		border-radius: 6px;
		border: 1px solid #3b3b3b;
		background: #222222;
		color: #d0d0d0;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.filter-button:hover {
		background: #2a2a2a;
		border-color: #4a4a4a;
		color: #ffffff;
	}

	.filter-button.active {
		background: #3b3b3b;
		border-color: #5a5a5a;
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.calendar-surface {
		display: grid;
		gap: 16px;
		padding: 20px;
		border-radius: 12px;
		border: 1px solid #3b3b3b;
		background: #282a2c;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.calendar-container {
		border-radius: 8px;
		background: #222222;
		border: 1px solid #3b3b3b;
		padding: 12px;
		overflow: hidden;
	}

	.calendar-element {
		min-height: 500px;
	}

	.calendar-container :global(.fc) {
		--fc-border-color: #3b3b3b;
		--fc-page-bg-color: transparent;
		--fc-neutral-bg-color: #2a2a2a;
		--fc-list-event-hover-bg-color: #3a3a3a;
		--fc-today-bg-color: #3b3b3b;
		color: #e5e5e5;
		font-family: 'Inter', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}

	.calendar-container :global(.fc .fc-toolbar-title) {
		font-size: 1.1rem;
		font-weight: 600;
		color: #ffffff;
	}

	.calendar-container :global(.fc .fc-button) {
		background: #3b3b3b;
		border: 1px solid #4a4a4a;
		color: #e5e5e5;
		border-radius: 6px;
		padding: 6px 12px;
		transition: all 0.2s ease;
	}

	.calendar-container :global(.fc .fc-button:hover),
	.calendar-container :global(.fc .fc-button:focus-visible) {
		background: #4a4a4a;
		color: #ffffff;
		border-color: #5a5a5a;
	}

	.calendar-container :global(.fc .fc-daygrid-day-number) {
		color: #d0d0d0;
		font-weight: 500;
	}

	.calendar-container :global(.fc .fc-col-header-cell) {
		color: #b0b0b0;
		font-weight: 600;
	}

	.calendar-container :global(.fc-daygrid-event) {
		border-radius: 4px;
		padding: 3px 6px;
		font-size: 0.75rem;
		border-width: 1px !important;
		border-style: solid !important;
		background: #ffffff !important;
		color: #222222 !important;
		font-weight: 500;
	}

	.selected-events,
	.empty-events {
		border-radius: 8px;
		border: 1px solid #3b3b3b;
		background: #222222;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.selected-events header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid #3b3b3b;
		font-size: 0.8rem;
		color: #b0b0b0;
	}

	.selected-events header strong {
		font-size: 0.9rem;
		color: #ffffff;
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
		border-top: 1px solid #3b3b3b;
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
		color: #ffffff;
	}

	.event-body .meta {
		font-size: 0.75rem;
		color: #b0b0b0;
	}

	.selected-events a {
		font-size: 0.75rem;
		color: #6a9eff;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: all 0.2s ease;
	}

	.selected-events a:hover {
		color: #8bb3ff;
		border-color: #8bb3ff;
	}

	.empty-events {
		padding: 24px;
		text-align: center;
		font-size: 0.85rem;
		color: #b0b0b0;
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
