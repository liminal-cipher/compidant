import React from "react";

export default function CompetitionCard({
  competition,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  styles,
}) {
  return (
    <div
      style={{
        ...styles.card,
        borderColor: isHovered
          ? "#3b82f6"
          : competition.daysLeft <= 0
            ? "#1a1a1a"
            : "#2a2a3a",
        transform: isHovered ? "translateY(-2px)" : "none",
        boxShadow: isHovered ? "0 8px 24px #3b82f615" : "none",
        opacity: competition.daysLeft <= 0 ? 0.5 : 1,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            {competition.name}
          </div>
          <div style={{ fontSize: 12, color: "#6b6b80", marginTop: 2 }}>
            {competition.host} · {competition.teamDesc}
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: competition.daysLeft <= 0 ? "#4a4a5a" : "#6ee7b7",
            whiteSpace: "nowrap",
            marginLeft: 12,
          }}
        >
          {competition.prize}
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
        {competition.description}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {competition.daysLeft <= 0 ? (
          <span style={styles.tag("#4a4a5a")}>마감됨</span>
        ) : (
          <span
            style={styles.tag(
              competition.daysLeft <= 14 ? "#ef4444" : "#3b82f6",
            )}
          >
            {competition.daysLeft <= 14
              ? `D-${competition.daysLeft} 🔥`
              : `D-${competition.daysLeft}`}
          </span>
        )}

        {competition.total > 0 && (
          <span style={styles.tag("#a78bfa")}>
            관심매칭 {competition.interestMatch}/{competition.total}
          </span>
        )}

        {competition.vibeOk && (
          <span style={styles.tag("#f472b6")}>바이브OK</span>
        )}

        {competition.id >= 200 && (
          <span style={styles.tag("#6ee7b7")}>NEW</span>
        )}
      </div>

      {competition.url && competition.url !== "#" && competition.daysLeft > 0 && (
        <div>
          <a
            href={competition.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.linkBtn}
          >
            공식 사이트 →
          </a>
        </div>
      )}
    </div>
  );
}
