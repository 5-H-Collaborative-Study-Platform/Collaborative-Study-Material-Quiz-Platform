# STP Addendum — Test Case Catalogue
**Project:** Collaborative Study Material & Quiz Platform (CSMQP) — Group 5

This addendum expands the Software Test Plan with a full enumerated test-case
catalogue (10 cases) covering functional and non-functional (security)
requirements, each traceable to an SRS requirement and to an automated test.

| TC ID      | Req      | Description | Steps | Expected result |
|------------|----------|-------------|-------|-----------------|
| TC-Mat-01  | REQ-1    | Upload a valid study material | Authenticated POST /api/materials with file + title/subject/topic | 201 Created; material stored |
| TC-Mat-02  | REQ-3    | Reject upload with missing fields | POST /api/materials with file but no title | 400 with clear error message |
| TC-Qst-01  | REQ-4    | Add a valid question | Authenticated POST /api/questions with valid body | 201 Created |
| TC-Qst-02  | REQ-5    | Reject invalid difficulty filter | GET /api/questions?difficulty=impossible | 400 error |
| TC-Quiz-01 | REQ-7    | Create a quiz from the bank | POST /api/quizzes with valid title/topic/questionIds | 201 Created |
| TC-Quiz-02 | REQ-7    | Reject quiz with non-existent question | POST /api/quizzes with an unknown question id | 400 error |
| TC-Quiz-03 | REQ-9    | Auto-grade an attempt | POST /api/attempts with answers (one wrong) | 201; score computed correctly |
| TC-Perf-01 | REQ-11   | View performance summary | GET /api/performance/me after attempts | 200; correct average and counts |
| TC-Sec-01  | NFR-Sec  | Block unauthenticated contribution | POST /api/feedback with no token | 401 Unauthorized |
| TC-Sec-02  | NFR-Sec  | Reject duplicate registration | Register the same email twice | 409 Conflict |

All ten cases are backed by automated Jest + Supertest tests in
`server/__tests__/`, executed on every push via GitHub Actions CI.
