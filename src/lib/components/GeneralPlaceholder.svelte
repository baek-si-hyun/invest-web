<script lang="ts">
	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<section class="placeholder">
	<h2>{title}</h2>
	<p>{description}</p>
</section>

<style>
	.placeholder {
		display: grid;
		gap: 12px;
		padding: 52px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--c-border-strong);
		background: var(--c-bg-800);
		color: var(--c-text-primary);
		text-align: center;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		max-width: 1240px;
		margin: 0 auto;
		width: 100%;
	}

	.placeholder h2 {
		margin: 0;
		font-size: 1.45rem;
		letter-spacing: 0.02em;
	}

	.placeholder p {
		margin: 0;
		font-size: 0.94rem;
		color: var(--c-text-muted);
		line-height: 1.6;
	}
</style>
