import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			external: ["uuid"],
		},
	},
	server: {
		proxy: {
			"/frostDates": {
				target: "https://freshtomatoes.netlify.app",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
