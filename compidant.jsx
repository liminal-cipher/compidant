import { useState, useEffect, useRef } from "react";

// ─── COMPETITION DATA (CSV import 2026.04.07) ───────────────────────────────
const FALLBACK_COMPETITIONS = [
  {
    id: 1,
    name: "법령데이터 활용 아이디어 공모전",
    host: "법제처",
    prize: "최우수 2점·우수 4점 + 범정부 창업대회 본선 추천",
    prizeNum: 0,
    deadline: "2026-05-29",
    categories: ["portfolio", "award", "startup"],
    interests: ["public", "data"],
    description:
      "법령 공공데이터 활용 아이디어 기획. 상위 2점 범정부 창업대회 본선 추천",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    url: "https://linkareer.com/activity/312436",
  },
  {
    id: 2,
    name: "전국 통합데이터 활용 공모전",
    host: "통계청",
    prize: "대상 400만원",
    prizeNum: 4000000,
    deadline: "2026-04-28",
    categories: ["money", "award", "portfolio"],
    interests: ["data", "ai"],
    description: "통합데이터 활용 분석·시각화. 대상 400만원, 최우수 300만원",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    url: "https://linkareer.com/activity/311947",
  },
  {
    id: 3,
    name: "성평등가족부 AI·공공데이터 공모전",
    host: "여성가족부",
    prize: "대상 300만원 + 장관상",
    prizeNum: 3000000,
    deadline: "2026-05-04",
    categories: ["money", "award", "portfolio"],
    interests: ["ai", "data", "public"],
    description: "AI·공공데이터 활용 성평등 정책 제안. 대상 300만원 + 장관상",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    url: "https://linkareer.com/activity/311806",
  },
  {
    id: 4,
    name: "AI Hack Camp 2026",
    host: "과기정통부",
    prize: "대상 200만원 (부총리상)",
    prizeNum: 2000000,
    deadline: "2026-04-24",
    categories: ["portfolio", "award", "learning"],
    interests: ["ai", "web"],
    description: "무박 2일 AI 해커톤(5/16~17). 대상 부총리상 + 200만원",
    team: "team",
    teamDesc: "팀",
    vibeOk: true,
    nocode: false,
    url: "https://www.science.go.kr/mps/1111/bbs/208/moveBbsNttDetail.do?nttSn=48958",
  },
  {
    id: 5,
    name: "교육 공공데이터 AI 활용대회",
    host: "교육부",
    prize: "대상 500만원 (교육부장관상)",
    prizeNum: 5000000,
    deadline: "2026-05-31",
    categories: ["money", "award", "portfolio"],
    interests: ["ai", "data", "public"],
    description: "교육 공공데이터+AI 서비스 개발. 대상 500만원 + 교육부장관상",
    team: "team",
    teamDesc: "팀",
    vibeOk: true,
    nocode: false,
    url: "https://linkareer.com/activity/312188",
  },
  {
    id: 6,
    name: "엔지니어링산업 경진대회",
    host: "한국엔지니어링협회",
    prize: "대상 500만원 + 장관상 + 채용연계",
    prizeNum: 5000000,
    deadline: "2026-04-30",
    categories: ["money", "award", "portfolio"],
    interests: ["hardware", "web"],
    description: "엔지니어링 설계/BIM 부문. 대상 500만원 + 채용연계",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    url: "https://engcontest.kenca.or.kr/index.php",
  },
  {
    id: 7,
    name: "Blaybus 서비스 문제 해결 개발 공모전",
    host: "Blaybus",
    prize: "상장 + 인증서 (상금 없음)",
    prizeNum: 0,
    deadline: "2026-04-19",
    categories: ["portfolio", "learning"],
    interests: ["web", "ai"],
    description: "실제 서비스 문제 해결 개발 공모. 수행기간 4/21~4/30",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: false,
    url: "https://www.blaybus.com/activities/789/landing",
  },
  {
    id: 8,
    name: "아두이노 메이커 공모전",
    host: "디바이스마트",
    prize: "대상 100만원 (총 400만원 상당)",
    prizeNum: 1000000,
    deadline: "2026-06-30",
    categories: ["portfolio", "learning"],
    interests: ["hardware"],
    description: "아두이노 기반 메이커 프로젝트 공모. 대상 100만원",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    url: "https://www.devicemart.co.kr/board/?id=arduino_contest",
  },
];

