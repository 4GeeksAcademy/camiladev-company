import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	headers: async () => [
		{
			source: "/:path*",
			headers: [
				{ key: "X-Frame-Options", value: "DENY" },
				{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
			],
		},
	],
	turbopack: {
		root: process.cwd(),
	},
};

export default nextConfig;