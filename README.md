# Collaborative Study Material & Quiz Platform (CSMQP)

A MERN web application where students share study materials, build a shared
question bank, create and attempt auto-graded quizzes, track their performance
over time, and leave ratings/feedback on content. Built as the Software
Engineering mini-project (UE24CS341A) by Group 5.

## Features
| Area | What it does |
|------|--------------|
| Study materials | Upload (PDF/PNG/JPEG), browse, search and filter by subject/topic |
| Question bank | Add questions (subject/topic/difficulty/type); search and filter |
| Quizzes | Build a quiz from the bank, attempt it, auto-grade objective questions |
| Performance | Average score, topic-wise breakdown, improvement over time (chart) |
| Feedback | Rate and comment on content; see average ratings |

## Tech stack
- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB (local)
- **Auth:** bcrypt password hashing + JWT
- **Testing:** Jest + Supertest + mongodb-memory-server (backend), Vitest + React Testing Library (frontend)
- **CI:** GitHub Actions (lint + test + build on every push/PR)

## Repository layout
```
server/   Express API (routes, models, middleware, tests)
client/   React app (pages, components, tests)
docs/     SRS, STP, SAD, Proposal, deviations, coverage report, demo videos
```

## Prerequisites
- Node.js 20+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## Setup & run
```bash
# 1. Backend
cd server
npm install
# create server/.env with:
#   PORT=5000
#   MONGO_URI=mongodb://127.0.0.1:27017/csmqp
#   JWT_SECRET=<any long random string>
npm run dev            # starts the API on http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev            # starts the app on http://localhost:5173
```
Open http://localhost:5173 in the browser.

## Testing & coverage
```bash
cd server
npm test               # run all backend tests
npm run coverage       # run tests with a coverage report
```
A browsable coverage report is written to `server/coverage/lcov-report/index.html`.

## Team — Group 5
| Member | SRN | Module |
|--------|-----|--------|
| Samyak Sanklecha | PES2UG24CS436 | Study Materials + Feedback |
| Sandeep H | PES2UG24CS440 | Question Bank |
| Bharat Shandilya | PES2UG24CS906 | Quiz Creation & Attempting |
| Shreyas B Patil | PES2UG24CS488 | Performance Analysis |

Faculty: Dr. Sudeepa Roy Dey.

## Documentation
See the `docs/` folder for the SRS, Software Test Plan, Software Architecture &
Design, Project Proposal, the deviations note, and the test coverage report.
