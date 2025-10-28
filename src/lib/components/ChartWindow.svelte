<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { Instrument } from '$lib/data/instruments';

	const MIN_WIDTH = 220;
	const MIN_HEIGHT = 160;
	const EDGE_PADDING = 0;

	let tradingViewScriptPromise: Promise<void> | null = null;

const loadTradingViewScript = () => {
	if (!browser) return Promise.resolve();
	if ((window as typeof window & { TradingView?: unknown }).TradingView) return Promise.resolve();

		if (!tradingViewScriptPromise) {
			tradingViewScriptPromise = new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = 'https://s3.tradingview.com/tv.js';
				script.async = true;
				script.onload = () => resolve();
				script.onerror = () => reject(new Error('TradingView script failed to load'));
				document.head.appendChild(script);
			});
		}

	return tradingViewScriptPromise;
};

	export let instrument: Instrument;
	export let position = { x: 24, y: 120 };
	export let size = { width: 360, height: 240 };
	export let zIndex = 1;
	export let lockedTop = 72; // prevent dragging over the nav

	const dispatch = createEventDispatcher<{
		move: { x: number; y: number };
		resize: { width: number; height: number };
		focus: void;
		close: void;
	}>();

	const containerId = `tv-widget-${Math.random().toString(36).slice(2, 10)}`;
	let containerElement: HTMLDivElement | null = null;
	type TradingViewWidget = {
		remove?: () => void;
		resize?: (width?: number, height?: number) => void;
		onChartReady?: (callback: () => void) => void;
	};

	let widget: TradingViewWidget | null = null;
	let widgetSymbolLoaded: string | null = null;
	let loadingWidget = false;
	let loadError: string | null = null;

	let viewport = { width: 0, height: 0 };

	const updateViewport = () => {
		if (!browser) return;
		viewport = { width: window.innerWidth, height: window.innerHeight };
	};

	const clampWithinViewport = (x: number, y: number) => {
		if (!viewport.width || !viewport.height) return { x, y };
		const maxX = Math.max(EDGE_PADDING, viewport.width - size.width - EDGE_PADDING);
		const maxY = Math.max(lockedTop, viewport.height - size.height - EDGE_PADDING);
		return {
			x: Math.min(Math.max(EDGE_PADDING, x), maxX),
			y: Math.min(Math.max(lockedTop, y), maxY)
		};
	};

	let dragStart = { x: 0, y: 0 };
	let origin = { x: 0, y: 0 };
	let dragging = false;

	const handleDragStart = (event: PointerEvent) => {
		event.preventDefault();
		dragging = true;
		origin = { x: position.x, y: position.y };
		dragStart = { x: event.clientX, y: event.clientY };
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		dispatch('focus');
	};

	const handleDragMove = (event: PointerEvent) => {
		if (!dragging) return;
		const nextX = origin.x + (event.clientX - dragStart.x);
		const nextY = origin.y + (event.clientY - dragStart.y);
		const clamped = clampWithinViewport(nextX, nextY);
		position = clamped;
		dispatch('move', clamped);
	};

	const handleDragEnd = (event: PointerEvent) => {
		if (!dragging) return;
		dragging = false;
		(event.target as HTMLElement).releasePointerCapture(event.pointerId);
	};

	let resizing = false;
	let resizeStart = { x: 0, y: 0 };
	let resizeOrigin = { width: 0, height: 0 };

	const handleResizeStart = (event: PointerEvent) => {
		event.preventDefault();
		resizing = true;
		resizeOrigin = { width: size.width, height: size.height };
		resizeStart = { x: event.clientX, y: event.clientY };
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		dispatch('focus');
	};

	const handleResizeMove = (event: PointerEvent) => {
		if (!resizing) return;
		let nextWidth = Math.max(MIN_WIDTH, resizeOrigin.width + (event.clientX - resizeStart.x));
		let nextHeight = Math.max(MIN_HEIGHT, resizeOrigin.height + (event.clientY - resizeStart.y));

		if (viewport.width) {
			const maxWidth = Math.max(MIN_WIDTH, viewport.width - position.x - EDGE_PADDING);
			nextWidth = Math.min(nextWidth, maxWidth);
		}
		if (viewport.height) {
			const maxHeight = Math.max(MIN_HEIGHT, viewport.height - position.y - EDGE_PADDING);
			nextHeight = Math.min(nextHeight, maxHeight);
		}

		size = { width: nextWidth, height: nextHeight };
		dispatch('resize', size);
	};

	const handleResizeEnd = (event: PointerEvent) => {
		if (!resizing) return;
		resizing = false;
		(event.target as HTMLElement).releasePointerCapture(event.pointerId);
	};

	const handleClose = () => {
		dispatch('close');
	};

	const ensureWidget = async () => {
		if (!browser || !containerElement) return;

		if (!instrument.tradingViewSymbol) {
			if (widget?.remove) widget.remove();
			widget = null;
			widgetSymbolLoaded = null;
			loadError = '트레이딩뷰 심볼이 설정되지 않았습니다.';
			return;
		}

		if (loadingWidget) return;
		if (widgetSymbolLoaded === instrument.tradingViewSymbol) return;

		loadingWidget = true;
		loadError = null;

		try {
			// 기존 위젯 안전하게 제거
			if (widget?.remove) {
				try {
					widget.remove();
					console.log('Previous TradingView widget removed');
				} catch (error) {
					console.warn('Error removing previous widget:', error);
				}
				widget = null;
			}

			// 컨테이너 정리
			if (containerElement) {
				try {
					containerElement.innerHTML = '';
					console.log('Container cleared for new widget');
				} catch (error) {
					console.warn('Error clearing container:', error);
				}
			}

			await loadTradingViewScript();

			const tvGlobal = (window as typeof window & {
				TradingView?: {
					widget?: new (options: Record<string, unknown>) => TradingViewWidget;
				};
			}).TradingView;

			if (!tvGlobal?.widget) {
				throw new Error('TradingView widget factory missing');
			}

			widget = new tvGlobal.widget({
				container_id: containerId,
				symbol: instrument.tradingViewSymbol,
				interval: instrument.tradingViewInterval ?? '60',
				timezone: 'Etc/UTC',
				theme: 'dark',
				style: '1',
				locale: 'kr',
				autosize: true,
				hide_top_toolbar: false,
				hide_legend: false,
				allow_symbol_change: false,
				save_image: false,
				withdateranges: true
			});

			widgetSymbolLoaded = instrument.tradingViewSymbol;
			if (widget?.onChartReady) {
				widget.onChartReady(() => {
					loadingWidget = false;
					loadError = null;
				});
			} else {
				loadingWidget = false;
			}
		} catch (error) {
			console.error('Failed to initialise TradingView widget', error);
			loadError = '트레이딩뷰 차트를 불러오지 못했습니다.';
			loadingWidget = false;
		}
	};

	onMount(() => {
		updateViewport();
		if (browser) window.addEventListener('resize', updateViewport);
		ensureWidget();
	});

	onDestroy(() => {
		console.log('ChartWindow onDestroy called for instrument:', instrument?.name);
		
		if (browser) {
			window.removeEventListener('resize', updateViewport);
		}
		
		// TradingView 위젯 안전하게 정리
		if (widget?.remove) {
			try {
				widget.remove();
				console.log('TradingView widget removed successfully');
			} catch (error) {
				console.warn('Error removing TradingView widget:', error);
			}
		}
		
		// 컨테이너 정리
		if (containerElement) {
			try {
				containerElement.innerHTML = '';
				console.log('Container element cleared');
			} catch (error) {
				console.warn('Error clearing container element:', error);
			}
		}
		
		// 상태 초기화
		widget = null;
		widgetSymbolLoaded = null;
		loadingWidget = false;
		loadError = null;
	});

	$: {
		try {
			const clamped = clampWithinViewport(position.x, position.y);
			if (clamped.x !== position.x || clamped.y !== position.y) {
				position = clamped;
				dispatch('move', clamped);
			}
		} catch (error) {
			console.warn('Error in position clamping:', error);
		}
	}

	$: if (browser && containerElement && !loadingWidget) {
		try {
			void ensureWidget();
		} catch (error) {
			console.warn('Error in ensureWidget reactive statement:', error);
		}
	}

	$: if (widget?.resize && !loadingWidget) {
		try {
			widget.resize(size.width, size.height);
		} catch (error) {
			console.warn('Error resizing widget:', error);
		}
	}

