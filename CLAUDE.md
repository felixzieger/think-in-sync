# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Think in Sync is a multilingual AI word guessing game where players describe secret words one word at a time, taking turns with AI models to build descriptive sentences. The game supports 6 languages and multiple AI models through OpenRouter.

## Development Commands

### Local Development
```bash
pnpm i                    # Install dependencies
pnpm dev                  # Start development server (runs on port 8080)
pnpm build                # Production build
pnpm build:dev            # Development build
pnpm preview              # Preview production build
```

### Code Quality
```bash
pnpm lint                 # Run ESLint
```

### AI/Content Management
```bash
pnpm update-model-names          # Update available AI model list
pnpm dump-prompts-to-yaml        # Export prompts from Supabase to YAML files
```

### Supabase Functions
```bash
pnpm deploy-functions            # Deploy all Supabase Edge Functions
supabase functions serve         # Run functions locally
```

## Architecture

### Frontend Stack
- **React 18** with TypeScript and Vite
- **shadcn/ui** components with Tailwind CSS
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Supabase** for backend services

### Game Flow Architecture
1. **Game Creation**: `gameService.ts` creates games with word lists based on themes
2. **AI Integration**: `aiService.ts` interfaces with Supabase Edge Functions
3. **Word Generation**: Edge functions call OpenRouter API with language-specific prompts
4. **Session Management**: Each game instance creates a session for tracking

### Key Components Structure
```
src/
├── components/game/          # Core game UI components
├── services/                 # Business logic services
├── contexts/                 # React contexts (Auth, Language)
├── integrations/supabase/    # Supabase client and types
├── i18n/translations/        # Multi-language support
└── lib/                      # Utilities and word lists
```

### Supabase Edge Functions
Located in `supabase/functions/`, these handle:
- `generate-word`: AI word generation via OpenRouter
- `guess-word`: AI guessing logic
- `generate-themed-word`: Themed word generation
- `generate-daily-challenge`: Daily game creation
- `submit-high-score`: Leaderboard management

### Language Support
Multi-language implementation spans:
- Frontend: `i18n/translations/` directory
- Backend: Language-specific prompts in Edge Functions
- Prompts: YAML files in `prompts/` directory (synced from Supabase)

### State Management
- **AuthContext**: User authentication state
- **LanguageContext**: Current language selection
- **TanStack Query**: Server state and caching
- Local component state for game interactions

### AI Model Integration
- Uses OpenRouter API for accessing multiple AI models
- Model selection handled in `lib/modelNames.ts`
- Language-specific prompts defined in Edge Functions
- Supports models: Google Gemini, Mistral Nemo, and others

## Important Development Notes

### Path Aliases
- Use `@/` prefix for imports (maps to `src/`)
- Configured in both Vite and TypeScript configs

### TypeScript Configuration
- `noImplicitAny: false` - allows implicit any types
- `strictNullChecks: false` - more lenient null checking
- `skipLibCheck: true` - skips type checking of declaration files

### Supabase Integration
- Client configured in `src/integrations/supabase/client.ts`
- Database types auto-generated in `types.ts`
- Edge Functions don't require JWT verification
- Real-time features disabled in config

### Game Data Structure
- Games contain theme, word lists, and language
- Sessions track individual game instances
- High scores stored with user association
- Words organized by themes (standard, sports, food, custom)