import { useState } from "react";

// ─── VERIFIED COMPETITION DATA (as of 2026.04.06) ──────────────────────────
const COMPETITIONS = [
  {
    id: 1,
    name: "AI 챔피언 대회",
    host: "과기정통부·NIPA·TTA",
    prize: "26억원",
    prizeNum: 2600000000,
    deadline: "2026-04-24",
    categories: ["money", "award", "portfolio"],
    skills: ["python", "ai_ml"],
    description: "AI 전 분야 최고 수준 연구팀 간 경쟁. 1위 5억원",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    timeCommit: "high",
    url: "https://ai-champion.or.kr",
  },
  {
    id: 2,
    name: "AI 루키 대회",
    host: "과기정통부·NIPA",
    prize: "3.5억원",
    prizeNum: 350000000,
    deadline: "2026-05-08",
    categories: ["money", "award", "learning", "portfolio"],
    skills: ["python", "ai_ml", "web"],
    description: "전공무관 대학생(만34세 이하) 대상. 1위 5000만원",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: false,
    timeCommit: "medium",
    url: "https://ai-rookie.or.kr",
  },
  {
    id: 3,
    name: "전국민 AI - AI 퀴즈",
    host: "과기정통부",
    prize: "총 30억원(전체)",
    prizeNum: 3000000000,
    deadline: "2026-11-30",
    categories: ["learning", "award"],
    skills: [],
    description: "코딩 없이 AI 지식 퀴즈로 참여. 누구나 가능",
    team: "solo",
    teamDesc: "개인",
    vibeOk: false,
    nocode: true,
    timeCommit: "low",
    url: "https://aichallenge4all.or.kr",
  },
  {
    id: 4,
    name: "전국민 AI - AI 창작대회",
    host: "과기정통부",
    prize: "총 30억원(전체)",
    prizeNum: 3000000000,
    deadline: "2026-11-30",
    categories: ["portfolio", "award", "learning"],
    skills: ["ai_ml", "video", "design"],
    description: "생성형 AI를 활용한 창작 콘텐츠 제작",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    timeCommit: "low",
    url: "https://aichallenge4all.or.kr",
  },
  {
    id: 5,
    name: "전국민 AI - 활용 사례 공모전",
    host: "과기정통부",
    prize: "총 30억원(전체)",
    prizeNum: 3000000000,
    deadline: "2026-11-30",
    categories: ["portfolio", "award", "startup"],
    skills: ["ai_ml", "web", "data", "plan"],
    description: "일상/업무에서 AI를 활용한 혁신 사례 공모",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    timeCommit: "medium",
    url: "https://aichallenge4all.or.kr",
  },
  {
    id: 6,
    name: "AI Co-Scientist Challenge",
    host: "과기정통부·한국연구재단",
    prize: "최대 25억원 사업화지원",
    prizeNum: 2500000000,
    deadline: "2026-04-03",
    categories: ["award", "portfolio", "money"],
    skills: ["python", "ai_ml"],
    description: "AI활용 연구보고서 + AI Agent 개발",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    timeCommit: "high",
    url: "https://co-scientist.kr",
  },
  {
    id: 7,
    name: "서울시 빅데이터 경진대회",
    host: "서울특별시",
    prize: "2350만원",
    prizeNum: 23500000,
    deadline: "2026-05-13",
    categories: ["portfolio", "award", "startup"],
    skills: ["python", "data", "ai_ml", "web"],
    description: "서울 공공데이터+AI기술 필수. 3개 부문",
    team: "both",
    teamDesc: "개인/팀(5명이내)",
    vibeOk: false,
    nocode: false,
    timeCommit: "medium",
    url: "https://news.seoul.go.kr/gov/archives/576001",
  },
  {
    id: 8,
    name: "AI·SW중심대학 디지털 경진대회",
    host: "IITP",
    prize: "미정",
    prizeNum: 10000000,
    deadline: "2026-08-11",
    categories: ["award", "learning", "portfolio"],
    skills: ["python", "ai_ml", "web"],
    description: "AI Agent 기반 SW개발 + 의사결정 예측 챌린지",
    team: "team",
    teamDesc: "팀",
    vibeOk: false,
    nocode: false,
    timeCommit: "medium",
    url: "https://www.swuniv.kr",
  },
  {
    id: 9,
    name: "국토·교통 데이터 경진대회",
    host: "국토교통부",
    prize: "창업연계지원",
    prizeNum: 5000000,
    deadline: "2026-06-30",
    categories: ["startup", "portfolio", "award"],
    skills: ["data", "ai_ml", "web", "plan"],
    description: "국토교통 데이터+AI. 10팀 선발 후 창업연계",
    team: "both",
    teamDesc: "개인/팀(3인이하)",
    vibeOk: true,
    nocode: true,
    timeCommit: "medium",
    url: "#",
  },
  {
    id: 10,
    name: "전국민 AI - 국민행복 AI 경진대회",
    host: "과기정통부",
    prize: "총 30억원(전체)",
    prizeNum: 3000000000,
    deadline: "2026-11-30",
    categories: ["learning", "award"],
    skills: ["plan"],
    description: "디지털 취약계층 대상 기초 AI 활용 대회",
    team: "solo",
    teamDesc: "개인",
    vibeOk: false,
    nocode: true,
    timeCommit: "low",
    url: "https://aichallenge4all.or.kr",
  },
  {
    id: 11,
    name: "모두의창업 프로젝트",
    host: "중소벤처기업부",
    prize: "최종 10억원+투자",
    prizeNum: 1000000000,
    deadline: "2026-05-31",
    categories: ["startup", "money"],
    skills: ["ai_ml", "web", "plan", "data"],
    description: "전국민 창업 오디션. 5000명 선발, 200만원~10억원",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    timeCommit: "high",
    url: "https://modoo.business",
  },
  {
    id: 12,
    name: "KBI 금융 AI 콘텐츠 공모전",
    host: "한국금융연수원",
    prize: "대상 100만원",
    prizeNum: 1000000,
    deadline: "2026-04-13",
    categories: ["portfolio", "learning"],
    skills: ["ai_ml", "video", "design"],
    description: "생성형 AI로 금융 홍보 콘텐츠 제작",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: true,
    nocode: true,
    timeCommit: "low",
    url: "https://www.kbi.or.kr",
  },
  {
    id: 13,
    name: "빅콘테스트",
    host: "NIA",
    prize: "약 1700만원",
    prizeNum: 17000000,
    deadline: "2026-09-30",
    categories: ["money", "award", "portfolio"],
    skills: ["python", "data", "ai_ml"],
    description: "국내 대표 데이터 분석 경진대회. 매년 7~8월 공고",
    team: "team",
    teamDesc: "팀(2~4인)",
    vibeOk: false,
    nocode: false,
    timeCommit: "high",
    url: "https://www.bigcontest.or.kr",
  },
  {
    id: 14,
    name: "전국민 AI - 리부트 AI 활용대회",
    host: "과기정통부",
    prize: "총 30억원(전체)",
    prizeNum: 3000000000,
    deadline: "2026-11-30",
    categories: ["learning", "portfolio", "award"],
    skills: ["ai_ml", "plan"],
    description: "쉬었음 청년, 경력보유 여성 등 대상. 취·창업 연계",
    team: "solo",
    teamDesc: "개인",
    vibeOk: true,
    nocode: true,
    timeCommit: "low",
    url: "https://aichallenge4all.or.kr",
  },
  {
    id: 15,
    name: "Dacon 월간 챌린지",
    host: "Dacon",
    prize: "수상인증서",
    prizeNum: 0,
    deadline: "매월 말",
    categories: ["learning", "portfolio"],
    skills: ["python", "ai_ml", "data"],
    description: "매달 새로운 ML 문제. 입문자 학습 최적",
    team: "both",
    teamDesc: "개인/팀",
    vibeOk: false,
    nocode: false,
    timeCommit: "low",
    url: "https://dacon.io",
  },
];

