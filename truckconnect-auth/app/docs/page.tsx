"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact?: { name?: string; email?: string; url?: string };
    license?: { name?: string; url?: string };
  };
  servers?: { url: string; description: string }[];
  tags?: { name: string; description: string }[];
  components?: {
    securitySchemes?: Record<string, any>;
    schemas?: Record<string, any>;
    headers?: Record<string, any>;
  };
  security?: Record<string, string[]>[];
  paths: Record<string, Record<string, EndpointSpec>>;
}

interface EndpointSpec {
  tags?: string[];
  operationId?: string;
  summary?: string;
  description?: string;
  security?: Record<string, string[]>[];
  "x-rateLimit"?: { limit: number; window: string; scope: string };
  parameters?: any[];
  requestBody?: any;
  responses?: Record<string, any>;
}

interface Endpoint {
  method: string;
  path: string;
  spec: EndpointSpec;
  tag: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const METHOD_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  get: { bg: "#064e3b", text: "#34d399", border: "#065f46" },
  post: { bg: "#1e3a5f", text: "#60a5fa", border: "#1e40af" },
  put: { bg: "#713f12", text: "#facc15", border: "#854d0e" },
  patch: { bg: "#713f12", text: "#fbbf24", border: "#854d0e" },
  delete: { bg: "#7f1d1d", text: "#f87171", border: "#991b1b" },
};

const STATUS_COLORS: Record<string, string> = {
  "2": "#34d399",
  "3": "#60a5fa",
  "4": "#fbbf24",
  "5": "#f87171",
};

const CODE_LANGS = ["curl", "javascript", "python"] as const;
type CodeLang = (typeof CODE_LANGS)[number];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function methodColor(m: string) {
  return METHOD_COLORS[m.toLowerCase()] ?? METHOD_COLORS.get;
}

function statusColor(code: string) {
  return STATUS_COLORS[code[0]] ?? "#9ca3af";
}

function resolveRef(ref: string, spec: OpenAPISpec): any {
  const parts = ref.replace("#/", "").split("/");
  let obj: any = spec;
  for (const p of parts) obj = obj?.[p];
  return obj;
}

function resolveSchema(schema: any, spec: OpenAPISpec, depth = 0): any {
  if (!schema || depth > 8) return schema;
  if (schema.$ref) return resolveSchema(resolveRef(schema.$ref, spec), spec, depth + 1);
  if (schema.properties) {
    const resolved: any = { ...schema, properties: {} };
    for (const [k, v] of Object.entries(schema.properties)) {
      resolved.properties[k] = resolveSchema(v as any, spec, depth + 1);
    }
    return resolved;
  }
  if (schema.items) {
    return { ...schema, items: resolveSchema(schema.items, spec, depth + 1) };
  }
  return schema;
}

function schemaToExample(schema: any): any {
  if (!schema) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.type === "object" && schema.properties) {
    const obj: any = {};
    for (const [k, v] of Object.entries<any>(schema.properties)) {
      obj[k] = schemaToExample(v);
    }
    return obj;
  }
  if (schema.type === "array" && schema.items) {
    return [schemaToExample(schema.items)];
  }
  const defaults: Record<string, any> = {
    string: "string",
    integer: 0,
    number: 0,
    boolean: false,
  };
  return defaults[schema.type] ?? null;
}

function generateCurl(method: string, path: string, spec: EndpointSpec, baseUrl: string): string {
  let cmd = `curl -X ${method.toUpperCase()} "${baseUrl}${path}"`;
  const noAuth = spec.security && spec.security.length === 0;
  if (!noAuth) cmd += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`;
  const body = spec.requestBody?.content?.["application/json"]?.schema;
  if (body) {
    const ex = schemaToExample(body);
    cmd += ` \\\n  -H "Content-Type: application/json"`;
    cmd += ` \\\n  -d '${JSON.stringify(ex, null, 2)}'`;
  }
  return cmd;
}

function generateJS(method: string, path: string, spec: EndpointSpec, baseUrl: string): string {
  const noAuth = spec.security && spec.security.length === 0;
  const body = spec.requestBody?.content?.["application/json"]?.schema;
  const ex = body ? schemaToExample(body) : null;
  const headers: Record<string, string> = {};
  if (!noAuth) headers["Authorization"] = "Bearer YOUR_TOKEN";
  if (ex) headers["Content-Type"] = "application/json";

  let code = `const response = await fetch("${baseUrl}${path}", {\n  method: "${method.toUpperCase()}",\n`;
  if (Object.keys(headers).length) {
    code += `  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, "\n  ")},\n`;
  }
  if (ex) code += `  body: JSON.stringify(${JSON.stringify(ex, null, 4).replace(/\n/g, "\n  ")}),\n`;
  code += `});\n\nconst data = await response.json();\nconsole.log(data);`;
  return code;
}

function generatePython(method: string, path: string, spec: EndpointSpec, baseUrl: string): string {
  const noAuth = spec.security && spec.security.length === 0;
  const body = spec.requestBody?.content?.["application/json"]?.schema;
  const ex = body ? schemaToExample(body) : null;

  let code = "import requests\n\n";
  const headers: Record<string, string> = {};
  if (!noAuth) headers["Authorization"] = "Bearer YOUR_TOKEN";

  if (Object.keys(headers).length) {
    code += `headers = ${JSON.stringify(headers).replace(/"/g, '"')}\n\n`;
  }
  if (ex) {
    code += `payload = ${JSON.stringify(ex, null, 4)}\n\n`;
  }
  code += `response = requests.${method.toLowerCase()}(\n    "${baseUrl}${path}",\n`;
  if (Object.keys(headers).length) code += `    headers=headers,\n`;
  if (ex) code += `    json=payload,\n`;
  code += `)\n\nprint(response.json())`;
  return code;
}

