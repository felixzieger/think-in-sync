# Repository Guidelines

## Project Structure & Module Organization
- App code lives in `src/` (React + TypeScript). Key folders: `components/`, `pages/`, `services/`, `hooks/`, `contexts/`, `lib/`, `integrations/supabase/`, `i18n/`.
- Static assets in `public/`; HTML entry is `index.html`.
- Serverless functions are in `supabase/functions/` (TypeScript edge functions).
- Utility scripts live in `scripts/` (TypeScript/Node). Prompt YAMLs are in `prompts/`.

## Build, Test, and Development Commands
- Dev server: `pnpm dev` (or `npm run dev`) — starts Vite locally.
- Build: `pnpm build` — creates production bundle in `dist/`.
- Preview: `pnpm preview` — serves the built app.
- Lint: `pnpm lint` — runs ESLint on the repo.
- Supabase: `pnpm deploy-functions` — deploys edge functions via Supabase CLI.
- Utilities: `pnpm update-model-names`, `pnpm dump-prompts-to-yaml` — keep model names in sync and export prompts.

## Coding Style & Naming Conventions
- Language: TypeScript, React function components.
- Indentation: 2 spaces; keep lines readable (< 100 chars when possible).
- Files: React components `PascalCase.tsx`; hooks `use-*.ts(x)` with exported `useX`.
- Modules: co-locate small helpers next to usage; shared utilities in `src/lib/`.
- Linting: ESLint (`eslint.config.js`) with React Hooks rules; fix warnings before PR.
- Styling: Tailwind CSS; prefer utility classes over ad‑hoc CSS.

## Testing Guidelines
- No formal test suite currently. If adding tests, prefer Vitest + React Testing Library.
- Place tests adjacent to modules or under `src/__tests__/`; name as `*.test.ts`/`*.test.tsx`.
- Include a short test plan in PRs describing manual steps for critical flows.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject (e.g., `Add GameReview timing`, `Fix Supabase types`). Group related changes.
- PRs: clear description, linked issues, screenshots/GIFs for UI changes, and notes on any env/config updates.
- Verify before opening: `pnpm lint`, `pnpm build`, and local run of changed flows.

## Security & Configuration Tips
- Environment: define `VITE_*` vars in `.env` (e.g., `VITE_GOOGLE_CLIENT_ID`). Never commit secrets.
- Supabase: credentials are managed in `src/integrations/supabase/`; avoid hardcoding sensitive keys in PRs.
- Review prompt changes (`prompts/`) carefully; they affect production behavior.

