import {
	defineConfig
} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.js',
			name: 'SwaptoXWidget',
			fileName: 'swaptox-widget',
			formats: ['es', 'iife']
		},
		// 把 Lit 打包进去，确保用户开箱即用
		rollupOptions: {
			external: []
		}
	},
	server: {
		port: 3001,
		strictPort: true,
		open: true,
		host: '0.0.0.0'
	}
});