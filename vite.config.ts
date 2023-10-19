import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	esbuild: {
		drop: ['console', 'debugger']
	},
	plugins: [UnoCSS(), sveltekit()]
});
