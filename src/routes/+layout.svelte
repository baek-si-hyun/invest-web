<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
	:global(:root) {
		--c-bg-900: #222222;
		--c-bg-800: #282a2c;
		--c-bg-700: #3b3b3b;
		--c-border-strong: rgba(255, 255, 255, 0.08);
		--c-border-soft: rgba(255, 255, 255, 0.04);
		--c-text-primary: #f5f5f5;
		--c-text-secondary: #c9c9c9;
		--c-text-muted: #a0a0a0;
		--radius-lg: 14px;
		--radius-md: 10px;
		--radius-sm: 6px;
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
</style>