// ─── FILTER OPTIONS ─────────────────────────────────────────────────────────
const PURPOSES = [
  { key: "money", label: "💰 돈 벌기" },
  { key: "award", label: "🏆 수상 경력" },
  { key: "portfolio", label: "📁 포트폴리오" },
  { key: "learning", label: "📚 학습/성장" },
  { key: "startup", label: "🚀 창업 준비" },
];

const BUILD_METHODS = [
  { key: "vibe", label: "🤖 바이브 코딩" },
  { key: "code", label: "💻 직접 코딩" },
  { key: "nocode", label: "🎨 노코드/기획" },
];

const TEAM_OPTIONS = [
  { key: "solo", label: "🙋 혼자" },
  { key: "team", label: "👥 팀 있음" },
  { key: "any", label: "🤷 상관없음" },
];

const TIME_OPTIONS = [
  { key: "low", label: "🌙 주 5시간 이하" },
  { key: "medium", label: "⚡ 주 10시간+" },
  { key: "high", label: "🔥 풀타임" },
];

// ─── MATCHING LOGIC ─────────────────────────────────────────────────────────
function matchScore(comp, purpose, buildMethod, teamPref, skills, timePref) {
  let score = 0;
  if (comp.categories.includes(purpose)) score += 3;
  if (buildMethod === "vibe" && comp.vibeOk) score += 2;
  else if (buildMethod === "code" && !comp.nocode) score += 2;
  else if (buildMethod === "nocode" && comp.nocode) score += 2;
  else if (buildMethod === "nocode" && !comp.nocode) score -= 3;
  if (teamPref === "solo" && comp.team === "team")
    return { score: -1, skillMatch: 0, total: skills.length };
  if (teamPref === "team" && comp.team === "solo")
    return { score: -1, skillMatch: 0, total: skills.length };
  const skillMatch = skills.filter((s) => comp.skills.includes(s)).length;
  score += skillMatch;
  if (comp.skills.length === 0 && buildMethod === "nocode") score += 1;
  const tr = { low: 1, medium: 2, high: 3 };
  if (tr[timePref] >= tr[comp.timeCommit]) score += 1;
  return { score, skillMatch, total: skills.length };
}

