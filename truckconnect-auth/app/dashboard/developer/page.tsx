import { FileText, Lock } from "lucide-react";

export default function DeveloperPage() {
  const baseUrl = process.env.BETTER_AUTH_URL || "https://auth.truckconnect.ph";

  const sectionHeader: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--text-4)",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid var(--border)",
  };

  const codeBlock: React.CSSProperties = {
    background: "#1E1E2E",
    color: "#CDD6F4",
    borderRadius: 10,
    padding: "16px 20px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    lineHeight: 1.7,
    overflowX: "auto",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  const inlineCode: React.CSSProperties = {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
    color: "var(--blue)",
    background: "rgba(59,130,246,0.06)",
    padding: "3px 8px",
    borderRadius: 4,
  };

  const authMethods = [
    {
      method: "Bearer Token",
      desc: "Pass the session token in the Authorization header",
      example: "Authorization: Bearer <session_token>",
    },
    {
      method: "API Key",
      desc: "Use an organization API key for server-to-server calls",
      example: "X-API-Key: <your_api_key>",
    },
    {
      method: "Session Cookie",
      desc: "Browser-based authentication via HTTP-only cookies",
      example: "Cookie: better-auth.session_token=<token>",
    },
  ];

  // API keys are managed per-organization at /org/[orgId]/keys
  // This page shows documentation and reference info only

  const rateLimits = [
    { endpoint: "POST /api/auth/sign-in", limit: "10 req/min", window: "1 minute", burst: "15" },
    { endpoint: "POST /api/auth/sign-up", limit: "5 req/min", window: "1 minute", burst: "8" },
    { endpoint: "GET /api/auth/session", limit: "60 req/min", window: "1 minute", burst: "100" },
    { endpoint: "POST /api/auth/forgot-password", limit: "3 req/min", window: "1 minute", burst: "5" },
    { endpoint: "GET /api/auth/jwks", limit: "120 req/min", window: "1 minute", burst: "200" },
    { endpoint: "POST /api/org/*", limit: "30 req/min", window: "1 minute", burst: "50" },
    { endpoint: "POST /api/auth/verify-email", limit: "5 req/min", window: "1 minute", burst: "8" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 860 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-1)", marginBottom: 4 }}>
        Developer &amp; API
      </h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32 }}>
        API keys, tokens, JWKS endpoints, and everything you need to integrate with TruckConnect Auth.
      </p>

      {/* API KEYS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>API Keys</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
          API keys are scoped per organization. To create and manage API keys, go to your organization&apos;s settings.
        </p>
        <a
          href="/org"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 18px", borderRadius: 8,
            background: "var(--blue)", color: "#fff",
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}
        >
          Manage Organization Keys
        </a>
        <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>Key Format</div>
          <code style={inlineCode}>tc_live_&#123;8hex&#125;_&#123;24hex&#125;</code>
          <p style={{ fontSize: 12, color: "var(--text-4)", marginTop: 6 }}>
            Keys are shown once on creation. Only the SHA-256 hash is stored — the plaintext cannot be retrieved.
          </p>
        </div>
      </div>

      {/* JWKS ENDPOINT */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>JWKS Endpoint</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 12 }}>
          Use the JSON Web Key Set endpoint to verify JWT signatures issued by TruckConnect Auth.
          External services should fetch keys from this URL and cache them with a TTL.
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "rgba(0,0,0,0.02)",
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>URL:</span>
          <code style={inlineCode}>
            {baseUrl}/api/auth/jwks
          </code>
          <button
            type="button"
            style={{
              marginLeft: "auto",
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "#fff",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-3)",
              cursor: "pointer",
            }}
          >
            Copy
          </button>
        </div>
        <div style={codeBlock}>
          <div style={{ color: "#6C7086", marginBottom: 4 }}>// Fetch public keys</div>
          <div>
            <span style={{ color: "#89B4FA" }}>curl</span>{" "}
            <span style={{ color: "#A6E3A1" }}>http://localhost:3001/api/auth/jwks</span>
          </div>
        </div>
      </div>

      {/* JWT TOKEN INFO */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>JWT Token Structure</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
          JWTs issued by TruckConnect Auth contain the following claims in their payload:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { claim: "sub", type: "string", desc: "User ID (unique identifier for the authenticated user)" },
            { claim: "email", type: "string", desc: "User's verified email address" },
            { claim: "role", type: "string", desc: "Global role (e.g., user, admin, super_admin)" },
            { claim: "aud", type: "string", desc: "Audience - identifies the intended recipient service" },
            { claim: "exp", type: "number", desc: "Expiration time as Unix timestamp (tokens expire after 1 hour)" },
            { claim: "iat", type: "number", desc: "Issued-at time as Unix timestamp" },
            { claim: "iss", type: "string", desc: "Issuer - the auth service URL that minted the token" },
          ].map((c) => (
            <div key={c.claim} style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}>
              <code style={{ ...inlineCode, fontWeight: 700, minWidth: 50 }}>{c.claim}</code>
              <span style={{ fontSize: 11, color: "var(--text-4)", minWidth: 50 }}>{c.type}</span>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WEBHOOKS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>Webhooks</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 12 }}>
          Set up webhooks to receive real-time notifications when auth events occur.
          All webhook payloads are signed with HMAC-SHA256 for verification.
        </p>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
          Example Webhook Payload
        </div>
        <div style={codeBlock}>
          <div>{"{"}</div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#89B4FA" }}>&quot;event&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;user.signed_in&quot;</span>
            <span>,</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#89B4FA" }}>&quot;timestamp&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;2026-03-20T08:30:00Z&quot;</span>
            <span>,</span>
          </div>
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#89B4FA" }}>&quot;data&quot;</span>
            <span>{": {"}</span>
          </div>
          <div style={{ paddingLeft: 40 }}>
            <span style={{ color: "#89B4FA" }}>&quot;userId&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;usr_abc123&quot;</span>
            <span>,</span>
          </div>
          <div style={{ paddingLeft: 40 }}>
            <span style={{ color: "#89B4FA" }}>&quot;email&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;user@example.com&quot;</span>
            <span>,</span>
          </div>
          <div style={{ paddingLeft: 40 }}>
            <span style={{ color: "#89B4FA" }}>&quot;ip&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;203.0.113.42&quot;</span>
            <span>,</span>
          </div>
          <div style={{ paddingLeft: 40 }}>
            <span style={{ color: "#89B4FA" }}>&quot;userAgent&quot;</span>
            <span>{": "}</span>
            <span style={{ color: "#A6E3A1" }}>&quot;Chrome/120 (Windows)&quot;</span>
          </div>
          <div style={{ paddingLeft: 20 }}>{"}"}</div>
          <div>{"}"}</div>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-4)" }}>
          Supported events: <code style={inlineCode}>user.signed_in</code>{" "}
          <code style={inlineCode}>user.signed_up</code>{" "}
          <code style={inlineCode}>user.updated</code>{" "}
          <code style={inlineCode}>user.deleted</code>{" "}
          <code style={inlineCode}>org.created</code>{" "}
          <code style={inlineCode}>org.member_added</code>{" "}
          <code style={inlineCode}>session.revoked</code>
        </div>
      </div>

      {/* CODE EXAMPLES */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>Code Examples</div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            Verify a token with curl
          </div>
          <div style={codeBlock}>
            <div style={{ color: "#6C7086" }}># Verify session token against the auth service</div>
            <div>
              <span style={{ color: "#89B4FA" }}>curl</span>
              <span>{" -s -H "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;Authorization: Bearer $TOKEN&quot;</span>
              <span>{" \\"}</span>
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: "#A6E3A1" }}>{baseUrl}/api/auth/session</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            JavaScript / TypeScript SDK
          </div>
          <div style={codeBlock}>
            <div>
              <span style={{ color: "#CBA6F7" }}>import</span>
              <span>{" { "}</span>
              <span style={{ color: "#F9E2AF" }}>createTruckConnectClient</span>
              <span>{" } "}</span>
              <span style={{ color: "#CBA6F7" }}>from</span>
              <span>{" "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;@truckconnect/sdk&quot;</span>
              <span>;</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: "#CBA6F7" }}>const</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>auth</span>
              <span>{" = "}</span>
              <span style={{ color: "#F9E2AF" }}>createTruckConnectClient</span>
              <span>{"({"}</span>
            </div>
            <div style={{ paddingLeft: 20 }}>
              <span style={{ color: "#89B4FA" }}>baseURL</span>
              <span>{": "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;{baseUrl}&quot;</span>
              <span>,</span>
            </div>
            <div>
              <span>{"});"}</span>
            </div>
            <div style={{ marginTop: 12, color: "#6C7086" }}>// Verify a session token</div>
            <div>
              <span style={{ color: "#CBA6F7" }}>const</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>session</span>
              <span>{" = "}</span>
              <span style={{ color: "#CBA6F7" }}>await</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>auth</span>
              <span>.</span>
              <span style={{ color: "#F9E2AF" }}>verifySession</span>
              <span>{"("}</span>
              <span style={{ color: "#89B4FA" }}>token</span>
              <span>{");"}</span>
            </div>
            <div style={{ marginTop: 8, color: "#6C7086" }}>// Get current user</div>
            <div>
              <span style={{ color: "#CBA6F7" }}>const</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>user</span>
              <span>{" = "}</span>
              <span style={{ color: "#CBA6F7" }}>await</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>auth</span>
              <span>.</span>
              <span style={{ color: "#F9E2AF" }}>getSession</span>
              <span>{"();"}</span>
            </div>
            <div>
              <span style={{ color: "#89B4FA" }}>console</span>
              <span>.</span>
              <span style={{ color: "#F9E2AF" }}>log</span>
              <span>{"("}</span>
              <span style={{ color: "#89B4FA" }}>user</span>
              <span>.</span>
              <span style={{ color: "#89B4FA" }}>email</span>
              <span>{", "}</span>
              <span style={{ color: "#89B4FA" }}>user</span>
              <span>.</span>
              <span style={{ color: "#89B4FA" }}>role</span>
              <span>{");"}</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            Verify JWT with JWKS (Node.js)
          </div>
          <div style={codeBlock}>
            <div>
              <span style={{ color: "#CBA6F7" }}>import</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>jwt</span>
              <span>{" "}</span>
              <span style={{ color: "#CBA6F7" }}>from</span>
              <span>{" "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;jsonwebtoken&quot;</span>
              <span>;</span>
            </div>
            <div>
              <span style={{ color: "#CBA6F7" }}>import</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>jwksClient</span>
              <span>{" "}</span>
              <span style={{ color: "#CBA6F7" }}>from</span>
              <span>{" "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;jwks-rsa&quot;</span>
              <span>;</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: "#CBA6F7" }}>const</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>client</span>
              <span>{" = "}</span>
              <span style={{ color: "#F9E2AF" }}>jwksClient</span>
              <span>{"({ "}</span>
              <span style={{ color: "#89B4FA" }}>jwksUri</span>
              <span>{": "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;http://localhost:3001/api/auth/jwks&quot;</span>
              <span>{" });"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* API REFERENCE */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>API Reference</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <a
            href="/docs.html"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 8,
              background: "var(--blue)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <FileText size={16} />
            Open Swagger UI
          </a>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>Interactive API explorer</span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "rgba(0,0,0,0.02)",
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)" }}>Base URL:</span>
          <code style={inlineCode}>
            {baseUrl}
          </code>
        </div>
      </div>

      {/* AUTHENTICATION METHODS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>Authentication Methods</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {authMethods.map(am => (
            <div key={am.method} style={{
              padding: "14px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Lock size={14} stroke="var(--blue)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{am.method}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 8 }}>{am.desc}</div>
              <code style={{
                fontSize: 12,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                color: "var(--text-3)",
                background: "rgba(0,0,0,0.04)",
                padding: "4px 10px",
                borderRadius: 6,
                display: "inline-block",
                border: "1px solid var(--border)",
              }}>
                {am.example}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* RATE LIMITS */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={sectionHeader}>Rate Limits</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 14 }}>
          Rate limits are enforced per IP address. Exceeding the limit returns <code style={inlineCode}>429 Too Many Requests</code>.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Endpoint</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Limit</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Window</th>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Burst</th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((rl) => (
                <tr key={rl.endpoint} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "10px 12px" }}>
                    <code style={{ ...inlineCode, fontSize: 11 }}>{rl.endpoint}</code>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--text-2)", fontWeight: 600 }}>{rl.limit}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-3)" }}>{rl.window}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-3)" }}>{rl.burst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK START */}
      <div className="card">
        <div style={sectionHeader}>Quick Start</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16 }}>
          Get started with the TruckConnect SDK in your Node.js or TypeScript project.
        </p>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            1. Install the SDK
          </div>
          <div style={codeBlock}>
            <span style={{ color: "#89B4FA" }}>npm</span>{" "}
            <span style={{ color: "#A6E3A1" }}>install</span>{" "}
            <span style={{ color: "#F9E2AF" }}>@truckconnect/sdk</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 8 }}>
            2. Initialize the client
          </div>
          <div style={codeBlock}>
            <div>
              <span style={{ color: "#CBA6F7" }}>import</span>
              <span>{" { "}</span>
              <span style={{ color: "#F9E2AF" }}>createTruckConnectClient</span>
              <span>{" } "}</span>
              <span style={{ color: "#CBA6F7" }}>from</span>
              <span>{" "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;@truckconnect/sdk&quot;</span>
              <span>;</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ color: "#CBA6F7" }}>const</span>
              <span>{" "}</span>
              <span style={{ color: "#89B4FA" }}>auth</span>
              <span>{" = "}</span>
              <span style={{ color: "#F9E2AF" }}>createTruckConnectClient</span>
              <span>{"({"}</span>
            </div>
            <div style={{ paddingLeft: 24 }}>
              <span style={{ color: "#89B4FA" }}>baseURL</span>
              <span>{": "}</span>
              <span style={{ color: "#A6E3A1" }}>&quot;{baseUrl}&quot;</span>
              <span>,</span>
            </div>
            <div>
              <span>{"});"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
