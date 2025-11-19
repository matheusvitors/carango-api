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
		env: loadEnv(mode, process.cwd(), ""),
		setupFiles: "./__tests__/setup.ts",
		// isolate: true,
		pool: "forks",
		testTimeout: 25000,
		hookTimeout: 15000
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
	},
}));
