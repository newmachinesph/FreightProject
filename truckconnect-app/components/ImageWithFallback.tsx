"use client";
import { useState } from "react";

interface Props {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  fallbackColor?: string;
}

// Generate a consistent color from a string
function stringToColor(str: string): string {
  const colors = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#9333ea", "#c026d3"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Get initials from alt text
function getInitials(text: string): string {
  return text
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

export default function ImageWithFallback({ src, alt, width, height, style, fallbackColor }: Props) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const bgColor = fallbackColor || stringToColor(alt);
    const initials = getInitials(alt) || "?";
    const h = style?.height || height || 200;
    return (
      <div
        style={{
          width: style?.width || width || "100%",
          height: h,
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          ...style,
          objectFit: undefined,
        }}
      >
        <span
          style={{
            fontSize: typeof h === "number" ? Math.max(16, h * 0.2) : 24,
            fontWeight: 700,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 2,
          }}
        >
          {initials}
        </span>
        <span
          style={{
            fontSize: typeof h === "number" ? Math.max(9, h * 0.06) : 10,
            color: "rgba(255,255,255,0.4)",
            maxWidth: "80%",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: "cover", ...style }}
      onError={() => setError(true)}
    />
  );
}
