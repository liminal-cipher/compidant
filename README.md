# Compidant 🎯

A conversational AI-powered tool that recommends Korean AI competitions, hackathons, and contests based on your goals, skills, and availability.

> **comp** (competition) + **confidant** (trusted advisor) = **compidant**

## How It Works

Answer 5 quick questions → get personalized competition recommendations with AI-generated strategy advice.

1. **What do you want?** — Learning / Portfolio / Awards / Prize money / Startup prep
2. **How will you build?** — Vibe coding / Direct coding / No-code
3. **Solo or team?** — Hard constraint filtering (no team-only contests for solo players)
4. **What tools can you use?** — Dynamic skill options based on build method
5. **How much time?** — Weekly commitment level

## Features

- **Conversational flow** — Feels like a chat, not a survey
- **Smart filtering** — Multi-factor scoring (purpose match + build method + team + skills + time)
- **AI analysis** — Claude API generates personalized strategy advice for top matches
- **D-day tracking** — Deadline-based sorting, expired contests shown separately
- **Direct links** — One-tap access to official competition sites

## Data

15 verified Korean AI competitions as of 2026.04.06, including:

| Competition                   | Prize      | Source          |
| ----------------------------- | ---------- | --------------- |
| AI Champion                   | ₩2.6B      | 과기정통부      |
| AI Rookie                     | ₩350M      | 과기정통부·NIPA |
| 전국민 AI 경진대회 (5 tracks) | ₩3B total  | 과기정통부      |
| 빅콘테스트                    | ~₩17M      | NIA             |
| 모두의창업                    | up to ₩1B+ | 중기부          |

Data is hardcoded in `compidant.jsx`. Schema is designed for future migration to web-search-based data fetching.

## Tech Stack

| Component | Choice                       | Why                                                             |
| --------- | ---------------------------- | --------------------------------------------------------------- |
| Framework | React (Claude Artifact)      | Zero-cost hosting, shareable via Claude                         |
| AI        | Claude Sonnet 4 API          | Personalized recommendation text, no API key needed in Artifact |
| Styling   | Inline CSS + Pretendard font | Single-file, no build step                                      |
| Cost      | **$0**                       | Runs inside Claude Artifact environment                         |

## Usage

Open `compidant.jsx` as a Claude Artifact, or copy the code into any React environment.

## License

MIT
