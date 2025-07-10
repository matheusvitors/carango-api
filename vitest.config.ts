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
		// setupFiles: ["dotenv/config"],
		env: loadEnv(mode, process.cwd(), ''),
	},
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
	},
}));
