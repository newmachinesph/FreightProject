interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9CA3AF", marginBottom: 16 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span style={{ color: "#D1D5DB" }}>/</span>}
          {item.href ? (
            <a href={item.href} style={{ color: "#6B7280", textDecoration: "none" }}>{item.label}</a>
          ) : (
            <span style={{ color: "#111827", fontWeight: 500 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
