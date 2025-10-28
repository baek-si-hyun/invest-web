<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	const DEFAULT_MIN_WIDTH = 240;
	const DEFAULT_MIN_HEIGHT = 180;

	export let title: string;
	export let subtitle: string | null = null;
	export let position = { x: 24, y: 120 };
	export let size = { width: 360, height: 260 };
	export let zIndex = 1;
	export let lockedTop = 72;
	export let minWidth = DEFAULT_MIN_WIDTH;
	export let minHeight = DEFAULT_MIN_HEIGHT;
	export let bodyPadding = 18;

	const dispatch = createEventDispatcher<{
		move: { x: number; y: number };
		resize: { width: number; height: number };
		focus: void;
		close: void;
	}>();

	let viewport = { width: 0, height: 0 };

	const updateViewport = () => {
		if (!browser) return;
		viewport = { width: window.innerWidth, height: window.innerHeight };
	};

	const clampWithinViewport = (x: number, y: number) => {
		if (!viewport.width || !viewport.height) return { x, y };
		const maxX = Math.max(0, viewport.width - size.width);
		const maxY = Math.max(lockedTop, viewport.height - size.height);
		return {
			x: Math.min(Math.max(0, x), maxX),
			y: Math.min(Math.max(lockedTop, y), maxY)
		};
	};

	let dragging = false;
	let dragStart = { x: 0, y: 0 };
	let origin = { x: 0, y: 0 };

	const handleDragStart = (event: PointerEvent) => {
		event.preventDefault();
		dragging = true;
		origin = { x: position.x, y: position.y };
		dragStart = { x: event.clientX, y: event.clientY };
		(event.target as HTMLElement).setPointerCapture(event.pointerId);
		dispatch('focus');
	};

	// 터치 이벤트 핸들러
	const handleTouchStart = (event: TouchEvent) => {
		event.preventDefault();
		if (event.touches.length === 1) {
			const touch = event.touches[0];
			const pointerEvent = new PointerEvent('pointerdown', {
				clientX: touch.clientX,
				clientY: touch.clientY,
				pointerId: touch.identifier,
				pointerType: 'touch'
			});
			handleDragStart(pointerEvent);
		}
	};

	const handleTouchMove = (event: TouchEvent) => {
		event.preventDefault();
		if (event.touches.length === 1 && dragging) {
			const touch = event.touches[0];
			const pointerEvent = new PointerEvent('pointermove', {
				clientX: touch.clientX,
				clientY: touch.clientY,
				pointerId: touch.identifier,
				pointerType: 'touch'
			});
			handleDragMove(pointerEvent);
		}
	};

	const handleTouchEnd = (event: TouchEvent) => {
		event.preventDefault();
		if (dragging) {
			const pointerEvent = new PointerEvent('pointerup', {
				pointerId: event.changedTouches[0]?.identifier || 0,
				pointerType: 'touch'
			});
			handleDragEnd(pointerEvent);
		}
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
		let nextWidth = Math.max(minWidth, resizeOrigin.width + (event.clientX - resizeStart.x));
		let nextHeight = Math.max(minHeight, resizeOrigin.height + (event.clientY - resizeStart.y));

		if (viewport.width) {
			const maxWidth = Math.max(minWidth, viewport.width - position.x);
			nextWidth = Math.min(nextWidth, maxWidth);
		}
		if (viewport.height) {
			const maxHeight = Math.max(minHeight, viewport.height - position.y);
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

	onMount(() => {
		updateViewport();
		if (browser) window.addEventListener('resize', updateViewport);
	});

	onDestroy(() => {
		if (browser) window.removeEventListener('resize', updateViewport);
	});

	$: {
		const clamped = clampWithinViewport(position.x, position.y);
		if (clamped.x !== position.x || clamped.y !== position.y) {
			position = clamped;
			dispatch('move', clamped);
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
		on:touchstart={handleTouchStart}
		on:touchmove={handleTouchMove}
		on:touchend={handleTouchEnd}
	>
		<div class="window__info">
			<strong>{title}</strong>
			{#if subtitle}
				<span>{subtitle}</span>
			{/if}
		</div>
		<button class="window__close" on:click|stopPropagation={handleClose} aria-label="Close window">
			✕
		</button>
	</header>

	<div class="window__body" style={`padding:${bodyPadding}px;`}>
		<slot />
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
		box-shadow: 0 8px 24px var(--c-overlay-strong);
		color: var(--c-text-primary);
		overflow: hidden;
	}

	.window__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 18px;
		background: var(--c-bg-900);
		border-bottom: 1px solid var(--c-border-strong);
		gap: 12px;
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
		gap: 4px;
	}

	.window__info strong {
		font-size: 0.98rem;
		font-weight: 600;
		color: var(--c-text-primary);
	}

	.window__info span {
		font-size: 0.75rem;
		color: var(--c-text-muted);
	}

	.window__close {
		background: transparent;
		border: none;
		color: var(--c-text-muted);
		font-size: 0.95rem;
		width: 26px;
		height: 26px;
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
		overflow: auto;
		background: var(--c-bg-900);
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

	/* 반응형 디자인 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		.window {
			min-width: 360px;
			min-height: 260px;
		}
		
		.window__header {
			padding: 14px 20px;
		}
		
		.window__info strong {
			font-size: 1.05rem;
		}
		
		.window__info span {
			font-size: 0.8rem;
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.window {
			min-width: 340px;
			min-height: 240px;
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.window {
			min-width: 320px;
			min-height: 220px;
		}
		
		.window__header {
			padding: 12px 16px;
		}
		
		.window__info strong {
			font-size: 0.95rem;
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.window {
			min-width: 300px;
			min-height: 200px;
		}
		
		.window__header {
			padding: 10px 14px;
		}
		
		.window__info strong {
			font-size: 0.9rem;
		}
		
		.window__info span {
			font-size: 0.7rem;
		}
		
		.window__close {
			width: 28px;
			height: 28px;
			font-size: 1rem;
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		.window {
			min-width: 280px;
			min-height: 180px;
		}
		
		.window__header {
			padding: 8px 12px;
		}
		
		.window__info strong {
			font-size: 0.85rem;
		}
		
		.window__info span {
			font-size: 0.65rem;
		}
		
		.window__close {
			width: 32px;
			height: 32px;
			font-size: 1.1rem;
		}
		
		.window__resize-handle {
			width: 24px;
			height: 24px;
			right: 4px;
			bottom: 4px;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.window {
			min-width: 260px;
			min-height: 160px;
		}
		
		.window__header {
			padding: 6px 10px;
		}
		
		.window__info strong {
			font-size: 0.8rem;
		}
		
		.window__info span {
			font-size: 0.6rem;
		}
		
		.window__close {
			width: 36px;
			height: 36px;
			font-size: 1.2rem;
		}
		
		.window__resize-handle {
			width: 28px;
			height: 28px;
			right: 2px;
			bottom: 2px;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.window {
			min-width: 240px;
			min-height: 140px;
		}
		
		.window__header {
			padding: 4px 8px;
		}
		
		.window__info strong {
			font-size: 0.75rem;
		}
		
		.window__info span {
			font-size: 0.55rem;
		}
		
		.window__close {
			width: 40px;
			height: 40px;
			font-size: 1.3rem;
		}
		
		.window__resize-handle {
			width: 32px;
			height: 32px;
			right: 1px;
			bottom: 1px;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.window__close {
			min-width: 44px;
			min-height: 44px;
		}
		
		.window__resize-handle {
			min-width: 44px;
			min-height: 44px;
		}
		
		.window__header {
			cursor: default;
		}
		
		.window__header:active {
			cursor: default;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.window__info strong {
			font-weight: 700;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		.window {
			box-shadow: 0 8px 32px var(--c-overlay-strong);
		}
	}

	/* 모바일에서 창 크기 제한 */
	@media (max-width: 768px) {
		.window {
			max-width: calc(100vw - 16px);
			max-height: calc(100vh - 100px);
		}
	}

	/* 매우 작은 화면에서 전체 화면 모드 */
	@media (max-width: 480px) {
		.window {
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			width: 100vw !important;
			height: 100vh !important;
			transform: none !important;
			border-radius: 0;
			z-index: 9999 !important;
		}
		
		.window__resize-handle {
			display: none;
		}
	}
</style>
