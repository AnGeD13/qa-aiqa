# Autotest code of practice

Open this file and the other person's PR. That is all you need.

Write the comment as `CODEX 3, missing test.step` — not "this looks bad".

---

## 1. Where things live

```
tests/e2e/        scenario: who does what, and what must happen
tests/helpers/    data and entry: makeUser, registerUser
tests/pages/      screen: locators and clicks
```

The spec holds the case. The helper holds the user. The page holds "save the name".

Do not put `registerUser` on `ProfilePage` or `BookingPage`.
Do not put `getByLabel` in a spec when the page object already exists.

---

## 2. What to extract

If it appears twice, extract it.

| Lives in | What belongs there |
|---|---|
| `helpers/user.ts` | type, factory, registration, sign-in |
| `pages/profile-page.ts` | `goto`, `saveName`, `addSkill`, form fields |
| `pages/booking-page.ts` | catalog, calendar, booking modal |
| spec | `beforeEach`, method calls, `expect` |

Name the method for the intent, not the click: `saveName`, not `clickSaveButton`.

Do not pull `expect` into the page. The page clicks; the test asserts.

Exception: `registerUser` may finish sign-in with `toHaveURL`.

---

## 3. File skeleton

```
test.describe("Profile")                              // page / feature
  test.beforeEach → own user + open the page
  test("name persists after reload")                  // what we assert
    test.step("save the name")                        // action
    test.step("name comes from the server after reload")  // assertion
```

One `describe`, one feature. Do not put profile and booking in one file "just in case".

---

## 4. Steps

Wrap every meaningful action and assertion of an automated test in `test.step` with a human-readable name.

An action step contains only what Playwright can do: open, click, type, select, reload.

An assertion step contains only `expect`. No clicks.

The first step of a case opens the page. If `goto` is already in `beforeEach`, the test starts at the behavior under test. That is fine too.

---

## 5. Names

`Page / feature → what we assert`

✅ `test("name persists after reload")`
❌ `test("test 1")`
❌ `test("fill input")`

Do not invent the shape from scratch every time. Open a neighboring test and copy the skeleton.

---

## 6. One test or two

Related checks after a single action belong in one test. Name, Telegram, and bio saved with one "Save" is fine.

If checking the second thing means registering again and repeating half the steps, split it into two tests.

Do not spawn separate tests for "check the button", "check the text", and "check the icon". The suite bloats, and the payoff is small.

---

## 7. Data

Each test gets its own data: `makeUser(role, Date.now())`.

The password may be hardcoded. The name and the email may not.

---

## 8. Locators

Start with `getByRole` / `getByLabel` / `getByTestId`.

If an anchor is reused, put it on `ProfilePage` / `BookingPage`. Do not copy-paste it across specs.

---

## 9. Waiting and asserting

No `waitForTimeout`. No `{ force: true }`. No `.only` and no `page.pause()`.

`fill("New name")` followed immediately by `toHaveValue` only proves the fill itself. The name from the server is visible after reload. Wait for the POST before you reload.

Assert what has already happened: "the form is open", not "the form should open".

---

## 10. On review

Submit only green runs. A red PR gets fixed by its author first.

`npm run lint` — zero errors.

The PR description states what changed, not a single line `hw11`.

The author fixes their own flake.

An empty LGTM with no checklist does not count.

---

## 11. Arrange through the API

If the test does not check registration, create the user with `registerUserViaApi`. Keep the UI for the action the scenario asserts and for the visible result.

Do not replace a UI assertion with an API request. The API sets the scene; the test checks user behavior.

---

## 12. Cleanup is required

Every test deletes the accounts it created through `deleteCurrentTestUser`. The account is removed in a cascade, together with skills, slots, and bookings.

Cleanup must still run when an assertion fails: use `finally` inside the test, or `test.afterEach`. If cleanup walks an array of contexts, push each context onto the array before the first action that can fail. Leave closing the context itself to the cleanup helper's `finally`.

A new test without working cleanup is not ready for a PR.
