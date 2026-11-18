# SRS Addendum — Security Objectives (section 6.3)
**Project:** Collaborative Study Material & Quiz Platform (CSMQP) — Group 5

The SRS section 6.3 lists security *requirements*. The following two security
*objectives* are added to state the intent those requirements serve.

## Security Objectives
- **SEC-OBJ-1 — Protect user credentials and personal data.** User passwords
  must never be stored or transmitted in plain text; they are hashed with
  bcrypt so that a database leak does not expose usable credentials.
- **SEC-OBJ-2 — Enforce authorised access.** Only authenticated users may
  contribute content or attempt quizzes, and administrative operations are
  restricted to accounts with the admin role (role-based access control).

## Security Requirements (existing, retained)
- Users must register and log in before uploading material, adding questions,
  or attempting quizzes.
- Passwords are stored hashed, never in plain text.
- Admin-only actions are restricted to the admin role.
