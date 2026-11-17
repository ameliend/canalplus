# Connected home — DIVE hero

Goal: replace only the first connected-home carousel with DIVE HeroBillboardCarousel.
Starting page: `/testuserreasearch/accueil` (`canalplus-home-improved.html`).
User state: connected subscriber; existing consent notice retained.
Trigger: page load; thumbnail, arrow, pause and programme actions.
Expected interface change: full-width billboard, thumbnail navigation on desktop, swipe cards on mobile.
Expected next step: selecting a programme opens the existing programme dialog and restores focus on dismissal.
Variants: the component's native responsive tiers; 12 original programmes, cover-only playback.
Source: live DIVE MCP `get_component(HeroBillboardCarousel)`, `design_tokens_css`, `design_fonts`, retrieved 2026-11-17. Component bundles are retained verbatim under `src/app/components` and `src/imports`.
Artwork: original homepage URLs; the first background uses the existing Bojarski detail cover. No trailer URLs were provided.

## Integration

Run `npm ci` then `npm run build` in this directory. Commit-ready generated assets live in `dist`, so AMAK's Python server needs no Node process.

The React island uses a shadow root to isolate DIVE resets and Tailwind utilities from the legacy page. Build-time `:root` → `:host` adaptation exposes the original tokens inside that root. The unchanged font sheet loads at document scope for browser font support. `home-layout.css` only handles page composition. `amak:open-programme` connects the carousel to the existing shared modal.

## Validation and limits

- Production build passed; DIVE design_doctor reports HeroBillboardCarousel as token-clean.
- Desktop: pause and arrow navigation exercised with keyboard; programme dialog opens, Escape closes and restores focus.
- Mobile: 320px layout visually checked, with no document horizontal overflow.
- No console errors observed during these checks.
- The supplied DIVE XS cards have click/swipe handlers but no keyboard-focusable programme action. This upstream accessibility limitation is retained to keep the component unmodified; a mobile keyboard adaptation requires a separately approved component change.
- Existing programme modal metadata remains the prototype's placeholder content.
