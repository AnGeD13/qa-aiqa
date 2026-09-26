# Automated test traceability matrix — PomidorQA

**Purpose:** link the requirements in [`requirements_en.md`](requirements_en.md) to the automated tests, and show which checks are already automated and which remain gaps.

**Scope:** PomidorQA functional requirements (registration and sign-in, profile, skills, slots, catalog, booking, cancellation, "My meetings"). Out of scope: items in "Out of MVP scope".

**Last updated:** 2026-09-24

**Priorities:** P0 — blocks the main journey or booking integrity; P1 — affects functionality; P2 — behavior and display details.

**"Level" column:** the pyramid level that covers the check — `unit` (pure logic, no network or browser), `API` (a request to the server, no UI), `E2E` (a real browser). Each check has exactly one level: the one where the defect is cheapest to catch. Until an automated test exists, the planned level is shown.

**"Automated test" column:** a link to the spec file when the check is automated, and `—` when it is not yet.

## Coverage by level

7 of 61 checks are automated: the guest catalog scenario and registration at the E2E level.

| Level | Checks | Automated |
|---|---|---|
| unit | 3 | 0 |
| API | 8 | 0 |
| E2E | 50 | 10 |
| **Total** | **61** | **10** |

Unit and API are almost empty in the table because those checks are still needed, and because there is no access to the PomidorQA source code or its internal API: we test a black box on the live environment. Without the product code, domain functions cannot be called directly, and the server contract cannot be covered honestly with a request to the real API. The `unit` and `API` values in the "Level" column therefore stay *planned*: that is the cheaper place to catch a defect if the code ever becomes available. For now, those checks are covered from the outside through E2E. Practice specs in `tests/unit` and `tests/api` hit local mocks in `pyramid-mocks/`, not the product. They do not count as coverage in this matrix (see the `API (mock)` and `unit (mock)` rule below).

---

## User roles (§3)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-ROLE-01 | An unregistered guest sees the participant catalog | §3 | P0 | E2E | [guest-catalog.spec.ts](tests/e2e/guest-catalog.spec.ts) |
| TC-ROLE-02 | A guest opens a participant page and sees their open slots | §3 | P1 | E2E | [guest-catalog.spec.ts](tests/e2e/guest-catalog.spec.ts) |
| TC-ROLE-03 | A guest cannot book a call without an account | §3 | P0 | E2E | [guest-catalog.spec.ts](tests/e2e/guest-catalog.spec.ts) |

## Registration and sign-in (§4, §14)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-AUTH-01 | Registration with a name, email, and password creates an account | §4 | P0 | E2E | [register.spec.ts](tests/e2e/register.spec.ts) |
| TC-AUTH-02 | Registration fails when any required field is empty | §4 | P0 | E2E | [register.spec.ts](tests/e2e/register.spec.ts) |
| TC-AUTH-03 | A password shorter than 8 characters is rejected | §4 | P0 | unit (mock) | [password.spec.ts](tests/unit/password.spec.ts) |
| TC-AUTH-04 | A password of exactly 8 characters is accepted (boundary value) | §4 | P1 | unit (mock) | [password.spec.ts](tests/unit/password.spec.ts) |
| TC-AUTH-05 | After registration, a profile exists with the name from the form and time zone `Europe/Moscow` | §4 | P1 | E2E | [register.spec.ts](tests/e2e/register.spec.ts) |
| TC-AUTH-06 | Sign-in with a valid email and password succeeds | §4 | P0 | E2E | [login.spec.ts](tests/e2e/login.spec.ts) |
| TC-AUTH-07 | Sign-in with a valid email and an invalid password shows an error that does not reveal the cause | §4 | P0 | E2E | [login.spec.ts](tests/e2e/login.spec.ts) |
| TC-AUTH-08 | Sign-in with a non-existent email shows an error that does not reveal the cause | §4 | P0 | E2E | [login.spec.ts](tests/e2e/login.spec.ts) |
| TC-AUTH-09 | Registration with an arbitrary email does not require email confirmation or an invite code | §14 | P1 | E2E | [register.spec.ts](tests/e2e/register.spec.ts) |

## Profile (§5, §14)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-PROF-01 | A changed name is saved and remains after a page reload | §5 | P0 | E2E | — |
| TC-PROF-02 | An empty name cannot be saved — the field is required | §5 | P0 | E2E | — |
| TC-PROF-03 | Telegram is saved, and the field stays optional | §5 | P1 | E2E | — |
| TC-PROF-04 | The "about" description is saved, and the field stays optional | §5 | P1 | E2E | — |
| TC-PROF-05 | A time zone is selected from the list and saved | §5 | P0 | E2E | — |
| TC-PROF-06 | The time zone list includes all ten values from the requirements | §14 | P1 | E2E | — |
| TC-PROF-07 | Slot time is displayed in the slot owner's time zone for everyone viewing it | §5 | P1 | E2E | — |
| TC-PROF-08 | A participant's profile is visible to other participants in the catalog and on their page | §5 | P1 | E2E | — |

## Skills (§6)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-SKILL-01 | A "can help" skill is added and appears in its own block | §6 | P0 | E2E | — |
| TC-SKILL-02 | A "want to learn" skill is added and appears in its own block | §6 | P1 | E2E | — |
| TC-SKILL-03 | A "want to learn" skill does not appear in the "can help" block | §6 | P1 | E2E | — |
| TC-SKILL-04 | Adding the same skill of the same type again is rejected | §6 | P1 | E2E | — |
| TC-SKILL-05 | The same name is allowed when the skill types differ | §6 | P2 | E2E | — |
| TC-SKILL-06 | A participant deletes their skill | §6 | P1 | E2E | — |
| TC-SKILL-07 | A skill with an empty name is not added | §6 | P1 | E2E | — |

