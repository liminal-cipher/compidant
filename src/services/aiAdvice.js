import {
  BUILD_METHODS,
  INTERESTS,
  PURPOSES,
  TEAM_OPTIONS,
} from "../data/options.js";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const AI_ADVICE_MODEL = "claude-sonnet-4-20250514";

export const AI_ADVICE_FALLBACK_MESSAGE =
  "AI 분석을 불러오지 못했어요. 위 추천 결과를 참고해주세요!";

function createServiceError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function findLabel(options, key) {
  return options.find((option) => option.key === key)?.label || key;
}

function getTextContentBlocks(data) {
  return (
    data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text || "")
      .join("") || ""
  ).trim();
}

function buildAdvicePrompt(profile, competitions) {
  const purposeLabel = findLabel(PURPOSES, profile.purpose);
  const buildMethodLabel = findLabel(BUILD_METHODS, profile.buildMethod);
  const teamLabel = findLabel(TEAM_OPTIONS, profile.teamPref);
  const interestLabels = profile.interests.map((interest) =>
    findLabel(INTERESTS, interest),
  );
  const competitionList = competitions
    .map(
      (competition) =>
        `- ${competition.name} (상금: ${competition.prize}, 마감: ${competition.deadline}, ${competition.teamDesc})`,
    )
    .join("\n");

  return `당신은 AI 대회/공모전 추천 어드바이저입니다. 친근하고 약간 위트있는 톤으로 답변해주세요.

사용자 프로필:
- 목적: ${purposeLabel}
- 개발 방식: ${buildMethodLabel}
- 팀 구성: ${teamLabel}
- 관심 분야: ${interestLabels.join(", ")}

필터링된 추천 대회:
${competitionList}

위 대회들 중 TOP 3를 골라서, 각각 왜 이 사용자에게 맞는지 1~2줄로 설명하고, 마지막에 전체적인 전략 조언을 2~3줄로 해주세요.
마크다운 쓰지 말고 평문으로. 이모지는 적당히. 전체 답변 15줄 이내.`;
}

export async function fetchAiAdvice({
  profile,
  competitions,
  fetchImpl = globalThis.fetch,
}) {
  if (!competitions.length) return "";

  if (typeof fetchImpl !== "function") {
    throw createServiceError(
      "AI_FETCH_UNAVAILABLE",
      AI_ADVICE_FALLBACK_MESSAGE,
    );
  }

  let response;
  try {
    response = await fetchImpl(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_ADVICE_MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: buildAdvicePrompt(profile, competitions),
          },
        ],
      }),
    });
  } catch {
    throw createServiceError("AI_FETCH_FAILED", AI_ADVICE_FALLBACK_MESSAGE);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw createServiceError(
      "AI_RESPONSE_INVALID",
      AI_ADVICE_FALLBACK_MESSAGE,
    );
  }

  const advice = getTextContentBlocks(data);
  if (!advice) {
    throw createServiceError("AI_EMPTY_RESULT", AI_ADVICE_FALLBACK_MESSAGE);
  }

  return advice;
}