function daysUntil(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return 999;
  return Math.ceil((new Date(d) - new Date()) / 86400000);
}

// ─── MINIMAL RENDER (data + logic verification) ─────────────────────────────
export default function CompFinder() {
  const [results, setResults] = useState([]);

  const runTest = () => {
    const scored = COMPETITIONS.map((c) => ({
      ...c,
      ...matchScore(c, "money", "code", "any", ["python", "ai_ml"], "medium"),
      daysLeft: daysUntil(c.deadline),
    }))
      .filter((c) => c.score >= 2)
      .sort((a, b) => b.score - a.score);
    setResults(scored);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui",
        padding: 24,
        background: "#0a0a0f",
        color: "#e2e2e8",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: 24 }}>CompFinder v1 — Data & Logic</h1>
      <p style={{ color: "#6b6b80" }}>
        15 verified competitions loaded. Click to test filtering.
      </p>
      <button
        onClick={runTest}
        style={{
          padding: "10px 20px",
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        Test: 💰돈벌기 + 💻직접코딩 + Python,AI/ML + ⚡주10시간+
      </button>
      {results.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#16161e",
            border: "1px solid #2a2a3a",
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
            opacity: c.daysLeft <= 0 ? 0.5 : 1,
          }}
        >
          <strong>{c.name}</strong> — {c.prize} — D-
          {c.daysLeft <= 0 ? "마감" : c.daysLeft} — score: {c.score} — skills:{" "}
          {c.skillMatch}/{c.total}
        </div>
      ))}
    </div>
  );
}
