/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    webServer: {
        command: "npm run preview",
        port: 4321,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
    testDir: "./tests/e2e",
    use: {
        baseURL: "http://localhost:4321",
    },
    reporter: process.env.CI ? "github" : "html",
};

export default config;