function renderSchemaProps(schema: any, depth = 0): JSX.Element | null {
  if (!schema?.properties) return null;
  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      {Object.entries<any>(schema.properties).map(([key, prop]) => (
        <div
          key={key}
          style={{
            padding: "6px 0",
            borderBottom: "1px solid #1e293b",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#e2e8f0", fontFamily: "monospace", fontWeight: 600 }}>{key}</span>
          {schema.required?.includes(key) && (
            <span style={{ color: "#f87171", fontSize: 11, marginLeft: 6 }}>required</span>
          )}
          <span style={{ color: "#64748b", marginLeft: 8, fontSize: 12 }}>
            {prop.type}
            {prop.format ? ` <${prop.format}>` : ""}
            {prop.nullable ? " | null" : ""}
            {prop.enum ? ` (${prop.enum.join(" | ")})` : ""}
          </span>
          {prop.description && (
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{prop.description}</div>
          )}
          {prop.example !== undefined && (
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 1 }}>
              Example: <code style={{ color: "#a5b4fc" }}>{JSON.stringify(prop.example)}</code>
            </div>
          )}
          {prop.type === "object" && prop.properties && renderSchemaProps(prop, depth + 1)}
          {prop.type === "array" && prop.items?.properties && (
            <div style={{ marginLeft: 16, borderLeft: "2px solid #1e3a5f", paddingLeft: 8, marginTop: 4 }}>
              <span style={{ color: "#64748b", fontSize: 11 }}>array items:</span>
              {renderSchemaProps(prop.items, depth + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<CodeLang>("curl");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const endpointRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* fetch spec */
  useEffect(() => {
    fetch("/api/docs")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load spec: ${r.status}`);
        return r.json();
      })
      .then((data: OpenAPISpec) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  /* build endpoints list */
  const endpoints: Endpoint[] = useMemo(() => {
    if (!spec) return [];
    const list: Endpoint[] = [];
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, s] of Object.entries(methods)) {
        if (["get", "post", "put", "patch", "delete"].includes(method)) {
          list.push({ method, path, spec: s, tag: s.tags?.[0] ?? "Other" });
        }
      }
    }
    return list;
  }, [spec]);

  /* group by tag */
  const grouped = useMemo(() => {
    const tagOrder = spec?.tags?.map((t) => t.name) ?? [];
    const groups: Record<string, Endpoint[]> = {};
    for (const ep of endpoints) {
      if (!groups[ep.tag]) groups[ep.tag] = [];
      groups[ep.tag].push(ep);
    }
    const sorted: [string, Endpoint[]][] = [];
    for (const tag of tagOrder) {
      if (groups[tag]) sorted.push([tag, groups[tag]]);
    }
    for (const [tag, eps] of Object.entries(groups)) {
      if (!tagOrder.includes(tag)) sorted.push([tag, eps]);
    }
    return sorted;
  }, [endpoints, spec]);

  /* search filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    return grouped
      .map(([tag, eps]) => [tag, eps.filter((e) => e.path.toLowerCase().includes(q) || e.spec.summary?.toLowerCase().includes(q) || e.spec.description?.toLowerCase().includes(q) || e.method.toLowerCase().includes(q))] as [string, Endpoint[]])
      .filter(([, eps]) => eps.length > 0);
  }, [grouped, search]);

  /* scroll to endpoint */
  const scrollTo = useCallback((id: string) => {
    setExpandedId(id);
    setSidebarOpen(false);
    setTimeout(() => {
      endpointRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  /* loading / error states */
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #1e3a5f", borderTopColor: "#60a5fa", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p>Loading API documentation...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  if (error || !spec)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f172a", color: "#f87171", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Failed to load API docs</h2>
          <p style={{ color: "#94a3b8" }}>{error}</p>
        </div>
      </div>
    );

  const baseUrl = spec.servers?.[0]?.url ?? "";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ position: "fixed", top: 12, left: 12, zIndex: 1000, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "8px 12px", cursor: "pointer", display: "none", fontSize: 14 }}
        className="mobile-toggle"
      >
        {sidebarOpen ? "Close" : "Menu"}
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-toggle { display: block !important; }
          .sidebar { transform: translateX(${sidebarOpen ? "0" : "-100%"}); position: fixed !important; z-index: 999; }
          .main-content { margin-left: 0 !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        pre { white-space: pre-wrap; word-break: break-all; }
      `}</style>

      {/* ---- SIDEBAR ---- */}
      <aside
        className="sidebar"
        style={{
          width: 290,
          minWidth: 290,
          background: "#0b1120",
          borderRight: "1px solid #1e293b",
          height: "100vh",
          position: "sticky",
          top: 0,
          overflowY: "auto",
          transition: "transform 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 12px" }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#f8fafc", margin: 0, letterSpacing: -0.3 }}>
            {spec.info.title}
          </h1>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>v{spec.info.version}</div>
        </div>

        {/* Search */}
        <div style={{ padding: "0 16px 12px" }}>
          <input
            type="text"
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 6,
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>

        {/* Nav groups */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "0 8px 20px" }}>
          {filtered.map(([tag, eps]) => (
            <div key={tag} style={{ marginBottom: 8 }}>
              <button
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  cursor: "pointer",
                  borderRadius: 4,
                }}
              >
                <span>{tag}</span>
                <span style={{ fontSize: 10, color: "#475569", transform: activeTag === tag ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>&#9660;</span>
              </button>
              {(activeTag === null || activeTag === tag) &&
                eps.map((ep) => {
                  const id = `${ep.method}-${ep.path}`;
                  const mc = methodColor(ep.method);
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                        padding: "6px 12px 6px 20px",
                        background: expandedId === id ? "#1e293b" : "transparent",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        color: "#cbd5e1",
                        fontSize: 12,
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          fontFamily: "monospace",
                          color: mc.text,
                          background: mc.bg,
                          border: `1px solid ${mc.border}`,
                          padding: "1px 5px",
                          borderRadius: 3,
                          minWidth: 38,
                          textAlign: "center",
                          textTransform: "uppercase",
                        }}
                      >
                        {ep.method}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ep.spec.summary || ep.path}
                      </span>
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ---- MAIN CONTENT ---- */}
      <main className="main-content" style={{ flex: 1, minWidth: 0, padding: "32px 40px 80px", maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f8fafc", margin: "0 0 8px", letterSpacing: -0.5 }}>
            {spec.info.title}
          </h1>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6, maxWidth: 680, margin: "0 0 24px" }}>
            Authentication, authorization, and organization management API for the TruckConnect Philippine freight platform.
          </p>

          {/* Servers */}
          {spec.servers && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              {spec.servers.map((s) => (
                <div
                  key={s.url}
                  style={{
                    padding: "8px 14px",
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#64748b" }}>{s.description}: </span>
                  <code style={{ color: "#60a5fa" }}>{s.url}</code>
                </div>
              ))}
            </div>
          )}

          {/* Auth section */}
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", margin: "0 0 16px" }}>
              Authentication
            </h2>
            <div style={{ display: "grid", gap: 16 }}>
              {spec.components?.securitySchemes &&
                Object.entries(spec.components.securitySchemes).map(([name, scheme]: [string, any]) => (
                  <div key={name} style={{ padding: 16, background: "#0f172a", borderRadius: 8, border: "1px solid #1e3a5f" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span
                        style={{
                          background: name === "bearerAuth" ? "#1e3a5f" : "#064e3b",
                          color: name === "bearerAuth" ? "#60a5fa" : "#34d399",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: "monospace",
                        }}
                      >
                        {name === "bearerAuth" ? "Bearer Token" : "Session Cookie"}
                      </span>
                      <span style={{ color: "#64748b", fontSize: 12 }}>
                        {scheme.type === "http" ? `${scheme.scheme} (${scheme.bearerFormat})` : `${scheme.in}: ${scheme.name}`}
                      </span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                      {scheme.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Rate limit info */}
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: 24,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", margin: "0 0 12px" }}>
              Rate Limiting
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>
              All endpoints enforce rate limits. When exceeded, the API returns <code style={{ color: "#fbbf24", background: "#1a1a2e", padding: "1px 6px", borderRadius: 3 }}>429 Too Many Requests</code> with the following headers:
            </p>
            <div style={{ display: "grid", gap: 6 }}>
              {[
                ["X-RateLimit-Limit", "Maximum requests allowed in the current window"],
                ["X-RateLimit-Remaining", "Requests remaining in the current window"],
                ["X-RateLimit-Reset", "Unix timestamp when the window resets"],
              ].map(([header, desc]) => (
                <div key={header} style={{ display: "flex", gap: 12, alignItems: "baseline", fontSize: 13 }}>
                  <code style={{ color: "#a5b4fc", fontFamily: "monospace", minWidth: 180 }}>{header}</code>
                  <span style={{ color: "#64748b" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Endpoints */}
        {filtered.map(([tag, eps]) => {
          const tagInfo = spec.tags?.find((t) => t.name === tag);
          return (
            <section key={tag} style={{ marginBottom: 48 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", margin: "0 0 4px" }}>{tag}</h2>
                {tagInfo?.description && (
                  <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{tagInfo.description}</p>
                )}
              </div>

              {eps.map((ep) => {
                const id = `${ep.method}-${ep.path}`;
                const expanded = expandedId === id;
                const mc = methodColor(ep.method);
                const rateLimit = ep.spec["x-rateLimit"];
                const resolvedReqBody = ep.spec.requestBody?.content?.["application/json"]?.schema
                  ? resolveSchema(ep.spec.requestBody.content["application/json"].schema, spec)
                  : null;

                return (
                  <div
                    key={id}
                    ref={(el) => { endpointRefs.current[id] = el; }}
                    style={{
                      marginBottom: 12,
                      border: `1px solid ${expanded ? mc.border : "#1e293b"}`,
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "#0b1120",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    {/* Endpoint header */}
                    <button
                      onClick={() => setExpandedId(expanded ? null : id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        width: "100%",
                        padding: "14px 20px",
                        background: expanded ? "#111827" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#e2e8f0",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          fontFamily: "monospace",
                          color: mc.text,
                          background: mc.bg,
                          border: `1px solid ${mc.border}`,
                          padding: "3px 8px",
                          borderRadius: 4,
                          minWidth: 52,
                          textAlign: "center",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {ep.method}
                      </span>
                      <code style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{ep.path}</code>
                      <span style={{ flex: 1, fontSize: 13, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ep.spec.summary}
                      </span>
                      {rateLimit && (
                        <span style={{ fontSize: 10, color: "#fbbf24", background: "#713f1233", padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap" }}>
                          {rateLimit.limit}/{rateLimit.window}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: "#475569", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>&#9660;</span>
                    </button>

                    {/* Expanded content */}
                    {expanded && (
                      <div style={{ padding: "0 20px 20px" }}>
                        {/* Description */}
                        {ep.spec.description && (
                          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.65, margin: "0 0 20px", whiteSpace: "pre-line" }}>
                            {ep.spec.description}
                          </p>
                        )}

                        {/* Auth info */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                          {ep.spec.security && ep.spec.security.length === 0 ? (
                            <span style={{ fontSize: 11, color: "#34d399", background: "#064e3b33", padding: "3px 8px", borderRadius: 4 }}>
                              No authentication required
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: "#60a5fa", background: "#1e3a5f33", padding: "3px 8px", borderRadius: 4 }}>
                              Requires authentication
                            </span>
                          )}
                          {rateLimit && (
                            <span style={{ fontSize: 11, color: "#fbbf24", background: "#713f1233", padding: "3px 8px", borderRadius: 4 }}>
                              Rate limit: {rateLimit.limit} per {rateLimit.window} per {rateLimit.scope}
                            </span>
                          )}
                        </div>

                        {/* Parameters */}
                        {ep.spec.parameters && ep.spec.parameters.length > 0 && (
                          <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              Parameters
                            </h4>
                            <div style={{ background: "#111827", borderRadius: 8, padding: 12, border: "1px solid #1e293b" }}>
                              {ep.spec.parameters.map((param: any, i: number) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "6px 0",
                                    borderBottom: i < ep.spec.parameters!.length - 1 ? "1px solid #1e293b" : "none",
                                    fontSize: 13,
                                  }}
                                >
                                  <code style={{ color: "#e2e8f0", fontWeight: 600 }}>{param.name}</code>
                                  {param.required && <span style={{ color: "#f87171", fontSize: 11, marginLeft: 6 }}>required</span>}
                                  <span style={{ color: "#64748b", marginLeft: 8, fontSize: 12 }}>
                                    in {param.in} &middot; {param.schema?.type}
                                  </span>
                                  {param.description && (
                                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{param.description}</div>
                                  )}
                                  {param.example && (
                                    <div style={{ color: "#64748b", fontSize: 11 }}>
                                      Example: <code style={{ color: "#a5b4fc" }}>{param.example}</code>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request body */}
                        {resolvedReqBody && (
                          <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              Request Body
                            </h4>
                            <div style={{ background: "#111827", borderRadius: 8, padding: 12, border: "1px solid #1e293b" }}>
                              {renderSchemaProps(resolvedReqBody)}
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        {ep.spec.responses && (
                          <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              Responses
                            </h4>
                            <div style={{ display: "grid", gap: 8 }}>
                              {Object.entries(ep.spec.responses).map(([code, resp]: [string, any]) => {
                                const respSchema = resp.content?.["application/json"]?.schema
                                  ? resolveSchema(resp.content["application/json"].schema, spec)
                                  : null;
                                const exampleData = resp.content?.["application/json"]?.example ?? (respSchema ? schemaToExample(respSchema) : null);

                                return (
                                  <div
                                    key={code}
                                    style={{
                                      background: "#111827",
                                      borderRadius: 8,
                                      padding: 12,
                                      border: "1px solid #1e293b",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: respSchema ? 8 : 0 }}>
                                      <span
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 700,
                                          fontFamily: "monospace",
                                          color: statusColor(code),
                                        }}
                                      >
                                        {code}
                                      </span>
                                      <span style={{ color: "#94a3b8", fontSize: 12 }}>{resp.description}</span>
                                    </div>
                                    {respSchema && respSchema.properties && (
                                      <div style={{ marginTop: 4, borderTop: "1px solid #1e293b", paddingTop: 8 }}>
                                        {renderSchemaProps(respSchema)}
                                      </div>
                                    )}
                                    {exampleData && (
                                      <details style={{ marginTop: 8 }}>
                                        <summary style={{ color: "#64748b", fontSize: 11, cursor: "pointer", userSelect: "none" }}>
                                          Example response
                                        </summary>
                                        <pre
                                          style={{
                                            background: "#0b1120",
                                            borderRadius: 6,
                                            padding: 12,
                                            marginTop: 6,
                                            fontSize: 11,
                                            color: "#a5b4fc",
                                            overflow: "auto",
                                            border: "1px solid #1e293b",
                                          }}
                                        >
                                          {JSON.stringify(exampleData, null, 2)}
                                        </pre>
                                      </details>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Code examples */}
                        <div>
                          <h4 style={{ fontSize: 11, fontWeight: 700, color: "#f8fafc", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            Code Examples
                          </h4>
                          <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                            {CODE_LANGS.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                style={{
                                  padding: "6px 16px",
                                  fontSize: 12,
                                  fontWeight: activeLang === lang ? 600 : 400,
                                  color: activeLang === lang ? "#e2e8f0" : "#64748b",
                                  background: activeLang === lang ? "#1e293b" : "transparent",
                                  border: "1px solid #1e293b",
                                  borderBottom: activeLang === lang ? "1px solid #1e293b" : "1px solid #1e293b",
                                  borderRadius: "6px 6px 0 0",
                                  cursor: "pointer",
                                  textTransform: "capitalize",
                                }}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                          <pre
                            style={{
                              background: "#111827",
                              border: "1px solid #1e293b",
                              borderTop: "none",
                              borderRadius: "0 6px 6px 6px",
                              padding: 16,
                              fontSize: 12,
                              lineHeight: 1.5,
                              color: "#e2e8f0",
                              overflow: "auto",
                              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                            }}
                          >
                            {activeLang === "curl" && generateCurl(ep.method, ep.path, ep.spec, baseUrl)}
                            {activeLang === "javascript" && generateJS(ep.method, ep.path, ep.spec, baseUrl)}
                            {activeLang === "python" && generatePython(ep.method, ep.path, ep.spec, baseUrl)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #1e293b", paddingTop: 24, marginTop: 32, color: "#475569", fontSize: 12 }}>
          <p>
            {spec.info.title} v{spec.info.version}
            {spec.info.contact?.email && <span> &middot; {spec.info.contact.email}</span>}
            {spec.info.license?.name && <span> &middot; {spec.info.license.name}</span>}
          </p>
        </footer>
      </main>
    </div>
  );
}
