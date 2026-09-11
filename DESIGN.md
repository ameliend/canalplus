# CANAL+ prototype design rules

## Purpose

The prototype helps Product and Design teams materialise and test journeys while staying close to the CANAL+ experience. Fidelity must come from documented sources, not from assumptions about the brand.

## Product principles

- Start from an existing screen or documented pattern.
- Make the user state explicit before designing a variation.
- Keep the journey testable: every action must have a visible outcome and a valid next step.
- Prefer real interface copy supplied by Product or Content. Mark invented copy as placeholder.
- Keep prototype-only controls separate from the simulated CANAL+ interface.
- Do not reproduce real personal data, account identifiers or production credentials.

## Responsive behaviour

Every new screen or component must be usable at desktop and mobile widths. Content must reflow without horizontal scrolling at 320 CSS pixels, except where the content genuinely requires two-dimensional layout.

Reference: [WCAG 2.2 — Reflow, success criterion 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

## Journey states

Describe a scenario using only the dimensions needed for the test. Suggested dimensions include:

| Dimension | Example states |
| --- | --- |
| Authentication | signed out, signed in |
| Subscription | none, active, suspended |
| Profile | adult, child |
| Consent | unknown, accepted, refused |
| Accessibility preference | captions, audio description, sign language |

These are modelling examples, not confirmed CANAL+ business rules. Product must validate the states used by each prototype.

## Scenario definition

Before implementing a new journey, record:

```text
Goal:
Starting page:
User state:
Trigger:
Expected interface change:
Expected next step:
Variants to compare:
Source or reference:
Open questions:
```

