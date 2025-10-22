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
	<header class="window__header" on:pointerdown={handleDragStart}>
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
		background: #282a2c;
		border-radius: 8px;
		border: 1px solid #3b3b3b;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		color: #e5e5e5;
		overflow: hidden;
	}

	.window__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 18px;
		background: #222222;
		border-bottom: 1px solid #3b3b3b;
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
		color: #ffffff;
	}

	.window__info span {
		font-size: 0.75rem;
		color: #b0b0b0;
	}

	.window__close {
		background: transparent;
		border: none;
		color: #b0b0b0;
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
		background: #3b3b3b;
		color: #ffffff;
	}

	.window__body {
		flex: 1;
		overflow: auto;
		background: #222222;
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
		border-right: 2px solid rgba(255, 255, 255, 0.35);
		border-bottom: 2px solid rgba(255, 255, 255, 0.35);
		border-radius: 0 0 4px 0;
	}
</style>
