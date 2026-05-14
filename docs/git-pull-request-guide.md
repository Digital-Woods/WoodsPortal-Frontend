# Git pull request guide

Checklist for opening a GitHub pull request from this repository. Align branch names and titles with Linear (**`ENG-XXX`**) so GitHub and Linear stay linked.

## Default branch flow

| Target branch | When |
|---------------|------|
| **`dev`** | Normal feature, bug, chore, and refactor work (default). |
| **`release`** | Release train / integration merges (batch); follow team release process. |
| **`main`** | Only **`release` → `main`** or an approved **hotfix** path—not from long-lived feature branches. |

## Before you open the PR

- [ ] **Linear** — Issue exists; **`eng-xxx`** appears in the branch name (for example `feature/eng-123-fix-login`) and matches that issue.
- [ ] **Base branch** — PR targets **`dev`** unless you are doing a train, hotfix, or documented merge-back.
- [ ] **Scope** — Diff matches the issue; unrelated changes are split into separate PRs when practical.

## PR title (CI)

- [ ] **`ENG-XXX: Short description`** — Same key as the Linear issue and branch (required for org PR checks).

## PR body

- [ ] **Summary** — What changed and why.
- [ ] **How to test** — Routes or flows to exercise; environment (local, dev).
- [ ] **Risk & rollback** — User-visible risk; how to revert deploy or flag.
- [ ] **Links** — Linear issue URL (and design doc or ticket if applicable).

## Examples

### Single-issue PR (normal work into `dev`)

One Linear issue → one branch → one PR. The **`ENG-*`** in the **title** matches the issue in the **branch name**.

| Field | Example |
|-------|---------|
| **Branch** | `feature/eng-1201-sso-login-button` |
| **Base** | `dev` |
| **Title** | `ENG-1201: Add SSO provider button on login` |
| **Body** | **Summary** — SSO entry point behind flag `auth.sso.enabled`. **Test** — `yarn lint`, `yarn test`; manual login on local + dev. **Risk** — Medium for auth surface; rollback = disable flag + redeploy. **Links** — Linear `ENG-1201`; screenshot attached. |

### Multiple issues in one integration PR (release train)

Several tickets ship in one merge (**`dev` → `release`** or **`release` → `main`**). Each ticket already landed via its own PR(s) into **`dev`**; this PR moves the integration branch. Workflows that enforce **strategy B** expect **every** distinct **`ENG-*`** in the **title and/or body** (and may require a minimum count via repository variable `TRAIN_MIN_LINEAR_KEYS`).

| Field | Example |
|-------|---------|
| **Base** | `release` (head `dev`) or `main` (head `release`) |
| **Title** | `ENG-1201: Train dev → release 2026-04-11` *(optional headline; keys can live mainly in the body)* |
| **Body** | **Included issues:** `ENG-1201`, `ENG-1202`, `ENG-1203` — SSO button; drawer nav; file upload progress. **Summary** — Integration cut for the cycle; no feature work directly on this branch. **Deploy** — Follow the platform runbook after merge. |

If `TRAIN_MIN_LINEAR_KEYS` is **3**, the PR text must contain **three** distinct keys (for example all of `ENG-1201`, `ENG-1202`, `ENG-1203`).

### Multiple separate PRs (before a train)

Typical week: **one issue per PR** into **`dev`** (each with its own `ENG-*` title), then **one** integration PR that lists **all** keys for the cut, as in the table above.

## Frontend (app) checklist

- [ ] **Lint / test / build** — `yarn lint`, `yarn test`, and `yarn build` (or this repo’s scripts) pass locally when feasible.
- [ ] **UI** — Screenshots or a short screen recording for visible changes.
- [ ] **Accessibility** — Keyboard flow, focus order, and labels for new or changed interactive UI.
- [ ] **Smoke** — Browsers or breakpoints your team cares about, or note reliance on CI / design review.

## Integration PRs (`dev` → `release`, `release` → `main`)

If this repo uses the WoodsPortal train workflows: list **every** **`ENG-XXX`** in the PR title or body as required, and add optional **project/cycle links** and a **deploy checklist** if your team uses that playbook.
