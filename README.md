---
title: Think in Sync
emoji: 🧠
colorFrom: blue
colorTo: pink
sdk: docker
app_port: 8080
pinned: false
---
# Think in Sync

You will be given a secret word. You aim to describe this secret word so an AI can guess it.
However, you can only say one word at a time, taking turns with another AI.

## Develop locally

You need Node.js and npm installed on your system.

Add a .env file with `VITE_MISTRAL_API_KEY=xxx` to query Mistral LLM from your local environment.

```
npm i
npm run dev
```

## What technologies are used for this project?

This project is built with

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
