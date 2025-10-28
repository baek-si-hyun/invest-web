<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" />
</svelte:head>

{@render children?.()}

<style>
	:global(:root) {
		--c-bg-900: #222222;
		--c-bg-800: #282a2c;
		--c-bg-700: #3b3b3b;
		--c-border-strong: rgba(255, 255, 255, 0.14);
		--c-border-soft: rgba(255, 255, 255, 0.06);
		--c-border-hover: rgba(255, 255, 255, 0.22);
		--c-surface-hover: rgba(255, 255, 255, 0.08);
		--c-overlay-strong: rgba(255, 255, 255, 0.12);
		--c-overlay-soft: rgba(255, 255, 255, 0.04);
		--c-link: #8bb3ff;
		--c-text-primary: #f5f5f5;
		--c-text-secondary: #d0d0d0;
		--c-text-muted: #a0a0a0;
		--radius-lg: 14px;
		--radius-md: 10px;
		--radius-sm: 6px;
	}

	:global([data-theme='dark']) {
		--c-bg-900: #222222;
		--c-bg-800: #282a2c;
		--c-bg-700: #3b3b3b;
		--c-border-strong: rgba(255, 255, 255, 0.14);
		--c-border-soft: rgba(255, 255, 255, 0.06);
		--c-border-hover: rgba(255, 255, 255, 0.22);
		--c-surface-hover: rgba(255, 255, 255, 0.08);
		--c-overlay-strong: rgba(255, 255, 255, 0.12);
		--c-overlay-soft: rgba(255, 255, 255, 0.04);
		--c-link: #8bb3ff;
		--c-text-primary: #f5f5f5;
		--c-text-secondary: #d0d0d0;
		--c-text-muted: #a0a0a0;
	}

	:global([data-theme='light']) {
		--c-bg-900: #e7e7e9;
		--c-bg-800: #efefef;
		--c-bg-700: #ffffff;
		--c-border-strong: rgba(0, 0, 0, 0.12);
		--c-border-soft: rgba(0, 0, 0, 0.06);
		--c-border-hover: rgba(0, 0, 0, 0.18);
		--c-surface-hover: rgba(0, 0, 0, 0.05);
		--c-overlay-strong: rgba(0, 0, 0, 0.08);
		--c-overlay-soft: rgba(0, 0, 0, 0.03);
		--c-link: #1d4ed8;
		--c-text-primary: #111111;
		--c-text-secondary: #333333;
		--c-text-muted: #555555;
	}


	:global(html, body) {
		background: var(--c-bg-900);
		color: var(--c-text-primary);
		font-family: 'Inter', 'Pretendard', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
		min-height: 100%;
	}

	:global(body) {
		margin: 0;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
	}

	:global(.material-icons-round) {
		font-family: 'Material Icons Round';
		font-weight: normal;
		font-style: normal;
		font-size: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		letter-spacing: normal;
		text-transform: none;
		direction: ltr;
		-webkit-font-feature-settings: 'liga';
		font-feature-settings: 'liga';
	}

	/* 반응형 브레이크포인트 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		:global(.material-icons-round) {
			font-size: 26px;
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		:global(.material-icons-round) {
			font-size: 24px;
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		:global(.material-icons-round) {
			font-size: 22px;
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		:global(.material-icons-round) {
			font-size: 20px;
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		:global(.material-icons-round) {
			font-size: 18px;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		:global(.material-icons-round) {
			font-size: 16px;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		:global(.material-icons-round) {
			font-size: 14px;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		:global(.material-icons-round) {
			min-width: 44px;
			min-height: 44px;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		:global(.material-icons-round) {
			font-weight: 500;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		:global(html, body) {
			background: var(--c-bg-900);
			color: var(--c-text-primary);
		}
	}
</style>
