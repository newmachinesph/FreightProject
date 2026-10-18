"use client";

interface VehicleIconProps {
  type: string;
  size?: number;
  color?: string;
}

export default function VehicleIcon({ type, size = 64, color = "#7C3AED" }: VehicleIconProps) {
  const normalized = type.toLowerCase();
  const w = size;
  const h = size * 0.6;
  const viewBox = "0 0 120 72";

  const wheelStyle = { fill: "#374151", stroke: "#1F2937", strokeWidth: 1.5 };
  const bodyFill = color;
  const bodyStroke = darken(color);
  const windowFill = "#BFDBFE";
  const windowStroke = "#93C5FD";
  const accentFill = lighten(color);

  let svgContent: React.ReactNode;

  if (normalized.includes("l300") || normalized.includes("l-300")) {
    svgContent = (
      <>
        <rect x="12" y="20" width="96" height="32" rx="4" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="82" y="22" width="22" height="18" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="62" y="22" width="16" height="18" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <line x1="14" y1="24" x2="14" y2="48" stroke={bodyStroke} strokeWidth="0.8" />
        <line x1="36" y1="24" x2="36" y2="48" stroke={bodyStroke} strokeWidth="0.8" />
        <rect x="104" y="38" width="8" height="10" rx="1" fill={accentFill} stroke={bodyStroke} strokeWidth="1" />
        <rect x="106" y="40" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="30" cy="54" r="7" {...wheelStyle} />
        <circle cx="30" cy="54" r="3" fill="#6B7280" />
        <circle cx="90" cy="54" r="7" {...wheelStyle} />
        <circle cx="90" cy="54" r="3" fill="#6B7280" />
        <line x1="8" y1="61" x2="112" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("closed van") && !normalized.includes("reefer") && !normalized.includes("refriger")) {
    svgContent = (
      <>
        <rect x="6" y="14" width="68" height="38" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <line x1="28" y1="16" x2="28" y2="50" stroke={bodyStroke} strokeWidth="0.6" opacity="0.5" />
        <line x1="50" y1="16" x2="50" y2="50" stroke={bodyStroke} strokeWidth="0.6" opacity="0.5" />
        <rect x="74" y="24" width="32" height="28" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="27" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="40" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="24" cy="54" r="7" {...wheelStyle} />
        <circle cx="24" cy="54" r="3" fill="#6B7280" />
        <circle cx="90" cy="54" r="7" {...wheelStyle} />
        <circle cx="90" cy="54" r="3" fill="#6B7280" />
        <line x1="4" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("elf")) {
    svgContent = (
      <>
        <rect x="6" y="16" width="62" height="36" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M68 26 L68 52 L106 52 L106 32 Q106 26 100 26 Z" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M80 28 L98 28 Q102 28 102 32 L102 40 L80 40 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="14" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="40" width="4" height="4" rx="1" fill="#FDE68A" />
        <circle cx="24" cy="54" r="7" {...wheelStyle} />
        <circle cx="24" cy="54" r="3" fill="#6B7280" />
        <circle cx="88" cy="54" r="7" {...wheelStyle} />
        <circle cx="88" cy="54" r="3" fill="#6B7280" />
        <line x1="4" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("wing")) {
    svgContent = (
      <>
        <rect x="4" y="10" width="72" height="42" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M4 10 L40 4 L76 10" fill="none" stroke={bodyStroke} strokeWidth="1" strokeDasharray="3 2" />
        <line x1="40" y1="12" x2="40" y2="50" stroke={bodyStroke} strokeWidth="0.8" />
        <rect x="76" y="22" width="30" height="30" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="25" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="40" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="18" cy="54" r="7" {...wheelStyle} />
        <circle cx="18" cy="54" r="3" fill="#6B7280" />
        <circle cx="36" cy="54" r="7" {...wheelStyle} />
        <circle cx="36" cy="54" r="3" fill="#6B7280" />
        <circle cx="92" cy="54" r="7" {...wheelStyle} />
        <circle cx="92" cy="54" r="3" fill="#6B7280" />
        <line x1="2" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("10-wheel") || normalized.includes("10 wheel") || normalized.includes("wheeler")) {
    svgContent = (
      <>
        <rect x="2" y="8" width="76" height="44" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <line x1="26" y1="10" x2="26" y2="50" stroke={bodyStroke} strokeWidth="0.5" opacity="0.4" />
        <line x1="52" y1="10" x2="52" y2="50" stroke={bodyStroke} strokeWidth="0.5" opacity="0.4" />
        <rect x="78" y="20" width="30" height="32" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="88" y="23" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="108" y="36" width="8" height="14" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="110" y="38" width="4" height="4" rx="1" fill="#FDE68A" />
        <circle cx="12" cy="54" r="6" {...wheelStyle} />
        <circle cx="12" cy="54" r="2.5" fill="#6B7280" />
        <circle cx="28" cy="54" r="6" {...wheelStyle} />
        <circle cx="28" cy="54" r="2.5" fill="#6B7280" />
        <circle cx="44" cy="54" r="6" {...wheelStyle} />
        <circle cx="44" cy="54" r="2.5" fill="#6B7280" />
        <circle cx="92" cy="54" r="7" {...wheelStyle} />
        <circle cx="92" cy="54" r="3" fill="#6B7280" />
        <line x1="0" y1="61" x2="118" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("reefer") || normalized.includes("refriger")) {
    svgContent = (
      <>
        <rect x="6" y="14" width="68" height="38" rx="2" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
        <rect x="8" y="6" width="20" height="10" rx="2" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1.5" />
        <circle cx="18" cy="11" r="3" fill="none" stroke="#BAE6FD" strokeWidth="1" />
        <line x1="18" y1="8" x2="18" y2="14" stroke="#BAE6FD" strokeWidth="0.5" />
        <line x1="15" y1="11" x2="21" y2="11" stroke="#BAE6FD" strokeWidth="0.5" />
        <text x="50" y="36" fontSize="12" fill="#0284C7" textAnchor="middle">*</text>
        <rect x="74" y="24" width="32" height="28" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="27" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="40" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="24" cy="54" r="7" {...wheelStyle} />
        <circle cx="24" cy="54" r="3" fill="#6B7280" />
        <circle cx="90" cy="54" r="7" {...wheelStyle} />
        <circle cx="90" cy="54" r="3" fill="#6B7280" />
        <line x1="4" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("flatbed")) {
    svgContent = (
      <>
        <rect x="4" y="38" width="72" height="6" rx="1" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="8" y="28" width="3" height="12" rx="1" fill={bodyStroke} />
        <rect x="24" y="28" width="3" height="12" rx="1" fill={bodyStroke} />
        <rect x="40" y="28" width="3" height="12" rx="1" fill={bodyStroke} />
        <rect x="56" y="28" width="3" height="12" rx="1" fill={bodyStroke} />
        <rect x="70" y="28" width="3" height="12" rx="1" fill={bodyStroke} />
        <rect x="76" y="22" width="30" height="24" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="25" width="16" height="12" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="34" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="36" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="20" cy="50" r="7" {...wheelStyle} />
        <circle cx="20" cy="50" r="3" fill="#6B7280" />
        <circle cx="50" cy="50" r="7" {...wheelStyle} />
        <circle cx="50" cy="50" r="3" fill="#6B7280" />
        <circle cx="92" cy="50" r="7" {...wheelStyle} />
        <circle cx="92" cy="50" r="3" fill="#6B7280" />
        <line x1="2" y1="57" x2="116" y2="57" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("tanker")) {
    svgContent = (
      <>
        <ellipse cx="40" cy="32" rx="36" ry="18" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <ellipse cx="20" cy="32" rx="2" ry="16" fill="none" stroke={bodyStroke} strokeWidth="1" />
        <ellipse cx="40" cy="32" rx="2" ry="16" fill="none" stroke={bodyStroke} strokeWidth="1" />
        <ellipse cx="60" cy="32" rx="2" ry="16" fill="none" stroke={bodyStroke} strokeWidth="1" />
        <rect x="36" y="12" width="8" height="5" rx="2" fill={accentFill} stroke={bodyStroke} strokeWidth="1" />
        <rect x="76" y="22" width="30" height="30" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="25" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="40" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="18" cy="54" r="7" {...wheelStyle} />
        <circle cx="18" cy="54" r="3" fill="#6B7280" />
        <circle cx="42" cy="54" r="7" {...wheelStyle} />
        <circle cx="42" cy="54" r="3" fill="#6B7280" />
        <circle cx="92" cy="54" r="7" {...wheelStyle} />
        <circle cx="92" cy="54" r="3" fill="#6B7280" />
        <line x1="2" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("trailer")) {
    svgContent = (
      <>
        <rect x="2" y="12" width="70" height="38" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <line x1="24" y1="14" x2="24" y2="48" stroke={bodyStroke} strokeWidth="0.5" opacity="0.4" />
        <line x1="48" y1="14" x2="48" y2="48" stroke={bodyStroke} strokeWidth="0.5" opacity="0.4" />
        <rect x="66" y="44" width="3" height="12" rx="0.5" fill="#6B7280" />
        <line x1="72" y1="36" x2="80" y2="36" stroke={bodyStroke} strokeWidth="2" />
        <rect x="80" y="22" width="28" height="30" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="90" y="25" width="14" height="12" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="82" y="14" width="3" height="10" rx="1" fill="#6B7280" />
        <rect x="108" y="36" width="8" height="14" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="110" y="38" width="4" height="4" rx="1" fill="#FDE68A" />
        <circle cx="12" cy="54" r="6" {...wheelStyle} />
        <circle cx="12" cy="54" r="2.5" fill="#6B7280" />
        <circle cx="28" cy="54" r="6" {...wheelStyle} />
        <circle cx="28" cy="54" r="2.5" fill="#6B7280" />
        <circle cx="92" cy="54" r="7" {...wheelStyle} />
        <circle cx="92" cy="54" r="3" fill="#6B7280" />
        <line x1="0" y1="61" x2="118" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("dropside")) {
    svgContent = (
      <>
        <rect x="4" y="38" width="72" height="6" rx="1" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="4" y="22" width="72" height="16" rx="1" fill="none" stroke={bodyStroke} strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx="10" cy="38" r="2" fill={bodyStroke} />
        <circle cx="40" cy="38" r="2" fill={bodyStroke} />
        <circle cx="70" cy="38" r="2" fill={bodyStroke} />
        <rect x="2" y="22" width="3" height="22" rx="1" fill={bodyFill} stroke={bodyStroke} strokeWidth="1" />
        <rect x="76" y="22" width="30" height="24" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="25" width="16" height="12" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="34" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <rect x="108" y="36" width="4" height="3" rx="1" fill="#FDE68A" />
        <circle cx="22" cy="50" r="7" {...wheelStyle} />
        <circle cx="22" cy="50" r="3" fill="#6B7280" />
        <circle cx="54" cy="50" r="7" {...wheelStyle} />
        <circle cx="54" cy="50" r="3" fill="#6B7280" />
        <circle cx="92" cy="50" r="7" {...wheelStyle} />
        <circle cx="92" cy="50" r="3" fill="#6B7280" />
        <line x1="2" y1="57" x2="116" y2="57" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("sedan")) {
    svgContent = (
      <>
        <rect x="10" y="34" width="100" height="16" rx="4" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M30 34 L40 18 L80 18 L95 34" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M42 20 L34 32 L58 32 L58 20 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <path d="M62 20 L62 32 L90 32 L82 20 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="104" y="38" width="5" height="4" rx="1" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.5" />
        <rect x="10" y="38" width="4" height="4" rx="1" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
        <circle cx="32" cy="52" r="7" {...wheelStyle} />
        <circle cx="32" cy="52" r="3" fill="#6B7280" />
        <circle cx="88" cy="52" r="7" {...wheelStyle} />
        <circle cx="88" cy="52" r="3" fill="#6B7280" />
        <line x1="6" y1="59" x2="114" y2="59" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else if (normalized.includes("mpv") || normalized.includes("suv")) {
    svgContent = (
      <>
        <rect x="8" y="32" width="104" height="18" rx="4" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <path d="M22 32 L30 14 L88 14 L96 32" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <line x1="32" y1="14" x2="86" y2="14" stroke={bodyStroke} strokeWidth="2" />
        <path d="M33 16 L27 30 L48 30 L48 16 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <path d="M52 16 L52 30 L70 30 L70 16 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <path d="M74 16 L74 30 L92 30 L86 16 Z" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="36" width="5" height="5" rx="1" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.5" />
        <rect x="8" y="36" width="4" height="5" rx="1" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
        <circle cx="32" cy="52" r="8" {...wheelStyle} />
        <circle cx="32" cy="52" r="3.5" fill="#6B7280" />
        <circle cx="88" cy="52" r="8" {...wheelStyle} />
        <circle cx="88" cy="52" r="3.5" fill="#6B7280" />
        <line x1="4" y1="60" x2="116" y2="60" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  } else {
    // Default: generic truck
    svgContent = (
      <>
        <rect x="6" y="18" width="68" height="34" rx="2" fill={bodyFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="74" y="24" width="32" height="28" rx="3" fill={accentFill} stroke={bodyStroke} strokeWidth="1.5" />
        <rect x="86" y="27" width="16" height="14" rx="2" fill={windowFill} stroke={windowStroke} strokeWidth="1" />
        <rect x="106" y="38" width="8" height="12" rx="1" fill="#9CA3AF" stroke={bodyStroke} strokeWidth="1" />
        <circle cx="24" cy="54" r="7" {...wheelStyle} />
        <circle cx="24" cy="54" r="3" fill="#6B7280" />
        <circle cx="90" cy="54" r="7" {...wheelStyle} />
        <circle cx="90" cy="54" r="3" fill="#6B7280" />
        <line x1="4" y1="61" x2="116" y2="61" stroke="#D1D5DB" strokeWidth="0.5" />
      </>
    );
  }

  return (
    <svg width={w} height={h} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {svgContent}
    </svg>
  );
}

function darken(hex: string): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function lighten(hex: string): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 30);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 30);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 30);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
