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
		box-shadow: 0 8px 24px var(--c-overlay-strong);
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

	/* 반응형 브레이크포인트 */
	/* Large Desktop: 1440px+ */
	@media (min-width: 1440px) {
		.placeholder {
			padding: 64px;
			max-width: 1400px;
		}
		
		.placeholder h2 {
			font-size: 1.75rem;
		}
		
		.placeholder p {
			font-size: 1.1rem;
		}
	}

	/* Desktop: 1200px - 1439px */
	@media (max-width: 1439px) and (min-width: 1200px) {
		.placeholder {
			padding: 56px;
			max-width: 1200px;
		}
		
		.placeholder h2 {
			font-size: 1.6rem;
		}
		
		.placeholder p {
			font-size: 1rem;
		}
	}

	/* Tablet Landscape: 1024px - 1199px */
	@media (max-width: 1199px) and (min-width: 1024px) {
		.placeholder {
			padding: 48px;
			max-width: 1000px;
		}
		
		.placeholder h2 {
			font-size: 1.4rem;
		}
		
		.placeholder p {
			font-size: 0.95rem;
		}
	}

	/* Tablet Portrait: 768px - 1023px */
	@media (max-width: 1023px) and (min-width: 768px) {
		.placeholder {
			padding: 40px;
			max-width: 800px;
		}
		
		.placeholder h2 {
			font-size: 1.25rem;
		}
		
		.placeholder p {
			font-size: 0.9rem;
		}
	}

	/* Mobile Landscape: 640px - 767px */
	@media (max-width: 767px) and (min-width: 640px) {
		.placeholder {
			padding: 32px;
			border-radius: 16px;
		}
		
		.placeholder h2 {
			font-size: 1.125rem;
		}
		
		.placeholder p {
			font-size: 0.85rem;
		}
	}

	/* Mobile Portrait: 480px - 639px */
	@media (max-width: 639px) and (min-width: 480px) {
		.placeholder {
			padding: 28px;
			border-radius: 12px;
		}
		
		.placeholder h2 {
			font-size: 1rem;
		}
		
		.placeholder p {
			font-size: 0.8rem;
		}
	}

	/* Small Mobile: 320px - 479px */
	@media (max-width: 479px) {
		.placeholder {
			padding: 24px;
			border-radius: 8px;
		}
		
		.placeholder h2 {
			font-size: 0.9rem;
		}
		
		.placeholder p {
			font-size: 0.75rem;
		}
	}

	/* 터치 디바이스 최적화 */
	@media (hover: none) and (pointer: coarse) {
		.placeholder {
			padding: 32px 24px;
		}
	}

	/* 고해상도 디스플레이 */
	@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
		.placeholder h2 {
			font-weight: 700;
		}
	}

	/* 다크 모드 최적화 */
	@media (prefers-color-scheme: dark) {
		.placeholder {
			background: var(--c-bg-800);
			border-color: var(--c-border-strong);
		}
	}
</style>
