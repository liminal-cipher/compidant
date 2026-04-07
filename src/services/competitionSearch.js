const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const LIVE_SEARCH_MODEL = "claude-sonnet-4-20250514";

function createServiceError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function getTextContentBlocks(data) {
  return (
    data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("") || ""
  );
}

function extractJsonArray(text) {
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw createServiceError(
      "LIVE_PARSE_FAILED",
      "최신 대회 검색 결과를 읽지 못했어요. 저장된 데이터로 계속 추천할게요.",
    );
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw createServiceError(
      "LIVE_PARSE_FAILED",
      "최신 대회 검색 결과를 읽지 못했어요. 저장된 데이터로 계속 추천할게요.",
    );
  }
}

function normalizeCompetitionName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function buildLiveSearchPrompt(today) {
  return `오늘은 ${today}입니다. 현재 접수 가능하거나 곧 접수 예정인 한국 AI/데이터 경진대회, 해커톤, 공모전을 찾아주세요. Dacon, AI Factory, 올콘, 위비티, 링커리어, 정부 공고 등을 검색해서 현재 진행 중인 대회를 최대한 많이 찾아주세요.

각 대회에 대해 아래 JSON 배열 형식으로만 응답해주세요. 설명 텍스트 없이 JSON만:
[
  {
    "name": "대회명",
    "host": "주최기관",
    "prize": "상금(문자열)",
    "prizeNum": 숫자(원단위, 없으면 0),
    "deadline": "YYYY-MM-DD",
    "categories": ["money","award","portfolio","learning","startup" 중 해당],
    "interests": ["data","ai","web","public","content","hardware" 중 해당],
    "description": "한줄설명",
    "team": "solo" 또는 "team" 또는 "both",
    "teamDesc": "참가구성 설명",
    "vibeOk": true/false,
    "nocode": true/false,
    "url": "공식URL"
  }
]

마감일이 지난 대회는 제외. 최소 10개 이상.`;
}

export async function fetchLiveCompetitions({
  existingCompetitions,
  fetchImpl = globalThis.fetch,
  today = new Date(),
}) {
  if (typeof fetchImpl !== "function") {
    throw createServiceError(
      "LIVE_FETCH_UNAVAILABLE",
      "검색 기능을 사용할 수 없는 환경이에요. 저장된 데이터로 계속 추천할게요.",
    );
  }

  const formattedToday = today.toISOString().split("T")[0];

  let response;
  try {
    response = await fetchImpl(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: LIVE_SEARCH_MODEL,
        max_tokens: 4000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          {
            role: "user",
            content: buildLiveSearchPrompt(formattedToday),
          },
        ],
      }),
    });
  } catch {
    throw createServiceError(
      "LIVE_FETCH_FAILED",
      "최신 대회 검색에 실패했어요. 저장된 데이터로 계속 추천할게요.",
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw createServiceError(
      "LIVE_RESPONSE_INVALID",
      "최신 대회 검색 응답이 올바르지 않아요. 저장된 데이터로 계속 추천할게요.",
    );
  }

  const parsedCompetitions = extractJsonArray(getTextContentBlocks(data));
  if (!Array.isArray(parsedCompetitions) || parsedCompetitions.length === 0) {
    throw createServiceError(
      "LIVE_EMPTY_RESULT",
      "최신 대회 검색 결과가 비어 있어요. 저장된 데이터로 계속 추천할게요.",
    );
  }

  const normalizedExistingNames = new Set(
    existingCompetitions.map((competition) =>
      normalizeCompetitionName(competition.name),
    ),
  );

  let nextId =
    Math.max(
      199,
      ...existingCompetitions.map((competition) =>
        typeof competition.id === "number" ? competition.id : 0,
      ),
    ) + 1;

  const mergedCompetitions = [...existingCompetitions];
  let addedCount = 0;

  for (const competition of parsedCompetitions) {
    const normalizedName = normalizeCompetitionName(competition.name);
    if (!normalizedName || normalizedExistingNames.has(normalizedName)) {
      continue;
    }

    normalizedExistingNames.add(normalizedName);
    mergedCompetitions.push({
      ...competition,
      id: typeof competition.id === "number" ? competition.id : nextId++,
    });
    addedCount += 1;
  }

  return {
    competitions: mergedCompetitions,
    dataSource: "live",
    notice:
      addedCount > 0
        ? `실시간 검색으로 ${addedCount}개 대회를 추가했어요.`
        : "실시간 검색은 성공했지만 새로 추가된 대회는 없었어요.",
  };
}
