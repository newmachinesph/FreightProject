"use client";
import { useState } from "react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23E5E7EB'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='system-ui' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

interface Props {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  fallback?: string;
}

export default function ImageWithFallback({ src, alt, width, height, style, fallback }: Props) {
  const [error, setError] = useState(false);
  const imgSrc = (!src || error) ? (fallback ?? PLACEHOLDER) : src;

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: "cover", ...style }}
      onError={() => setError(true)}
    />
  );
}
