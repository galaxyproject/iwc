# End-to-End Tests

This directory contains end-to-end tests using Playwright for the IWC website.

## Running Tests Locally

To run the E2E tests locally:

1. First ensure you have built the site:

    ```bash
    npm run generate
    ```

2. Run the tests:
    ```bash
    npm run e2e
    ```

This will:

- Start a preview server
- Run the Playwright tests against it
- Generate an HTML report with test results

## Available Tests

- `basic.spec.js`: Verifies that the homepage and workflow pages load correctly

## Adding New Tests

To add new tests:

1. Create a new `.spec.js` file in this directory
2. Follow the Playwright test format
3. Run tests with `npm run e2e`

## Viewing Test Reports

After running tests, an HTML report is available at `playwright-report/index.html`
