"use client";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          color: "#9CA3AF",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111827",
          margin: "0 0 6px 0",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          margin: "0 0 20px 0",
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            background: "#2563EB",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
