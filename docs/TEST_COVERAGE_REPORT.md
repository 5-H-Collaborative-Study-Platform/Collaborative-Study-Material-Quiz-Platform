# Test Coverage Report
**Project:** Collaborative Study Material & Quiz Platform (CSMQP) — Group 5
**Scope:** Backend application code (routes, models, middleware)
**Test runner:** Jest + Supertest + mongodb-memory-server
**Command:** `npm run coverage`  (from the `server/` folder)

## Summary

| Metric      | Coverage |
|-------------|----------|
| Statements  | 93.65%   |
| Branches    | 90.57%   |
| Functions   | 100%     |
| Lines       | 94.16%   |
| Total tests | 88 passing (26 suites) |

## Per-area breakdown

| Area               | Statements | Branches | Functions | Lines |
|--------------------|-----------|----------|-----------|-------|
| middleware (auth, upload) | 100%  | 100% | 100% | 100% |
| models (6 schemas)        | 100%  | 100% | 100% | 100% |
| routes (7 route files)    | 92.41%| 90%  | 100% | 93.03%|

## What is measured

Coverage is scoped to the application logic — the Express **routes**, Mongoose
**models**, and **middleware**. The server-bootstrap files (`index.js`, which
only starts the HTTP listener, and `config/db.js`, which opens the live MongoDB
connection) are excluded from coverage because they are validated by actually
running the server, not by unit tests.

## How it is produced

1. `server/jest.config.js` declares `collectCoverageFrom` for routes/models/middleware.
2. `npm run coverage` runs the full suite with Istanbul coverage.
3. A browsable HTML report is written to `server/coverage/lcov-report/` and a
   copy is kept in `docs/coverage/` for reference.

To regenerate on demand:  `cd server && npm run coverage`
Open the HTML report:  `open server/coverage/lcov-report/index.html`
