import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		test: {
			environment: 'jsdom',
			globals: true,
			setupFiles: ['./src/test/setup.ts'],
			env: {
				VITE_API_URL: env.VITE_API_URL,
				VITE_API_KEY: env.VITE_API_KEY,
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