</script>

<section
	class="window"
	style={`transform: translate3d(${position.x}px, ${position.y}px, 0); width: ${size.width}px; height: ${size.height}px; z-index: ${zIndex};`}
	on:pointermove={handleDragMove}
	on:pointerup={handleDragEnd}
	on:pointerleave={handleDragEnd}
	on:pointerdown={() => dispatch('focus')}
>
	<header
		class="window__header"
		on:pointerdown={handleDragStart}
	>
		<div class="window__info">
			<strong>{instrument.name}</strong>
			<span>{instrument.symbol}</span>
		</div>
		<button class="window__close" on:click|stopPropagation={handleClose} aria-label="Close chart">
			✕
		</button>
	</header>

	<div class="window__body">
		<div class="chart-container" id={containerId} bind:this={containerElement}></div>
		{#if loadingWidget}
			<div class="chart-overlay">
				<span>차트를 불러오는 중...</span>
			</div>
		{:else if loadError}
			<div class="chart-overlay error">
				<span>{loadError}</span>
			</div>
		{/if}
	</div>

	<div
		class="window__resize-handle"
		on:pointerdown={handleResizeStart}
		on:pointermove={handleResizeMove}
		on:pointerup={handleResizeEnd}
		on:pointerleave={handleResizeEnd}
	>
		<span></span>
	</div>
</section>

<style>
	.window {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		background: var(--c-bg-800);
		border-radius: var(--radius-md);
		border: 1px solid var(--c-border-strong);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		color: var(--c-text-primary);
		overflow: hidden;
		cursor: default;
	}

	.window__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 14px;
		gap: 12px;
		background: var(--c-bg-900);
		border-bottom: 1px solid var(--c-border-strong);
		cursor: grab;
		user-select: none;
	}

	.window__header:active {
		cursor: grabbing;
	}

	.window__info {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.window__info strong {
		font-size: 0.95rem;
		font-weight: 600;
	}

	.window__info span {
		font-size: 0.7rem;
		color: var(--c-text-muted);
	}

	.window__close {
		background: transparent;
		border: none;
		color: var(--c-text-muted);
		font-size: 0.9rem;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.window__close:hover {
		background: var(--c-bg-700);
		color: var(--c-text-primary);
	}

	.window__body {
		flex: 1;
		position: relative;
		padding: 0;
	}

	.chart-container {
		position: absolute;
		inset: 0;
	}

	.chart-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: var(--c-bg-900);
		color: var(--c-text-primary);
		font-size: 0.85rem;
		text-align: center;
		padding: 0 12px;
	}

	.chart-overlay span {
		max-width: 280px;
		line-height: 1.4;
	}

	.chart-overlay.error {
		background: var(--c-bg-700);
		color: #ff6b6b;
	}

	.window__resize-handle {
		position: absolute;
		right: 8px;
		bottom: 8px;
		width: 18px;
		height: 18px;
		cursor: nwse-resize;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}

	.window__resize-handle span {
		width: 100%;
		height: 100%;
		border-right: 2px solid var(--c-border-hover);
		border-bottom: 2px solid var(--c-border-hover);
		border-radius: 0 0 4px 0;
	}
</style>
