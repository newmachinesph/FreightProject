"use client";
import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  fallbackIcon?: React.ReactNode;
  fallbackLabel?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  width = 80,
  height = 80,
  style,
  fallbackIcon,
  fallbackLabel,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 8,
          background: "#F3F4F6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#9CA3AF",
          fontSize: 12,
          gap: 4,
          ...style,
        }}
      >
        {fallbackIcon ? (
          fallbackIcon
        ) : (
          <svg
            width={width * 0.4}
            height={height * 0.4}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        {fallbackLabel && (
          <span style={{ fontSize: 10, textAlign: "center", maxWidth: width - 8 }}>
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setHasError(true)}
      style={{ borderRadius: 8, objectFit: "cover", ...style }}
    />
  );
}
