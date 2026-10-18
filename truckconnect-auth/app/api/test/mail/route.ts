import { NextRequest, NextResponse } from "next/server";

/**
 * Dev-only endpoint — proxies Mailpit API so test scripts can read caught emails.
 * Only available when DEV_SMTP=true.
 *
 * GET  /api/test/mail?to=user@example.com        → latest email sent to that address
 * DELETE /api/test/mail                           → delete all messages in Mailpit
 *
 * Mailpit REST API: http://localhost:8025/api/v1/messages
 */

const MAILPIT = "http://localhost:8025/api/v1";

function guardDev() {
  if (process.env.NODE_ENV === "production" || process.env.DEV_SMTP !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const guard = guardDev();
  if (guard) return guard;

  const to = req.nextUrl.searchParams.get("to");

  try {
    const r = await fetch(`${MAILPIT}/messages`);
    if (!r.ok) {
      return NextResponse.json({ error: "Mailpit not reachable" }, { status: 502 });
    }
    const data = await r.json() as { messages: Array<{ ID: string; To: Array<{ Address: string }>; Subject: string; Snippet: string }> };
    const messages = data.messages ?? [];

    if (to) {
      const match = messages.find((m) =>
        m.To?.some((addr) => addr.Address.toLowerCase() === to.toLowerCase())
      );
      if (!match) {
        return NextResponse.json({ error: `No email found for ${to}` }, { status: 404 });
      }
      // Fetch full message body
      const full = await fetch(`${MAILPIT}/message/${match.ID}`);
      const body = await full.json();
      return NextResponse.json({
        id:      match.ID,
        to:      to,
        subject: match.Subject,
        snippet: match.Snippet,
        html:    body.HTML ?? null,
        text:    body.Text ?? null,
      });
    }

    // No filter — return summary list
    return NextResponse.json({ total: messages.length, messages });
  } catch {
    return NextResponse.json({ error: "Mailpit unavailable" }, { status: 502 });
  }
}

export async function DELETE() {
  const guard = guardDev();
  if (guard) return guard;

  try {
    await fetch(`${MAILPIT}/messages`, { method: "DELETE" });
    return NextResponse.json({ cleared: true });
  } catch {
    return NextResponse.json({ error: "Mailpit unavailable" }, { status: 502 });
  }
}
