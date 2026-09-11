# AMAK — CANAL+ journey prototyping

AMAK is a shared environment for building and testing CANAL+-like product journeys with reusable, documented components. It is intended for prototypes and user research, not production delivery.

## First-time setup

Each collaborator needs access to the GitHub repository and their own local clone. Before the first request, configure a recognisable Git identity:

```bash
git config user.name "your-github-identifier"
git config user.email "your-work-email"
```

Open the cloned repository as a project in Codex. The rules in `AGENTS.md` then apply to requests made from that project.

## Open the current prototype

From the repository root, start a local server:

```bash
python3 -m http.server 3000
```

Then open [http://localhost:3000/](http://localhost:3000/).

## Request a change with Codex

Example:

```text
Bonjour Amak, ajoute une pop-in d'information sur la page `/` pour un utilisateur connecté dont le consentement est inconnu. Lance ensuite le parcours en local.
```

Codex follows the shared rules in `AGENTS.md`, creates a collaborator-specific feature branch, applies the references in `DESIGN_SYSTEM.md` and `DESIGN.md`, verifies the affected journey, then reports the local URL and branch name.

Follow-up requests for the same prototype remain on the same branch. A separate prototype request receives a new branch.

## Collaboration

- One request equals one feature branch.
- `main` remains the shared reference and should be protected on GitHub.
- A change is merged through a reviewed pull request.
- Official design-system sources take precedence over approximations in this repository.
- Each collaborator works from their own local clone and Git identity.

Recommended branch format:

```text
feature/<collaborator>/<short-description>
```
