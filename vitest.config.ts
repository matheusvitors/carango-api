import { defineConfig } from "vitest/config";
import path from "path";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => ({
	root: ".",
	esbuild: {
		tsconfigRaw: "{}",
	},
	test: {
		clearMocks: true,
		globals: true,
		env: loadEnv(mode, process.cwd(), ''),
		isolate: true,
		setupFiles: './__tests__/setup.ts',
	},
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
	},
}));
