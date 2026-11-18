# Deviations from the SRS / SAD
**Project:** Collaborative Study Material & Quiz Platform (CSMQP) — Group 5

This document records where the delivered system intentionally differs from the
original design documents, with the reasoning. All deviations were agreed by the
team and every member can explain them in the viva.

## 1. Administration module not implemented (REQ-15, REQ-16, REQ-17)
The SRS section 5.6 defined three admin requirements: manage user accounts
(REQ-15), moderate shared content (REQ-16), and manage subjects/topics (REQ-17).
These were **deprioritised** so the team could fully build, test and harden the
five core collaborative features (materials, question bank, quizzes,
performance, feedback) for the localhost demo.

The groundwork is already in place and the feature is extensible: the `User`
model carries a `role: ["student","admin"]` field and the auth middleware
supports role checks, so admin routes can be layered on without redesign. The
whole team studied the admin design and can explain how it would be completed.

## 2. Quiz submission endpoint
The SAD specified `POST /api/quizzes/:id/submit`. The implementation uses
`POST /api/attempts` with `{ quizId, answers }`. Behaviour is identical
(auto-grade + save attempt); modelling the attempt as its own REST resource
keeps quiz definition and quiz attempts cleanly separated.

## 3. Feedback target types
SRS REQ-13 mentioned feedback on "materials and questions". The `Feedback`
model's `targetType` enum is `["material","quiz"]` — quiz-level feedback proved
more useful than per-question feedback during development.

## 4. Quiz creation input
REQ-7 described creating a quiz by "selecting a topic and number of questions".
The implementation lets the creator pick the exact question IDs, which gives
precise control over quiz contents.

## 5. Subjects / topics storage
Subjects and topics are stored as free-text string fields on materials and
questions, rather than as separately managed collections. This is consistent
with the admin subject/topic management (REQ-17) being deferred.

## 6. Agile board tool
The Project Proposal states Jira is used for task and sprint tracking, and the
team used Jira throughout. This differs from a GitHub Projects board but matches
our own proposal.
