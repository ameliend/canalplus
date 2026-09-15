# AMAK — collaboration rules

This repository is a shared prototyping environment for CANAL+ product journeys. It is not production code and must not be presented as the official CANAL+ design system.

## Starting a prototyping request

When a collaborator starts a request with `Bonjour Amak`, treat the rest of the message as a request to modify this prototype. Apply the same repository-synchronization checks when a collaborator starts a new conversation in this project.

Treat `Bonjour Amak` as a trigger even when it is the entire message. Before asking what should be prototyped or giving any other reply, read `DESIGN_SYSTEM.md` and `DESIGN.md`, check the current Git status, start the AMAK server and open its interface in the Codex browser. Do not merely print or share the URL: create or focus the browser tab and verify that the AMAK page responds. Report the observed Git state and the opened URL before requesting the missing prototype brief.

Create one branch for one distinct prototype request. Follow-up messages about the same request must stay on its existing branch. A new `Bonjour Amak` request starts a new branch only when the previous request is complete or clearly unrelated.

Before changing files:

1. Read `DESIGN_SYSTEM.md` and `DESIGN.md`.
2. Check the current Git status. Never discard or overwrite uncommitted work.
3. Fetch the remote state and pull the latest repository version only when the remote differs. Preserve local changes and report any conflict or divergence before continuing work.
4. Never implement directly on `main`.
5. If the working tree is clean, switch to `main`, update it with a fast-forward-only pull, then create a new branch from the updated `main`.
6. If the working tree is not clean, preserve the local changes and explain which files are already modified before synchronizing.

For a new `Bonjour Amak` request, once `main` is clean and synchronized, start the local workspace with:

```bash
python3 amak-server.py --port 3000
```

Before reusing an AMAK page that is already open, read `http://localhost:3000/api/amak/session`. Its `repositoryRoot` must exactly match the current repository root (`pwd -P`). Never infer the active Git branch from the browser URL. If the roots differ, stop the old AMAK server and restart it from the current repository before opening the interface.

Then immediately open `http://localhost:3000/amak` in the Codex browser, using the available browser or preview tool. This action is mandatory for every new `Bonjour Amak` request and must happen without waiting for an additional request to view the result. If the browser cannot be opened, state the exact failure instead of claiming that AMAK is open. Let the collaborator name and create the branch in this interface, unless their initial request already provides an unambiguous branch topic. After creation, verify through `/api/amak/session` that both `repositoryRoot` and `branch` match the current Codex project before confirming that the branch is ready. The page chooser is available at `http://localhost:3000/<short-description>`.

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
3. Keep the AMAK local server available for preview. Outside the `Bonjour Amak` startup flow, start it from the repository root when the collaborator asks to view the result locally:

```bash
python3 amak-server.py --port 3000
```

4. Share the exact working URL, normally `http://localhost:3000/<short-description>/<page>`, and the full branch name.
5. Summarise changed files, checks performed and any remaining uncertainty.
