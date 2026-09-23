# PomidorQA — requirements specification

## 1. Product purpose

PomidorQA is a service for short (25-minute) calls between QA and IT professionals. A participant
registers, states what they can help with and what they want to learn, and marks open slots
on the calendar. Other participants find them in the catalog and book a call.


## 2. MVP scope

In scope for the MVP:
- registration and sign-in with email and password;
- participant profile (name, Telegram, time zone, about);
- two skill types: "can help" and "want to learn";
- availability slots of a fixed duration (25 minutes);
- participant catalog with search by skill;
- slot booking;
- booking cancellation;
- a list of one's own meetings (upcoming / past).

Out of MVP scope:
- creating and storing a video-call link in the service (participants arrange the call themselves, in Telegram);
- push or email notifications for bookings and cancellations;
- ratings and reviews after a call;
- profile moderation and reports;
- payments.

## 3. User roles

### Guest (not registered)

A guest can:
- browse the participant catalog;
- open a participant page and see their open slots.

A guest cannot book a call. An account is required.

### Registered participant

A participant can do everything a guest can, and also:
- edit their profile and skills;
- add and delete their own open slots;
- book other participants' open slots;
- cancel their bookings (as the slot host or as the person who booked);
- see the list of their meetings.

## 4. Registration and sign-in

Registration requires a name, an email, and a password.

The password must be at least 8 characters.

After a successful registration, a profile is created automatically: the name is taken from the
registration form, and the default time zone is `Europe/Moscow`.

On sign-in with an incorrect email or password, the participant must see a clear error that does not
reveal which of the two is wrong — for security.

## 5. Profile

A participant profile contains:
- name (required);
- Telegram (optional, free text);
- time zone (selected from the list of Russian time zones; default `Europe/Moscow`);
- about (optional free-text description).

The profile time zone is used to display that participant's slot times. Everyone viewing their
slots sees the time in the owner's time zone.

The profile is visible to other participants in the catalog and on the participant page.

## 6. Skills

A skill belongs to a participant and has a type:
- "can help" (`can_help`) — what the participant can help others with;
- "want to learn" (`want_to_learn`) — what the participant wants to discuss themselves.

The skill name is free text (for example, "Playwright", "SQL", "interviews").

The same skill of the same type cannot be added to a participant twice.

A participant can delete their skill at any time.

## 7. Availability slots

A slot is a time window a participant opens for others to book.

Slot duration is fixed at 25 minutes. The participant sets only the start date and time.

A slot cannot be created in the past.

A slot has a status: `free` or `booked`.

A participant can delete only their own slot with status `free`. A booked slot cannot be deleted.

## 8. Participant catalog

The catalog shows only participants who have at least one open slot in the future.

A participant does not see themselves in their own catalog.

The catalog supports search by skill: entering a skill name in the search box (for example,
"Playwright") leaves only participants who have that skill in the "can help" section.

## 9. Participant page

The participant page shows: name, about, skills ("can help with" / "wants to learn"), and
the list of open slots in the future.

Past slots and already booked slots are not shown on the participant page.

## 10. Booking a call

Any registered participant can book a slot except the owner of that slot.
You cannot book your own slot.

Only a slot with status `free` and a start time in the future can be booked.

After a successful booking, the slot moves to status `booked`, and a booking is created with
status `confirmed`.

If two participants click "Book" on the same slot at the same time, the system must guarantee
that exactly one booking remains confirmed. The second participant must see a clear error and
a prompt to choose another slot.

## 11. Cancelling a booking

Either participant can cancel a booking: the slot host and the person who booked it.

A booking can be cancelled no later than 2 hours before the call starts. The system must reject
a later cancellation, so the other person is not left without notice at the last moment.

After cancellation, the booking moves to status `cancelled`, and the slot becomes `free` again
and can be booked by someone else.

## 12. My meetings

The "My meetings" section shows every booking where the participant is the host or the guest.

Meetings are split into two lists:
- "Upcoming" — confirmed meetings that have not started yet;
- "Past and cancelled" — everything else.

A booking can be cancelled only from the "Upcoming" list.

## 13. Acceptance criteria

The main user journey completes successfully:
1. register;
2. fill in the profile and add at least one "can help" skill;
3. add an open slot for tomorrow;
4. from a second account, open the catalog and find the first participant by skill;
5. book their slot;
6. see the booking in "My meetings" for both participants.

Negative scenarios:
- a participant cannot book their own slot;
- a participant cannot book a slot that is already booked;
- a slot cannot be created in the past;
- a booking cannot be cancelled one hour before the call;
- a race for the same slot by two participants must not produce two confirmed bookings.

## 14. Test data

The system has no pre-provisioned test accounts. Testing requires registering new
accounts with any email (email confirmation is not required; PomidorQA registration is not tied
to the main AIQA account and does not require an invite code).

Time zones available on the profile: `Europe/Kaliningrad`, `Europe/Moscow`, `Europe/Samara`,
`Asia/Yekaterinburg`, `Asia/Omsk`, `Asia/Novosibirsk`, `Asia/Krasnoyarsk`, `Asia/Irkutsk`,
`Asia/Yakutsk`, `Asia/Vladivostok`.
