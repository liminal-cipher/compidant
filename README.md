# Compidant

A conversational recommender for Korean AI competitions and hackathons.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> **comp**etition + con**fidant** = **Compidant**

## Motivation

공모전 정보는 주최 기관마다 흩어져 있고, 모아둔 목록형 사이트도 "내가 지금 지원할 만한가"에는 답하지 않는다. 분야, 팀 구성, 개발 방식 같은 조건은 공모전마다 제각각인데 목록은 대개 마감일순으로만 정렬된다. 조건 필터가 있어도 필터를 채우려면 조건 체계를 먼저 이해해야 한다.

Compidant는 긴 필터 폼 대신 네 개의 질문을 순서대로 던지고, 답에 맞는 것만 남겨서 보여준다.

## What It Does

실행 모드를 고른 뒤 4단계 질문에 답하면 추천 목록이 나온다.

1. 뭘 얻고 싶어요? (학습/포트폴리오/수상 경력/상금/창업)
2. 어떻게 만들 거예요? (직접 코딩/바이브 코딩/노코드)
3. 혼자 할래요, 팀으로 할래요?
4. 어떤 분야에 관심 있어요?

| 모드 | 동작 |
|---|---|
| `basic` | 내장 데이터만 사용. API 호출 없음 |
| `gemini` | Gemini API 키로 실시간 검색과 AI 코멘트 |
| `artifact` | Claude Artifact 환경의 Anthropic Messages API 사용 |

- 규칙 기반 점수로 순위를 매기고, 마감이 지난 공모전은 뒤로 내린다
- 혼자/팀 선호가 공모전 요건과 어긋나면 목록에서 제외한다
- 실시간 검색이 찾은 공모전은 내장 목록에 합쳐진다
- 상위 항목에는 AI가 짧은 전략 코멘트를 붙인다 (모드가 지원할 때)
- 검색이나 AI 호출이 실패하면 조용히 넘어가지 않고 화면에 알린다

## Architecture

```
사용자 답변 (purpose, buildMethod, teamPref, interests)
        |
        v
src/lib/recommendations.js        점수 계산 -> 만료 여부 -> 정렬
        |                          purpose 일치 +3, 관심분야 일치당 +2,
        |                          개발 방식 적합 +2, 팀 구성 불일치 시 제외
        v
   추천 목록 (score >= 2)
        |
        +--- src/services/competitionSearch.js   실시간 검색 결과 병합
        |
        +--- src/services/aiAdvice.js            상위 항목 코멘트 생성
        |
        v
src/Compidant.jsx + src/components/   화면 렌더링
```

| 파일 | 역할 |
|---|---|
| `src/Compidant.jsx` | 화면과 상태 관리 |
| `src/data/competitions.js` | 내장 공모전 데이터 |
| `src/data/options.js` | 질문 선택지 |
| `src/lib/recommendations.js` | 점수 계산과 정렬 |
| `src/services/competitionSearch.js` | 실시간 검색과 파싱 |
| `src/services/aiAdvice.js` | AI 코멘트 생성 |
| `src/components/` | 재사용 UI 조각 |
| `compidant.jsx` | 단일 파일 시절 진입점을 유지하는 호환용 export |

## Tech Decisions

| 선택 | 이유 |
|---|---|
| 대화형 4단계 질문 | 필터 폼은 조건 체계를 이해해야 채울 수 있다. 질문은 순서대로 답만 하면 된다 |
| 규칙 기반 점수 (LLM 랭킹 아님) | 왜 추천됐는지 설명할 수 있어야 하고, 수십 건 규모에서 학습 기반 랭킹은 과하다 |
| 실행 모드 3개 | API 키가 없어도 첫 화면에서 막히지 않아야 한다. `basic`이 그 하한선이다 |
| API 키를 브라우저 localStorage에 보관 | 백엔드 없이 정적 배포하기 위해서. 키가 서버로 가지 않는다 |
| 인라인 스타일 객체 | 컴포넌트 4개 규모에서 CSS 빌드 체계를 얹을 이유가 없었다 |
| Vite | 단일 파일에서 모듈 분리로 넘어가면서 번들러가 필요해졌다 |

## Results & Limitations

**추천 품질은 미측정이다.** 정답셋도 사용자 평가도 없어서, 점수 가중치(목적 일치 3점, 관심 분야 일치당 2점 등)는 검증된 값이 아니라 직관으로 정한 값이다.

- **내장 데이터 8건은 전부 마감됐다.** 마감일이 2026년 4월 19일 ~ 6월 30일에 몰려 있어서, 실시간 검색을 켜지 않으면 지금은 거의 빈 목록이 나온다. 데이터를 코드에 박아둔 결과다.
- 실시간 검색은 LLM이 돌려주는 텍스트를 파싱하는 방식이라 출력 형식이 흔들리면 실패한다. 실패는 화면에 노출되지만 복구는 사용자의 재시도에 맡긴다.
- 검색으로 찾은 공모전의 마감일과 링크가 실제와 맞는지는 검증하지 않는다.
- 데스크톱 화면 기준으로만 만들었다. 모바일 레이아웃은 확인하지 않았다.

## Getting Started

```bash
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 연다.

`.env` 파일은 필요 없다. `gemini` 모드를 쓰려면 첫 화면에서 Gemini API 키를 입력하면 되고, 키는 브라우저 localStorage에만 저장된다. `basic` 모드는 키 없이 동작한다.

## Retrospective

**데이터를 코드에 박은 선택이 이 앱의 수명을 결정했다.** 공모전 목록은 몇 달이면 전부 만료되는데 그걸 파일로 들고 있었으니, 앱을 고치지 않아도 시간이 지나면 알아서 쓸모없어지는 구조였다. 다시 만든다면 목록을 외부 소스(공공데이터 포털 API, 기관 RSS)에서 주기적으로 가져오는 부분을 먼저 만들고 UI를 그 위에 얹었을 것이다.

모드를 세 개로 나눈 것도 결과를 비교해본 적이 없다. 같은 답변을 넣었을 때 `basic`과 `gemini`의 추천이 얼마나 달라지는지 재봤다면, AI를 붙일 가치가 있었는지 판단할 수 있었을 것이다.

## Status

동결 (2026-04-08 마지막 커밋). 내장 데이터가 만료된 상태로 유지 중이며 추가 개발 계획은 없다.

## License

MIT
