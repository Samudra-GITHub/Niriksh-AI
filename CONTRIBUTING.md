# Contributing to Niriksh AI

Thanks for considering a contribution to this hackathon project.

## Getting set up

```bash
git clone https://github.com/Samudra-GITHub/Niriksh-AI.git
cd Niriksh-AI

# backend
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# frontend (separate terminal, from repo root)
npm install
npm run dev
```

Every third-party integration (Sarvam, Cognee, n8n) degrades to a mocked response when its key is missing — you don't need real credentials to develop against most of the app.

## Before opening a PR

Backend and frontend should both build/run cleanly. If you add a new environment variable, document it in `backend/.env.example` and the main README.

## Scope

- Backend routes belong in `backend/app/routes/`, services in `backend/app/services/`.
- Keep the "graceful degradation without a key" pattern for any new integration — don't make a missing API key a hard failure.

## Reporting issues

Use the issue templates under `.github/ISSUE_TEMPLATE/`.
