# Runbook: woodsportal-client-frontend

## Purpose and ownership

Customer-facing **TanStack** SPA (Vite, React, Tailwind). Consumes **woodsportal-api** and related services via HTTPS.

## Repository and runtime

- **Stack**: Node/Yarn (see [README](../README.md)), Vitest, ESLint/Prettier.
- **Environment**: Vite env via `src/env.mjs` / T3Env—**list variable names** in this runbook when they affect deployed behavior; never commit values.

## Local development

```bash
yarn install
yarn run start
```

## Build, test, and CI

```bash
yarn run build
yarn run test
yarn run lint
yarn run check
```

CI: `.github/workflows/` if present.

## Deploy and release

Static hosting or CDN pipeline is defined in **infra** and release docs (see [digitalwoods.io-woodsportal-infra](../../../digitalwoods.io-woodsportal-infra/README.md)). Git flow: [git-rules](../../../digitalwoods.io-woodsportal-git-rules/README.md).

## Verify after deploy

- Smoke: login and primary customer flows against target API base URL.
- No console errors for env misconfiguration (`import.meta.env` / Vite vars).

## Observability

- Browser RUM (if enabled) and CDN logs; backend APM covers API—see workspace [Linear playbook](../../../docs/linear-playbook.md) for backend alert paths.

## Common issues and remediation

- **Wrong API host**: Fix env for the deployment tier; rebuild artifact.
- **CORS failures**: Adjust woodsportal-api `CORS_*` settings with API owners—not in this repo alone.

## Rollback / emergency

Redeploy previous static asset version or flip CDN origin/cache to last-known-good deployment id.

## References

- [README.md](../README.md)
- [`AGENTS.md`](../../../AGENTS.md)