## Availability slots (§7)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-SLOT-01 | A slot with a future date and time is created; duration is fixed at 25 minutes | §7 | P0 | E2E | — |
| TC-SLOT-02 | A slot with a date or time in the past cannot be created | §7 | P0 | E2E | — |
| TC-SLOT-03 | A created slot receives status `free` | §7 | P1 | E2E | — |
| TC-SLOT-04 | One's own slot with status `free` is deleted | §7 | P1 | E2E | — |
| TC-SLOT-05 | A booked slot cannot be deleted | §7 | P0 | E2E | — |
| TC-SLOT-06 | Back-to-back slots are not treated as overlapping (25-minute boundary) | §7 | P2 | unit | — |

## Participant catalog (§8)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-CAT-01 | The catalog shows participants who have an open slot in the future | §8 | P0 | E2E | — |
| TC-CAT-02 | A participant with no open future slots is not shown in the catalog | §8 | P1 | E2E | — |
| TC-CAT-03 | A participant does not see themselves in their own catalog | §8 | P1 | E2E | — |
| TC-CAT-04 | Skill search leaves only participants who have that skill as "can help" | §8 | P0 | E2E | — |
| TC-CAT-05 | A skill from the "want to learn" block does not affect search results | §8 | P1 | E2E | — |
| TC-CAT-06 | Search for a non-existent skill returns an empty list with no UI error | §8 | P2 | E2E | — |

## Participant page (§9)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-PERS-01 | The page shows the name, "about", and both skill blocks | §9 | P1 | E2E | — |
| TC-PERS-02 | The list of open slots in the future is shown | §9 | P0 | E2E | — |
| TC-PERS-03 | Past slots are not shown on the page | §9 | P1 | E2E | — |
| TC-PERS-04 | Booked slots are not shown on the page | §9 | P1 | E2E | — |

## Booking a call (§10)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-BOOK-01 | A registered participant books someone else's open slot in the future | §10 | P0 | E2E | — |
| TC-BOOK-02 | After booking, the slot moves to `booked` and the booking moves to `confirmed` | §10 | P0 | API | — |
| TC-BOOK-03 | The slot owner cannot book their own slot | §10, §13 | P0 | API | — |
| TC-BOOK-04 | An already booked slot cannot be booked again | §10, §13 | P0 | API | — |
| TC-BOOK-05 | A slot whose start is in the past cannot be booked | §10 | P1 | API | — |
| TC-BOOK-06 | When one slot is booked at the same time, exactly one booking is confirmed | §10, §13 | P0 | API | — |
| TC-BOOK-07 | The participant who loses the race sees a clear error and a prompt to choose another slot | §10 | P0 | E2E | — |

## Booking cancellation (§11)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-CANC-01 | The participant who booked the slot cancels the booking | §11 | P0 | E2E | — |
| TC-CANC-02 | The slot owner cancels the booking of their slot | §11 | P0 | E2E | — |
| TC-CANC-03 | Cancellation more than 2 hours before the start is allowed (boundary value) | §11 | P0 | API | — |
| TC-CANC-04 | Cancellation less than 2 hours before the start is rejected | §11, §13 | P0 | API | — |
| TC-CANC-05 | After cancellation, the booking moves to `cancelled` and the slot becomes `free` again | §11 | P1 | API | — |
| TC-CANC-06 | Another participant can book a slot freed by cancellation | §11 | P1 | E2E | — |

## My meetings (§12)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-MEET-01 | The booking appears in "My meetings" for both the host and the guest | §12, §13 | P0 | E2E | — |
| TC-MEET-02 | Confirmed meetings that have not started yet go to the "Upcoming" list | §12 | P1 | E2E | — |
| TC-MEET-03 | Past and cancelled meetings go to the second list | §12 | P1 | E2E | — |
| TC-MEET-04 | Booking cancellation is available only from the "Upcoming" list | §12 | P1 | E2E | — |

## End-to-end acceptance scenario (§13)

| ID | Check | Requirement | Priority | Level | Automated test |
|---|---|---|---|---|---|
| TC-E2E-01 | Main journey: register → "can help" skill → slot for tomorrow → catalog search from a second account → booking → the meeting is visible to both | §13 | P0 | E2E | — |

---

## How to maintain the matrix

1. For a new automated test, replace `—` with a link such as `[booking-flow.spec.ts](tests/e2e/booking-flow.spec.ts)`.
2. One automated test may cover several rows. Repeat the link on each of them.
3. For a new requirement in [`requirements_en.md`](requirements_en.md), add a row with status `—` so the gap stays visible.
4. The level is set in the "Level" column for every check, not only for automated ones: one value from `unit`, `API`, or `E2E`. If a check is automated at a different level than planned, change the value when the link is added.
5. An automated test that hits a local mock server rather than the live environment is marked `API (mock)`, and a unit test of a practice function from `pyramid-mocks/` is marked `unit (mock)`. Otherwise the matrix would claim the product is verified when only the practice implementation was checked. Such rows are not counted as automated in "Coverage by level".
6. Recalculate the "Coverage by level" table whenever the row set changes or a new automated test appears.
