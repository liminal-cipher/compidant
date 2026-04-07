export default function InterestSelector({
  interests,
  options,
  onToggle,
  chipStyle,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {options.map((option) => (
        <div
          key={option.key}
          style={chipStyle(interests.includes(option.key))}
          onClick={() => onToggle(option.key)}
        >
          {option.emoji} {option.label}
        </div>
      ))}
    </div>
  );
}
