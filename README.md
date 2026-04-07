# Compidant

A conversational React app that recommends Korean AI competitions, hackathons, and contests based on your goals, build style, team situation, and interests.

> **comp** (competition) + **confidant** (trusted advisor) = **Compidant**

## Current Product Shape

The current version is a **4-step recommendation flow**:

1. What do you want?
2. How will you build?
3. Solo or team?
4. What are you interested in?

Before the questionnaire, users can choose one of three execution modes:

- `basic`: built-in data only, no AI calls
- `gemini`: Gemini API key-based AI analysis and live search
- `artifact`: Claude Artifact-oriented AI analysis and live search

After those answers, the app ranks matching competitions and, when the selected mode supports it, asks an AI provider for short strategy advice for the best active matches.

## Features

- Conversational question flow instead of a long form
- Rule-based ranking for competition matching
- Deadline-aware sorting with expired items pushed down
- Mode switching between basic recommendations, Gemini API, and Claude Artifact
- Optional live search that merges newly found competitions into the local list
- AI-generated recommendation commentary for the top active matches when the selected mode supports it
- Direct links to official competition pages
- Visible fallback messaging when live search or AI advice fails

## Project Structure

The code is now split by responsibility:

- `compidant.jsx`: stable entry file
- `src/Compidant.jsx`: main screen and state wiring
- `src/data/competitions.js`: built-in competition data
- `src/data/options.js`: question options
- `src/lib/recommendations.js`: scoring and sorting logic
- `src/services/competitionSearch.js`: live competition fetch/parsing
- `src/services/aiAdvice.js`: AI recommendation commentary
- `src/components/`: reusable UI pieces

## Data

The built-in dataset currently contains **8 fallback competitions** in `src/data/competitions.js`.

Live search can append additional competitions at runtime when the environment supports the Anthropic Messages API call used by the app.

## Tech Notes

- Framework: React
- Runtime: Vite + React
- Styling: inline style objects + Pretendard font CDN
- Data flow: local state with small service and utility modules
- API dependency: Anthropic Messages API in Artifact mode, Gemini API in Gemini mode

## Usage

Run the app locally with Vite:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

Key entry files:

- `index.html`: Vite HTML shell
- `src/main.jsx`: React mount point
- `src/Compidant.jsx`: main app component
- `compidant.jsx`: compatibility export kept for the original single-entry naming

## License

MIT
