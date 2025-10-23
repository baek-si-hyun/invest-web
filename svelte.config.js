import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';
const rawBase = process.env.GH_PAGES_BASE?.trim() ?? '';
const normalizedBase = rawBase
	? '/' + rawBase.replace(/^\/+/, '').replace(/\/+$/, '')
	: '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),
		paths: {
			base: dev ? '' : normalizedBase
		},
		prerender: {
			entries: ['*']
		}
	}
};

export default config;
