# Niriksh AI — Phase 8 Product Polish Sprint: QA Report

Date: 2026-09-16
Scope: Prompt #8 ("Product Polish Sprint — No New Capabilities"). This report covers the Final QA pass: TypeScript, ESLint, production build, responsive audit, broken-link audit, and interactive spot-checks of the polish-sprint features (Demo Mode, empty states, focus rings, memoization).

## 1. Automated checks

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Pass, 0 errors |
| ESLint | `npm run lint` | ✅ Pass, 0 warnings/errors |
| Production build | `npm run build` | ✅ Compiles cleanly, all 4 routes (`/`, `/dashboard`, `/investigation`, `/_not-found`) prerender as static content. First Load JS: 172–173 kB per route. |
| Backend smoke test | `curl` against every `GET` route + `/docs` | ✅ All 200 OK. `ENVIRONMENT=production` correctly returns 404 for `/docs`, `/redoc`, and `/api/demo/reset`, while `/api/health` still returns 200. |

## 2. Critical bug found and fixed during QA

**Dashboard content never rendered — stuck on the loading skeleton indefinitely.**

- **Where:** [app/dashboard/page.tsx](app/dashboard/page.tsx)
- **Root cause:** The Phase 8 loading-experience polish wrapped the skeleton→content switch in `<AnimatePresence mode="wait">` with the skeleton declaring an `exit` animation. In practice the exit transition never resolved in the browser, so `AnimatePresence` never mounted the "content" branch — even though the underlying `loading` React state correctly flipped to `false` and all six dashboard API calls succeeded. The dashboard was silently unusable (permanently showing shimmer placeholders) on every load.
- **Verification:** Confirmed via direct fiber inspection (not just a screenshot) that `loading` was `false` and `data` was fully populated while the DOM still only contained the skeleton — isolating the bug to `AnimatePresence`'s exit-gating rather than the data-fetching logic.
- **Fix:** Removed `AnimatePresence`/`mode="wait"` for this one-time, one-directional transition (skeleton shows once, then is replaced — it never needs to reverse). The content `motion.div` keeps its own `initial`/`animate` fade-in, so the visual polish is unchanged; only the broken exit-gating was removed.
- **Re-verified:** Fresh dev server, fresh browser tab, production build — dashboard now loads and renders real data (revenue, stat cards, charts, activity feed, investigations table) every time.

This was the highest-priority finding of the sprint: without it, `/dashboard` — the app's primary surface — was non-functional in every environment tested.

## 3. Mobile responsiveness audit (375×812 viewport)

Checked via computed layout (`getBoundingClientRect` sweep for elements exceeding the viewport width), not just visual screenshots, since this pane's screenshot capture has known rendering flakiness independent of actual app state.

| Page | Result |
|---|---|
| `/` (landing) | ✅ No horizontal overflow. `document.documentElement.scrollWidth` stays at viewport width. |
| `/dashboard` | ✅ No horizontal overflow. The investigations table (`min-w-[520px]`) intentionally exceeds the viewport but is wrapped in its own `overflow-x: auto` container, so it scrolls independently without affecting page width — correct, standard pattern for wide tables on mobile. |
| `/investigation` | ✅ No horizontal overflow, including the Voice Copilot controls and Operations Timeline. |

## 4. Broken-link audit

Every `<Link href>` in the codebase was grepped and cross-checked:
- Cross-page routes (`/`, `/dashboard`, `/investigation`) all resolve to real routes.
- Landing-page anchor links (`/#problem`, `/#architecture`, `/#usp`, `/#impact`, `/#business`) all match an existing `id="..."` on a rendered `<section>`.
- No dangling or placeholder `href="#"` links found.

## 5. Interactive spot-checks

- **Demo Mode reset:** Clicking "Illustrative Demo Data" on the dashboard header fires `POST /api/demo/reset` (confirmed 200 OK via network inspection), resets merchant memory/history/workflow state server-side, and flashes a "Demo data reset" confirmation for ~2s before reverting.
- **Workflow approval flow:** Approving a recovery workflow on `/investigation` triggers the n8n-style simulation, the `WorkflowProgress` panel transitions from `RUNNING` through all 6 steps to `COMPLETED`, and the dashboard's investigation history/memory widgets pick up the new record without a full page reload.
- **Focus rings:** Tab-navigating through buttons/links shows the global `:focus-visible` amber outline.
- **Memoized dashboard components:** Spot-checked that switching the Revenue Analytics tab (Revenue/Transactions/Refunds) re-renders only the chart, with no visible regression from the `React.memo` wrapping applied in this phase.

## 6. Accessibility

- Global `:focus-visible` styling applied across interactive elements.
- `aria-label`, `aria-pressed`, `aria-expanded`, `role="status"` + `aria-live="polite"` added to dynamic/interactive elements introduced across Phases 6–8 (workflow progress, voice copilot, investigation panel confidence bar, architecture diagram tabs).
- All non-form buttons carry `type="button"`.
- **Contrast finding (fixed):** The new Phase 8 "Backend unreachable" disclaimer text on the dashboard used `text-warning` (`#F59E0B`) directly on the light dashboard background — a ~2:1 contrast ratio, well under the WCAG AA minimum of 4.5:1 for body text. Fixed by using a darker amber (`#B45309`, ~4.7:1) for this specific new text.
- **Contrast finding (scoped out, reported honestly):** The same low-contrast pattern (`text-warning` / `text-success` used directly as small text color on light backgrounds) also exists in several components carried over from Phases 1–2 (e.g., stat badges in `OverviewStats`, status pills in `InvestigationsTable`, the hero's `MerchantDashboard` preview card, `ProblemSection` badges). Fixing these would mean changing the app's brand color tokens (`--warning`, `--success`) or restyling multiple originally-approved, designed surfaces — which falls outside this sprint's explicit "Do NOT redesign pages" boundary. Flagging this for a deliberate design decision rather than silently altering approved visual surfaces.

## 7. Explicit scope decisions

- **No backend "degraded mode" indicator was added.** Sarvam/Cognee-unavailable fallback content is deliberately identical in shape and tone to live content, so there is nothing user-visible to explain — and adding a new response field would have been a new capability, not polish.
- **Lighthouse CLI run was not performed** — no Lighthouse/Chrome headless tooling is available in this environment. Performance work instead focused on verifiable, concrete levers: code-splitting the two recharts-based components behind `next/dynamic`, wrapping presentational dashboard components in `React.memo`, and confirming the production bundle sizes above (172–173 kB First Load JS per route, no route regressions).
- **Coverage is triaged, not exhaustive.** Given the sprint's breadth (9 categories), the QA pass above targets concrete, verifiable, high-leverage items per category rather than literal 100% line-by-line coverage of every bullet in the original prompt.

## 8. Pages checked

- `/` — landing page (hero, problem, architecture, USP, impact, business model, footer)
- `/dashboard` — merchant dashboard (stats, analytics, active investigation, activity feed, merchant snapshot, memory widget, investigations table, demo reset)
- `/investigation` — live investigation (terminal loader, investigation panel, voice copilot, memory timeline, workflow approval/progress, operations timeline)

## Summary

One critical, sprint-introduced regression (`/dashboard` permanently stuck loading) was found and fixed. One accessibility contrast issue in new Phase 8 copy was found and fixed. TypeScript, ESLint, and the production build are all clean. Mobile layout and internal links are verified with no issues found. A pre-existing brand-color contrast pattern was identified and reported rather than silently redesigned, consistent with this sprint's scope boundary.
