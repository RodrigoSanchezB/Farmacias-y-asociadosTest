/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",              // Usa ts-jest para transformar TS + JSX
  testEnvironment: "jsdom",       // Simula entorno navegador
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Archivo para jest-dom y fetch
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",  // Transformador para TS y TSX
  },
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // mock CSS imports si tienes
    "^@supabase/ssr$": "<rootDir>/src/__mocks__/@supabase/ssr.ts",
  },
};
