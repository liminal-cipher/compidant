import { useEffect, useRef, useState } from "react";
import CompetitionCard from "./components/CompetitionCard.jsx";
import DotLoader from "./components/DotLoader.jsx";
import InterestSelector from "./components/InterestSelector.jsx";
import OptionCard from "./components/OptionCard.jsx";
import { FALLBACK_COMPETITIONS } from "./data/competitions.js";
import {
  BUILD_METHODS,
  INTERESTS,
  PURPOSES,
  TEAM_OPTIONS,
} from "./data/options.js";
import { getRecommendedCompetitions } from "./lib/recommendations.js";
import { fetchAiAdvice } from "./services/aiAdvice.js";
import { fetchLiveCompetitions } from "./services/competitionSearch.js";

const font = `'Pretendard Variable','Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif`;

const S = {
  root: {
    fontFamily: font,
    background: "#0a0a0f",
    color: "#e2e2e8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 16px 80px",
  },
  container: {
    width: "100%",
    maxWidth: 640,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: { textAlign: "center", padding: "32px 0 8px" },
  title: {
    fontSize: 28,
    fontWeight: 800,
    background: "linear-gradient(135deg,#6ee7b7,#3b82f6,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  subtitle: { color: "#6b6b80", fontSize: 14, marginTop: 8 },
  bubble: (visible) => ({
    background: "#16161e",
    border: "1px solid #2a2a3a",
    borderRadius: 20,
    padding: "24px 20px",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
  }),
  question: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    lineHeight: 1.4,
  },
  grid: { display: "grid", gap: 10 },
  option: (selected, hovered) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 14,
    border: `1.5px solid ${selected ? "#6ee7b7" : hovered ? "#4a4a5a" : "#2a2a3a"}`,
    background: selected ? "#6ee7b715" : "#0f0f18",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: 15,
  }),
  optionEmoji: { fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 },
  optionLabel: { fontWeight: 600 },
  optionDesc: { fontSize: 12, color: "#6b6b80", marginTop: 2 },
  chip: (selected) => ({
    display: "inline-flex",
    padding: "10px 18px",
    borderRadius: 24,
    border: `1.5px solid ${selected ? "#3b82f6" : "#2a2a3a"}`,
    background: selected ? "#3b82f620" : "#0f0f18",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: 14,
    fontWeight: 500,
  }),
  nextBtn: (active) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    borderRadius: 14,
    border: "none",
    background: active ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "#1a1a28",
    color: active ? "#0a0a0f" : "#4a4a5a",
    fontWeight: 700,
    fontSize: 15,
    cursor: active ? "pointer" : "default",
    transition: "all 0.3s ease",
    marginTop: 8,
    fontFamily: font,
  }),
  card: {
    background: "#16161e",
    border: "1px solid #2a2a3a",
    borderRadius: 18,
    padding: 20,
    transition: "all 0.25s ease",
  },
  tag: (color) => ({
    display: "inline-flex",
    padding: "3px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    background: color + "18",
    color,
    border: `1px solid ${color}30`,
  }),
  reset: {
    background: "none",
    border: "1px solid #2a2a3a",
    color: "#6b6b80",
    borderRadius: 12,
    padding: "10px 20px",
    cursor: "pointer",
    fontFamily: font,
    fontSize: 13,
    transition: "all 0.2s ease",
  },
  aiBox: {
    background: "linear-gradient(135deg,#6ee7b708,#3b82f608)",
    border: "1px solid #6ee7b730",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 20,
    color: "#6b6b80",
    fontSize: 14,
  },
  linkBtn: {
    display: "inline-flex",
    padding: "6px 14px",
    borderRadius: 10,
    border: "1px solid #3b82f640",
    background: "#3b82f612",
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    marginTop: 8,
    transition: "all 0.2s ease",
  },
  refreshBtn: (loading) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 12,
    border: "1px solid #a78bfa40",
    background: "#a78bfa12",
    color: "#a78bfa",
    fontSize: 12,
    fontWeight: 600,
    cursor: loading ? "default" : "pointer",
    fontFamily: font,
    transition: "all 0.2s ease",
    opacity: loading ? 0.6 : 1,
  }),
  dataBadge: (isLive) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 8px",
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 600,
    background: isLive ? "#6ee7b718" : "#f59e0b18",
    color: isLive ? "#6ee7b7" : "#f59e0b",
    border: `1px solid ${isLive ? "#6ee7b730" : "#f59e0b30"}`,
  }),
  statusBox: (tone) => ({
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 14,
    fontSize: 13,
    lineHeight: 1.6,
    border:
      tone === "warning" ? "1px solid #f59e0b30" : "1px solid #6ee7b730",
    background:
      tone === "warning"
        ? "linear-gradient(135deg,#f59e0b10,#f9731608)"
        : "linear-gradient(135deg,#6ee7b710,#3b82f608)",
    color: tone === "warning" ? "#fcd34d" : "#b6f5d6",
  }),
};

