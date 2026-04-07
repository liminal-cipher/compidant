const MS_PER_DAY = 86400000;

export function matchScore(comp, profile) {
  const { purpose, buildMethod, teamPref, interests = [] } = profile;

  let score = 0;

  if (purpose && comp.categories.includes(purpose)) score += 3;

  if (buildMethod === "vibe" && comp.vibeOk) score += 2;
  else if (buildMethod === "code" && !comp.nocode) score += 2;
  else if (buildMethod === "code" && comp.nocode) score += 1;
  else if (buildMethod === "nocode" && comp.nocode) score += 2;
  else if (buildMethod === "nocode" && !comp.nocode) score -= 3;

  if (teamPref === "solo" && comp.team === "team") {
    return { score: -1, interestMatch: 0, total: interests.length };
  }

  if (teamPref === "team" && comp.team === "solo") {
    return { score: -1, interestMatch: 0, total: interests.length };
  }

  const interestMatch = interests.filter((interest) =>
    comp.interests.includes(interest),
  ).length;

  score += interestMatch * 2;

  return { score, interestMatch, total: interests.length };
}

export function daysUntil(deadline, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return 999;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(`${deadline}T00:00:00`);
  return Math.ceil((targetDate - today) / MS_PER_DAY);
}

export function scoreCompetitions(competitions, profile, now = new Date()) {
  return competitions.map((competition) => ({
    ...competition,
    ...matchScore(competition, profile),
    daysLeft: daysUntil(competition.deadline, now),
  }));
}

export function sortCompetitions(scoredCompetitions) {
  return [...scoredCompetitions].sort((left, right) => {
    const leftExpired = left.daysLeft <= 0 ? 1 : 0;
    const rightExpired = right.daysLeft <= 0 ? 1 : 0;

    if (leftExpired !== rightExpired) return leftExpired - rightExpired;

    return right.score - left.score || left.daysLeft - right.daysLeft;
  });
}

export function getRecommendedCompetitions(
  competitions,
  profile,
  now = new Date(),
) {
  const scoredCompetitions = scoreCompetitions(competitions, profile, now);
  return sortCompetitions(
    scoredCompetitions.filter((competition) => competition.score >= 2),
  );
}
