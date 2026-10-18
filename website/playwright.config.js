const port = parseInt(process.env.PLAYWRIGHT_PORT || "4321", 10);

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    webServer: {
        command: `npm run preview -- --port ${port}`,
        port: port,
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
    },
    testDir: "./tests/e2e",
    use: {
        baseURL: `http://localhost:${port}`,
    },
    projects: [
        {
            name: "desktop",
            use: { viewport: { width: 1280, height: 720 } },
        },
        {
            name: "mobile",
            use: { viewport: { width: 390, height: 844 }, isMobile: true },
        },
    ],
    reporter: process.env.CI ? "github" : "html",
};

export default config;