// ─── OPTIONS ────────────────────────────────────────────────────────────────
const PURPOSES = [
  {
    key: "learning",
    emoji: "📚",
    label: "학습/성장",
    desc: "실력을 키우고 싶어",
  },
  {
    key: "portfolio",
    emoji: "📁",
    label: "포트폴리오",
    desc: "보여줄 게 필요해",
  },
  { key: "award", emoji: "🏆", label: "수상 경력", desc: "이력서에 한 줄" },
  { key: "money", emoji: "💰", label: "돈 벌기", desc: "상금이 곧 정의" },
  {
    key: "startup",
    emoji: "🚀",
    label: "창업 준비",
    desc: "사업 아이템 테스트",
  },
];

const BUILD_METHODS = [
  { key: "vibe", emoji: "🤖", label: "바이브 코딩", desc: "AI한테 시키면 됨" },
  { key: "code", emoji: "💻", label: "직접 코딩", desc: "내가 짠다" },
  { key: "nocode", emoji: "🎨", label: "노코드/기획", desc: "코딩 안 함" },
];

const TEAM_OPTIONS = [
  { key: "solo", emoji: "🙋", label: "혼자", desc: "솔로 플레이" },
  { key: "team", emoji: "👥", label: "팀 있음", desc: "같이 할 사람 있어" },
  { key: "any", emoji: "🤷", label: "상관없음", desc: "유연하게" },
];

