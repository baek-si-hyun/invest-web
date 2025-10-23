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
</style>
