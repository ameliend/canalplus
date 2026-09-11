# Design system reference

## Status

This document describes patterns observed in the current prototype. It is a provisional implementation reference, not an authoritative export of the CANAL+ design system.

When an official component library, Storybook, Figma library or design-system specification becomes available, it takes precedence. Record the source and update this document rather than silently approximating a component.

## Current foundations

| Token | Current prototype value | Status |
| --- | --- | --- |
| Primary background | `#000000` or `#ffffff`, depending on the screen | Observed |
| Primary text | `#ffffff` on dark surfaces; `#0c0c0d` on light surfaces | Observed |
| Accent | `#e52e4d` | Observed, not yet verified against an official source |
| Body typeface | Hind with Arial fallback | Observed |
| Display typeface | Canal with Hind/Arial fallback | Referenced, font file not currently included |
| Focus indicator | Blue, 3 px with offset | Present on some screens; apply consistently |

## Component contract

Each reusable component must document:

- purpose and permitted contexts;
- content anatomy;
- variants and states;
- responsive behaviour;
- keyboard interaction;
- accessible name and announced status;
- source of truth;
- known gaps or unverified visual details.

## Alerts and information pop-ins

Choose the pattern from the user's need, not from visual prominence:

- Use an inline alert when the information belongs to the current content and does not block progress.
- Use a status message when feedback follows an action. Do not move focus unless the user must act immediately.
- Use a modal dialog only when the user must acknowledge or decide before continuing.
- Give the dialog a programmatic name and, when useful, a description.
- On opening a modal, place focus inside it. Keep keyboard focus within it, support `Escape` when dismissal is allowed, and return focus to the trigger on close.
- Never communicate warning, error or success through colour alone.

Accessibility references: [WAI-ARIA Authoring Practices — Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) and [Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

## Components currently visible in the repository

- Global header and navigation
- User menu
- Content rails and programme tiles
- Login fields and password visibility control
- Primary and secondary buttons
- Account and settings navigation

These items still need to be audited, extracted into reusable implementations and linked to authoritative CANAL+ references.

