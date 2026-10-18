"use client";
import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  fallbackLabel?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  width = 320,
  height = 180,
  style,
  fallbackLabel,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(!src);

  if (error || !src) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ borderRadius: 10, display: "block", ...style }}
      >
        <rect width={width} height={height} fill="#F3F4F6" rx="10" />
        <rect
          x={width / 2 - 24}
          y={height / 2 - 32}
          width="48"
          height="48"
          rx="8"
          fill="#D1D5DB"
        />
        <path
          d={`M${width / 2 - 10} ${height / 2 - 12} l8 -10 4 5 6 -8 12 13z`}
          fill="#9CA3AF"
        />
        <circle cx={width / 2 - 6} cy={height / 2 - 18} r="4" fill="#9CA3AF" />
        {fallbackLabel && (
          <text
            x={width / 2}
            y={height / 2 + 36}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="12"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            {fallbackLabel}
          </text>
        )}
      </svg>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ borderRadius: 10, objectFit: "cover", display: "block", ...style }}
      onError={() => setError(true)}
    />
  );
}
