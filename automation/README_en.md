# Automation

Automated tests for [PomidorQA](https://aiqa.su/pomidorqa), a short-call service for QA and IT professionals. A participant registers, lists their skills and open slots, and others find them in the catalog and book a meeting.

This directory contains the tests and supporting automation code, written in TypeScript with Playwright. Dependencies and configuration files live at the repository root, so `npm` commands are run from the root directory.

## Documentation

| Path | Contents |
|---|---|
| [`requirements_en.md`](requirements_en.md) | PomidorQA requirements specification: product purpose, MVP scope, roles, and functional requirements. |
| [`traceability-matrix_en.md`](traceability-matrix_en.md) | Traceability matrix from requirements to automated tests: pyramid level (unit, API, E2E) and automation status. |

## Planned structure

- `tests/unit/` — unit tests.
- `tests/api/` — API tests.
- `tests/e2e/` — end-to-end tests.
- `pages/` — Page Object models.
- `fixtures/` — reusable Playwright fixtures.
- `test-data/` — test data.
- `helpers/` — helper functions.

## Environment setup

```bash
npm ci
npx playwright install chromium
```

Configuration check:

```bash
npm run check
```
