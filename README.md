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

From the repository root, start the AMAK workspace:

```bash
python3 amak-server.py --port 3000
```

Then open [http://localhost:3000/amak](http://localhost:3000/amak).

The **My active projects** section lists only the current collaborator's `feature/<collaborator>/...` branches. A project can be reopened from a local branch or restored from its GitHub tracking branch without displaying other collaborators' work.

The first screen asks for a short branch name. After selecting **Create branch**, AMAK creates `feature/<collaborator>/<short-description>` from the synchronized `main` branch. It then opens `http://localhost:3000/<short-description>`, where the collaborator chooses the page to prototype.

The selected page keeps a stable working URL such as:

```text
http://localhost:3000/<short-description>/cinema
```

The collaborator can keep that preview open beside Codex and request changes in the conversation. The small AMAK indicator at the bottom of the prototype returns to the page chooser.

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
