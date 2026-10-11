import type { Config } from "jest";

const config: Config = {
	testEnvironment: "node",
	clearMocks: true,
	restoreMocks: true,
	maxWorkers: 2,
	testMatch: ["<rootDir>/src/**/*.test.ts"],
	moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
	transform: {
		"^.+\\.tsx?$": ["ts-jest", {
			tsconfig: {
				module: "CommonJS",
				moduleResolution: "Node",
				jsx: "react-jsx",
				esModuleInterop: true,
			},
		}],
	},
	collectCoverageFrom: [
		"src/lib/auth-api.ts",
		"src/lib/auth-storage.ts",
		"src/lib/api-request.ts",
		"src/lib/backend-api.ts",
		"src/app/api/auth/login/route.ts",
	],
	coverageDirectory: "coverage",
	coverageThreshold: {
		global: { statements: 70, branches: 70, functions: 70, lines: 70 },
	},
};

export default config;
