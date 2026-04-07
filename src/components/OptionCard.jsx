import React, { useState } from "react";

export default function OptionCard({
  item,
  selected,
  onClick,
  optionStyle,
  optionEmojiStyle,
  optionLabelStyle,
  optionDescStyle,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={optionStyle(selected, hovered)}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={optionEmojiStyle}>{item.emoji}</span>
      <div>
        <div style={optionLabelStyle}>{item.label}</div>
        {item.desc && <div style={optionDescStyle}>{item.desc}</div>}
      </div>
    </div>
  );
}
