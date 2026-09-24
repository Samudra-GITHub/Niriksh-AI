# Niriksh AI

**An AI copilot for merchant transaction investigation and recovery.**

Niriksh AI investigates flagged merchant transactions, gives investigators a voice-driven copilot backed by memory of past cases, and triggers approved recovery workflows automatically — built for a payments-focused hackathon.

<br/>

<img src="./assets/hero-placeholder.svg" width="100%" alt="Niriksh AI hero" />

<br/>

## Overview

A merchant transaction gets flagged, an investigator opens the case, and Niriksh AI does three things: surfaces relevant historical context, lets the investigator talk to an AI copilot instead of typing, and — once approved — triggers the recovery workflow without manual handoff.

<br/>

## Features

| Feature | Description |
|:--|:--|
| Investigation | Case view for a flagged transaction, with AI-assisted analysis (`api/investigation`) |
| Voice copilot | Speech-to-text and text-to-speech so investigators can talk through a case (`api/speech`) |
| Memory / timeline | Historical context for a merchant, fed into the copilot (`api/memory`) |
| Merchant lookup | Merchant-level data (`api/merchant`) |
| Recovery workflow | Triggers an approved recovery workflow via n8n (`api/workflow`) |
| Dashboard | Aggregated activity and case view (`api/dashboard`, `api/activity`) |

<br/>

## Dashboards

<table width="100%">
<tr>
<td width="50%"><img src="./assets/screenshot-placeholder.svg" width="100%" alt="Dashboard" /><br/><sub align="center">Dashboard</sub></td>
<td width="50%"><img src="./assets/screenshot-placeholder.svg" width="100%" alt="Investigation view" /><br/><sub align="center">Investigation view</sub></td>
</tr>
</table>

<br/>

## AI Providers

- **[Sarvam AI](https://dashboard.sarvam.ai)** — drives active investigations and the voice copilot (speech-to-text / text-to-speech)
- **[Cognee](https://docs.cognee.ai)** — powers the memory/timeline layer that gives the copilot historical context
- **n8n** — runs the merchant-approved recovery workflow via webhook
- **Supabase** — data layer (schema defined; live queries not yet wired in — see note below)

<br/>

## Architecture

```
┌───────────────┐     HTTPS      ┌────────────────────┐
│  Next.js frontend │ ────────────▶ │  FastAPI backend      │
└───────────────┘    ◀──────────── └──────────┬─────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    ▼                          ▼                          ▼
           ┌────────────────┐        ┌──────────────────┐        ┌──────────────┐
           │ Sarvam AI         │        │ Cognee               │        │ n8n            │
           │ (investigation +   │        │ (memory/timeline)     │        │ (recovery        │
           │ voice copilot)     │        │                        │        │ workflow)        │
           └────────────────┘        └──────────────────┘        └──────────────┘
```

<br/>

## Setup

**Backend**

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # see Environment Variables below
uvicorn app.main:app --reload
```

**Frontend**

```bash
npm install
npm run dev
```

<br/>

## Environment Variables

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=

SARVAM_API_KEY=          # required for real investigations + voice copilot
COGNEE_API_KEY=          # required for real memory/timeline
N8N_WEBHOOK_URL=         # required for the recovery workflow to actually fire

CORS_ORIGINS=http://localhost:3000
```

Every integration degrades gracefully when its key is missing — investigations fall back to a mocked response, memory falls back to a local mocked history, and the workflow endpoint still responds but skips the real webhook call. Nothing errors out to the end user.

<br/>

## Roadmap

- [x] Investigation view with AI-assisted analysis
- [x] Voice copilot (speech-to-text / text-to-speech)
- [x] Memory/timeline for historical context
- [x] Automated recovery workflow trigger
- [ ] Wire Supabase queries to real tables (currently mocked)
- [ ] Multi-merchant case history

<br/>

## Tech Stack

**Backend** — `FastAPI` · `Pydantic` · `Supabase` · `httpx`
**Frontend** — `Next.js` · `React` · `TypeScript`

<br/>

## License

MIT — see [LICENSE](./LICENSE).

<br/>

<sub>Built for a payments-focused hackathon. Part of the Samudra OS product ecosystem — see the [profile](https://github.com/Samudra-GITHub) for the full lineup.</sub>