const INTERESTS = [
  { key: "data", emoji: "📊", label: "데이터/통계" },
  { key: "ai", emoji: "🤖", label: "AI/머신러닝" },
  { key: "web", emoji: "🌐", label: "웹/앱 서비스" },
  { key: "public", emoji: "🏛️", label: "공공/정책" },
  { key: "content", emoji: "🎨", label: "콘텐츠/디자인" },
  { key: "hardware", emoji: "🔧", label: "하드웨어/IoT" },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
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
  bubble: (v) => ({
    background: "#16161e",
    border: "1px solid #2a2a3a",
    borderRadius: 20,
    padding: "24px 20px",
    opacity: v ? 1 : 0,
    transform: v ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
  }),
  question: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 16,
    lineHeight: 1.4,
  },
  grid: { display: "grid", gap: 10 },
  option: (sel, hov) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    borderRadius: 14,
    border: `1.5px solid ${sel ? "#6ee7b7" : hov ? "#4a4a5a" : "#2a2a3a"}`,
    background: sel ? "#6ee7b715" : "#0f0f18",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: 15,
  }),
  optionEmoji: { fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 },
  optionLabel: { fontWeight: 600 },
  optionDesc: { fontSize: 12, color: "#6b6b80", marginTop: 2 },
  chip: (sel) => ({
    display: "inline-flex",
    padding: "10px 18px",
    borderRadius: 24,
    border: `1.5px solid ${sel ? "#3b82f6" : "#2a2a3a"}`,
    background: sel ? "#3b82f620" : "#0f0f18",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: 14,
    fontWeight: 500,
  }),
  nextBtn: (a) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    borderRadius: 14,
    border: "none",
    background: a ? "linear-gradient(135deg,#6ee7b7,#3b82f6)" : "#1a1a28",
    color: a ? "#0a0a0f" : "#4a4a5a",
    fontWeight: 700,
    fontSize: 15,
    cursor: a ? "pointer" : "default",
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
  tag: (c) => ({
    display: "inline-flex",
    padding: "3px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    background: c + "18",
    color: c,
    border: `1px solid ${c}30`,
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
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
function matchScore(comp, purpose, buildMethod, teamPref, interests) {
  let score = 0;
  if (comp.categories.includes(purpose)) score += 3;
  if (buildMethod === "vibe" && comp.vibeOk) score += 2;
  else if (buildMethod === "code" && !comp.nocode) score += 2;
  else if (buildMethod === "code" && comp.nocode) score += 1;
  else if (buildMethod === "nocode" && comp.nocode) score += 2;
  else if (buildMethod === "nocode" && !comp.nocode) score -= 3;
  if (teamPref === "solo" && comp.team === "team")
    return { score: -1, interestMatch: 0, total: interests.length };
  if (teamPref === "team" && comp.team === "solo")
    return { score: -1, interestMatch: 0, total: interests.length };
  const interestMatch = interests.filter((i) =>
    comp.interests.includes(i),
  ).length;
  score += interestMatch * 2;
  return { score, interestMatch, total: interests.length };
}

function daysUntil(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return 999;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

function DotLoader() {
  const [d, setD] = useState("");
  useEffect(() => {
    const id = setInterval(
      () => setD((p) => (p.length >= 3 ? "" : p + ".")),
      400,
    );
    return () => clearInterval(id);
  }, []);
  return <span>{d}</span>;
}

function Opt({ item, selected, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div
      style={S.option(selected, h)}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span style={S.optionEmoji}>{item.emoji}</span>
      <div>
        <div style={S.optionLabel}>{item.label}</div>
        {item.desc && <div style={S.optionDesc}>{item.desc}</div>}
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────
export default function Compidant() {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState(null);
  const [buildMethod, setBuildMethod] = useState(null);
  const [teamPref, setTeamPref] = useState(null);
  const [interests, setInterests] = useState([]);
  const [results, setResults] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [competitions, setCompetitions] = useState(FALLBACK_COMPETITIONS);
  const [dataSource, setDataSource] = useState("hardcoded");
  const [searchLoading, setSearchLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step, results, aiAdvice]);

  const toggleInterest = (k) =>
    setInterests((p) => (p.includes(k) ? p.filter((s) => s !== k) : [...p, k]));

  const fetchLiveData = async () => {
    setSearchLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [
            {
              role: "user",
              content: `오늘은 ${today}입니다. 현재 접수 가능하거나 곧 접수 예정인 한국 AI/데이터 경진대회, 해커톤, 공모전을 찾아주세요. Dacon, AI Factory, 올콘, 위비티, 링커리어, 정부 공고 등을 검색해서 현재 진행 중인 대회를 최대한 많이 찾아주세요.

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

마감일이 지난 대회는 제외. 최소 10개 이상.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text =
        data.content
          ?.filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("") || "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const withIds = parsed.map((c, i) => ({ ...c, id: 200 + i }));
        const existingNames = new Set(FALLBACK_COMPETITIONS.map((c) => c.name));
        const newComps = withIds.filter((c) => !existingNames.has(c.name));
        setCompetitions([...FALLBACK_COMPETITIONS, ...newComps]);
        setDataSource("live");
      }
    } catch (e) {
      console.error("Live data fetch failed:", e);
    }
    setSearchLoading(false);
  };

  const getResults = () => {
    const scored = competitions
      .map((c) => ({
        ...c,
        ...matchScore(c, purpose, buildMethod, teamPref, interests),
        daysLeft: daysUntil(c.deadline),
      }))
      .filter((c) => c.score >= 2)
      .sort((a, b) => {
        const aExp = a.daysLeft <= 0 ? 1 : 0;
        const bExp = b.daysLeft <= 0 ? 1 : 0;
        if (aExp !== bExp) return aExp - bExp;
        return b.score - a.score || a.daysLeft - b.daysLeft;
      });
    setResults(scored);
    setStep(4);
    fetchAi(scored.filter((c) => c.daysLeft > 0).slice(0, 6));
  };

  const fetchAi = async (top) => {
    if (top.length === 0) return;
    setAiLoading(true);
    try {
      const pL = PURPOSES.find((p) => p.key === purpose)?.label;
      const bL = BUILD_METHODS.find((b) => b.key === buildMethod)?.label;
      const tL = TEAM_OPTIONS.find((t) => t.key === teamPref)?.label;
      const iL = interests.map(
        (i) => INTERESTS.find((it) => it.key === i)?.label || i,
      );
      const cl = top
        .map(
          (c) =>
            `- ${c.name} (상금: ${c.prize}, 마감: ${c.deadline}, ${c.teamDesc})`,
        )
        .join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `당신은 AI 대회/공모전 추천 어드바이저입니다. 친근하고 약간 위트있는 톤으로 답변해주세요.\n\n사용자 프로필:\n- 목적: ${pL}\n- 개발 방식: ${bL}\n- 팀 구성: ${tL}\n- 관심 분야: ${iL.join(", ")}\n\n필터링된 추천 대회:\n${cl}\n\n위 대회들 중 TOP 3를 골라서, 각각 왜 이 사용자에게 맞는지 1~2줄로 설명하고, 마지막에 전체적인 전략 조언을 2~3줄로 해주세요.\n마크다운 쓰지 말고 평문으로. 이모지는 적당히. 전체 답변 15줄 이내.`,
            },
          ],
        }),
      });
      const data = await res.json();
      setAiAdvice(data.content?.map((b) => b.text || "").join("") || "");
    } catch {
      setAiAdvice("AI 분석을 불러오지 못했어요. 위 추천 결과를 참고해주세요!");
    }
    setAiLoading(false);
  };

  const reset = () => {
    setStep(0);
    setPurpose(null);
    setBuildMethod(null);
    setTeamPref(null);
    setInterests([]);
    setResults([]);
    setAiAdvice("");
  };

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
            <span style={S.dataBadge(dataSource === "live")}>
              {dataSource === "live"
                ? "🟢 실시간 데이터"
                : `🟡 저장된 데이터 (${competitions.length}개)`}
            </span>
            <button
              style={S.refreshBtn(searchLoading)}
              onClick={() => !searchLoading && fetchLiveData()}
            >
              {searchLoading ? (
                <>
                  검색 중<DotLoader />
                </>
              ) : (
                "🔄 최신 대회 검색"
              )}
            </button>
          </div>
        </div>

        <div style={S.bubble(true)}>
          <div style={S.question}>뭘 얻고 싶어요?</div>
          <div style={S.grid}>
            {PURPOSES.map((p) => (
              <Opt
                key={p.key}
                item={p}
                selected={purpose === p.key}
                onClick={() => {
                  setPurpose(p.key);
                  setTimeout(() => setStep((s) => Math.max(s, 1)), 200);
                }}
              />
            ))}
          </div>
        </div>

        {step >= 1 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>어떻게 만들 거예요?</div>
            <div style={S.grid}>
              {BUILD_METHODS.map((b) => (
                <Opt
                  key={b.key}
                  item={b}
                  selected={buildMethod === b.key}
                  onClick={() => {
                    setBuildMethod(b.key);
                    setTimeout(() => setStep((s) => Math.max(s, 2)), 200);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step >= 2 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>혼자 할 거예요, 같이 할 거예요?</div>
            <div style={S.grid}>
              {TEAM_OPTIONS.map((t) => (
                <Opt
                  key={t.key}
                  item={t}
                  selected={teamPref === t.key}
                  onClick={() => {
                    setTeamPref(t.key);
                    setTimeout(() => setStep((s) => Math.max(s, 3)), 200);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step >= 3 && (
          <div style={S.bubble(true)}>
            <div style={S.question}>어떤 분야에 관심 있어요?</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {INTERESTS.map((i) => (
                <div
                  key={i.key}
                  style={S.chip(interests.includes(i.key))}
                  onClick={() => toggleInterest(i.key)}
                >
                  {i.emoji} {i.label}
                </div>
              ))}
            </div>
            <button
              style={S.nextBtn(interests.length > 0)}
              onClick={() => {
                if (interests.length > 0) getResults();
              }}
            >
              추천 받기 →
            </button>
          </div>
        )}

        {step >= 4 && results.length > 0 && (
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
                {results.filter((r) => r.daysLeft > 0).length}개 진행중
                {results.filter((r) => r.daysLeft <= 0).length > 0
                  ? ` · ${results.filter((r) => r.daysLeft <= 0).length}개 마감`
                  : ""}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {results.map((c) => (
                <div
                  key={c.id}
                  style={{
                    ...S.card,
                    borderColor:
                      hoveredCard === c.id
                        ? "#3b82f6"
                        : c.daysLeft <= 0
                          ? "#1a1a1a"
                          : "#2a2a3a",
                    transform:
                      hoveredCard === c.id ? "translateY(-2px)" : "none",
                    boxShadow:
                      hoveredCard === c.id ? "0 8px 24px #3b82f615" : "none",
                    opacity: c.daysLeft <= 0 ? 0.5 : 1,
                  }}
                  onMouseEnter={() => setHoveredCard(c.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>
                        {c.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#6b6b80", marginTop: 2 }}
                      >
                        {c.host} · {c.teamDesc}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: c.daysLeft <= 0 ? "#4a4a5a" : "#6ee7b7",
                        whiteSpace: "nowrap",
                        marginLeft: 12,
                      }}
                    >
                      {c.prize}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#9999aa",
                      marginBottom: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    {c.description}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.daysLeft <= 0 ? (
                      <span style={S.tag("#4a4a5a")}>마감됨</span>
                    ) : (
                      <span
                        style={S.tag(c.daysLeft <= 14 ? "#ef4444" : "#3b82f6")}
                      >
                        {c.daysLeft <= 14
                          ? `D-${c.daysLeft} 🔥`
                          : `D-${c.daysLeft}`}
                      </span>
                    )}
                    {c.total > 0 && (
                      <span style={S.tag("#a78bfa")}>
                        관심매칭 {c.interestMatch}/{c.total}
                      </span>
                    )}
                    {c.vibeOk && <span style={S.tag("#f472b6")}>바이브OK</span>}
                    {c.id >= 200 && <span style={S.tag("#6ee7b7")}>NEW</span>}
                  </div>
                  {c.url && c.url !== "#" && c.daysLeft > 0 && (
                    <div>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={S.linkBtn}
                      >
                        공식 사이트 →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {aiLoading && (
              <div style={S.loading}>
                <span>✨</span> AI가 맞춤 전략을 분석 중<DotLoader />
              </div>
            )}
            {aiAdvice && (
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
                {aiAdvice}
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button style={S.reset} onClick={reset}>
                처음부터 다시 →
              </button>
            </div>
          </div>
        )}

        {step >= 4 && results.length === 0 && (
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
