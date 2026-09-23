# Automation

Automated tests for [PomidorQA](https://aiqa.su/pomidorqa), a short-call service for QA and IT professionals. A participant registers, lists their skills and open slots, and others find them in the catalog and book a meeting.

This directory contains the tests and supporting automation code, written in TypeScript with Playwright. Dependencies and configuration files live at the repository root, so `npm` commands are run from the root directory.

## Planned structure

- `tests/unit/` — unit tests.
- `tests/api/` — API tests.
- `tests/e2e/` — end-to-end tests.
- `pages/` — Page Object models.
- `fixtures/` — reusable Playwright fixtures.
- `test-data/` — test data.
- `utils/` — helper functions.

## Environment setup

```bash
npm ci
npx playwright install chromium
```

Configuration check:

```bash
npm run check
```
