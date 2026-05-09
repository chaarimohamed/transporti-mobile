# Transporti Mobile Copilot Instructions

This submodule is the Expo / React Native client for Transporti, not a generic chat app.

## Read First

1. [README.md](../README.md) for local setup, WSL notes, and Expo commands.
2. [../../README.md](../../README.md) when the monorepo workflow matters.
3. [../../.github/instructions/mobile.instructions.md](../../.github/instructions/mobile.instructions.md) for the detailed file-scoped rules that apply to `transporti-mobile/**`.

## Mobile-Specific Invariants

- The app supports two roles: Sender and Carrier.
- Navigation is manual through `App.tsx`; do not introduce React Navigation patterns into existing flows unless the task is explicitly a routing refactor.
- Service types in `services/` must match backend responses exactly.
- UI copy should remain French and respect Tunisian business rules such as `TND`, `+216`, and `DD/MM/YYYY`.

## Working Rules

- Add new screens by updating the `ScreenName` union, screen imports, and switchboard logic in `App.tsx`.
- Prefer existing shared UI from `components/ui/` before creating new primitives.
- Keep auth and API session behavior inside the existing `AuthContext` and service layer patterns.
- Validate with `npm run type-check` and `npm run lint` before considering mobile work complete.

## Common Pitfalls

- Ref callbacks that implicitly return values fail lint.
- Web-only APIs like `window.confirm` must be guarded and typed via `global.d.ts`.
- If a backend contract changes, update `services/*.ts` first, then the screens that consume those types.
