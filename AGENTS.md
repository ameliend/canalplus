# AMAK — collaboration rules

This repository is a shared prototyping environment for CANAL+ product journeys. It is not production code and must not be presented as the official CANAL+ design system.

## Starting a prototyping request

When a collaborator starts a request with `Bonjour Amak`, treat the rest of the message as a request to modify this prototype. Apply the same repository-synchronization checks when a collaborator starts a new conversation in this project.

Treat `Bonjour Amak` as a trigger even when it is the entire message. Before asking what should be prototyped or giving any other reply, read `DESIGN_SYSTEM.md` and `DESIGN.md`, then check the current Git status. Report the observed Git state before requesting the missing prototype brief.

Create one branch for one distinct prototype request. Follow-up messages about the same request must stay on its existing branch. A new `Bonjour Amak` request starts a new branch only when the previous request is complete or clearly unrelated.

Before changing files:

1. Read `DESIGN_SYSTEM.md` and `DESIGN.md`.
2. Check the current Git status. Never discard or overwrite uncommitted work.
3. Fetch the remote state and pull the latest repository version only when the remote differs. Preserve local changes and report any conflict or divergence before continuing work.
4. Never implement directly on `main`.
5. If the working tree is clean, switch to `main`, update it with a fast-forward-only pull, then create a new branch from the updated `main`.
6. If the working tree is not clean, preserve the local changes and explain which files are already modified before synchronizing.

If the collaborator is already on the feature branch for the active request, do not switch branches or synchronize `main`; continue on that branch after checking its status.

Use this branch format:

```text
feature/<collaborator>/<short-description>
```

Derive `<collaborator>` from `git config user.name`, converted to lowercase ASCII with spaces replaced by hyphens. If it is missing or ambiguous, ask for the collaborator identifier before creating the branch. Before creating it, check whether the branch already exists locally or on `origin`; add a short numeric suffix when needed.

Do not commit, push, open a pull request, merge, or delete a branch unless the collaborator explicitly requests that action.

If the collaborator explicitly asks to publish a validated request, commit on the feature branch, push that branch and open a pull request targeting `main`. Never merge the pull request without an explicit request.

## Implementing a request

- Identify the target page and the user state before editing. `/` currently redirects to `canalplus-home-improved.html`.
- Reuse an existing pattern before creating a new one.
- Keep shared behaviour in shared files when practical; avoid copying scripts between screens.
- Use actual approved assets when they are available. Mark any inferred visual rule or placeholder asset clearly.
- Do not claim that a component is official or production-ready unless an authoritative CANAL+ source confirms it.
- Preserve keyboard operation, visible focus, accessible names, heading order, zoom support and responsive behaviour.
- For dialogs, implement focus placement, focus containment, Escape handling and focus restoration.
- Do not use colour alone to communicate status.

Accessibility reference: [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Verification and local preview

After a change:

1. Test the affected journey with keyboard-only navigation and at a narrow viewport.
2. Check the browser console for errors.
3. Start a local static server from the repository root when the collaborator asks to view the result locally:

```bash
python3 -m http.server 3000
```

4. Share the exact local URL, normally `http://localhost:3000/`, and the branch name.
5. Summarise changed files, checks performed and any remaining uncertainty.
