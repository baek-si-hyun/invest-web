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
		border-radius: 12px;
		border: 1px solid #3b3b3b;
		background: #282a2c;
		color: #e5e5e5;
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
		color: #b0b0b0;
		line-height: 1.6;
	}
</style>