const INITIAL_PROFILE = {
  purpose: null,
  buildMethod: null,
  teamPref: null,
  interests: [],
};

const INITIAL_UI = {
  step: 0,
  searchLoading: false,
  aiLoading: false,
  aiAdvice: "",
  hoveredCard: null,
  error: "",
  searchNotice: "",
};

export default function Compidant() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [dataState, setDataState] = useState({
    competitions: FALLBACK_COMPETITIONS,
    results: [],
    dataSource: "hardcoded",
  });
  const [uiState, setUiState] = useState(INITIAL_UI);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [uiState.step, dataState.results, uiState.aiAdvice]);

  const updateUi = (updates) => {
    setUiState((previous) => ({ ...previous, ...updates }));
  };

  const updateProfile = (key, value, nextStep) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
    setTimeout(() => {
      setUiState((previous) => ({
        ...previous,
        step: Math.max(previous.step, nextStep),
      }));
    }, 200);
  };

  const toggleInterest = (interestKey) => {
    setProfile((previous) => ({
      ...previous,
      interests: previous.interests.includes(interestKey)
        ? previous.interests.filter((interest) => interest !== interestKey)
        : [...previous.interests, interestKey],
    }));
  };

  const handleFetchLiveData = async () => {
    if (uiState.searchLoading) return;

    updateUi({ searchLoading: true, error: "", searchNotice: "" });

    try {
      const liveResult = await fetchLiveCompetitions({
        existingCompetitions: dataState.competitions,
      });

      setDataState((previous) => ({
        ...previous,
        competitions: liveResult.competitions,
        dataSource: liveResult.dataSource,
      }));
      updateUi({ searchNotice: liveResult.notice });
    } catch (error) {
      updateUi({ error: error.message });
    } finally {
      updateUi({ searchLoading: false });
    }
  };

  const handleGetResults = async () => {
    const results = getRecommendedCompetitions(dataState.competitions, profile);

    setDataState((previous) => ({ ...previous, results }));
    updateUi({ step: 4, aiAdvice: "", error: "" });

    const activeCompetitions = results
      .filter((competition) => competition.daysLeft > 0)
      .slice(0, 6);

    if (!activeCompetitions.length) return;

    updateUi({ aiLoading: true });
    try {
      const advice = await fetchAiAdvice({
        profile,
        competitions: activeCompetitions,
      });
      updateUi({ aiAdvice: advice });
    } catch (error) {
      updateUi({ aiAdvice: error.message });
    } finally {
      updateUi({ aiLoading: false });
    }
  };

  const reset = () => {
    setProfile(INITIAL_PROFILE);
    setDataState((previous) => ({ ...previous, results: [] }));
    setUiState((previous) => ({
      ...INITIAL_UI,
      searchNotice: previous.searchNotice,
    }));
  };

  const activeResultCount = dataState.results.filter(
    (result) => result.daysLeft > 0,
  ).length;
  const expiredResultCount = dataState.results.filter(
    (result) => result.daysLeft <= 0,
  ).length;

  return (
    <div style={S.root}>
      <link
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        rel="stylesheet"
      />

      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.title}>🎯 Compidant</h1>
          <p style={S.subtitle}>AI 대회 · 공모전 맞춤 추천</p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={S.dataBadge(dataState.dataSource === "live")}>
              {dataState.dataSource === "live"
                ? "🟢 실시간 데이터"
                : `🟡 저장된 데이터 (${dataState.competitions.length}개)`}
            </span>

            <button
              style={S.refreshBtn(uiState.searchLoading)}
              onClick={handleFetchLiveData}
            >
              {uiState.searchLoading ? (
                <>
                  검색 중<DotLoader />
                </>
              ) : (
                "🔄 최신 대회 검색"
              )}
            </button>
          </div>

          {uiState.error && (
            <div style={S.statusBox("warning")}>{uiState.error}</div>
          )}

          {uiState.searchNotice && (
            <div style={S.statusBox("success")}>{uiState.searchNotice}</div>
          )}
        </div>

        <div style={S.bubble(true)}>
          <div style={S.question}>뭘 얻고 싶어요?</div>
          <div style={S.grid}>
            {PURPOSES.map((purpose) => (
              <OptionCard
                key={purpose.key}
                item={purpose}
                selected={profile.purpose === purpose.key}
                onClick={() => updateProfile("purpose", purpose.key, 1)}
                optionStyle={S.option}
                optionEmojiStyle={S.optionEmoji}
                optionLabelStyle={S.optionLabel}
                optionDescStyle={S.optionDesc}
              />
            ))}
          </div>
        </div>

        {uiState.step >= 1 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>어떻게 만들 거예요?</div>
            <div style={S.grid}>
              {BUILD_METHODS.map((method) => (
                <OptionCard
                  key={method.key}
                  item={method}
                  selected={profile.buildMethod === method.key}
                  onClick={() => updateProfile("buildMethod", method.key, 2)}
                  optionStyle={S.option}
                  optionEmojiStyle={S.optionEmoji}
                  optionLabelStyle={S.optionLabel}
                  optionDescStyle={S.optionDesc}
                />
              ))}
            </div>
          </div>
        )}

        {uiState.step >= 2 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>혼자 할 거예요, 같이 할 거예요?</div>
            <div style={S.grid}>
              {TEAM_OPTIONS.map((teamOption) => (
                <OptionCard
                  key={teamOption.key}
                  item={teamOption}
                  selected={profile.teamPref === teamOption.key}
                  onClick={() => updateProfile("teamPref", teamOption.key, 3)}
                  optionStyle={S.option}
                  optionEmojiStyle={S.optionEmoji}
                  optionLabelStyle={S.optionLabel}
                  optionDescStyle={S.optionDesc}
                />
              ))}
            </div>
          </div>
        )}

        {uiState.step >= 3 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>어떤 분야에 관심 있어요?</div>

            <InterestSelector
              interests={profile.interests}
              options={INTERESTS}
              onToggle={toggleInterest}
              chipStyle={S.chip}
            />

            <button
              style={S.nextBtn(profile.interests.length > 0)}
              onClick={() => {
                if (profile.interests.length > 0) {
                  void handleGetResults();
                }
              }}
            >
              추천 받기 →
            </button>
          </div>
        )}

        {uiState.step >= 4 && dataState.results.length > 0 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>
              이런 건 어때요? 🎯
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#6b6b80",
                  marginLeft: 8,
                }}
              >
                {activeResultCount}개 진행중
                {expiredResultCount > 0 ? ` · ${expiredResultCount}개 마감` : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {dataState.results.map((competition) => (
                <CompetitionCard
                  key={competition.id}
                  competition={competition}
                  isHovered={uiState.hoveredCard === competition.id}
                  onMouseEnter={() => updateUi({ hoveredCard: competition.id })}
                  onMouseLeave={() => updateUi({ hoveredCard: null })}
                  styles={S}
                />
              ))}
            </div>

            {uiState.aiLoading && (
              <div style={S.loading}>
                <span>✨</span> AI가 맞춤 전략을 분석 중<DotLoader />
              </div>
            )}

            {uiState.aiAdvice && (
              <div style={S.aiBox}>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6ee7b7",
                    fontWeight: 700,
                    marginBottom: 10,
                    letterSpacing: "0.5px",
                  }}
                >
                  ✨ AI 맞춤 분석
                </div>
                {uiState.aiAdvice}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button style={S.reset} onClick={reset}>
                처음부터 다시 →
              </button>
            </div>
          </div>
        )}

        {uiState.step >= 4 && dataState.results.length === 0 && (
          <div style={S.bubble(true)}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🤔</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                조건에 딱 맞는 대회가 없네요
              </div>
              <div style={{ fontSize: 13, color: "#6b6b80", marginBottom: 16 }}>
                다른 조합으로 다시 시도해보세요
              </div>
              <button style={S.reset} onClick={reset}>
                다시 해볼래요 →
              </button>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
