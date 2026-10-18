/**
 * POST /api/user/avatar
 *
 * Upload or replace the current user's avatar.
 * Accepts multipart/form-data with a single "avatar" file field.
 *
 * - Max size: 4 MB
 * - Allowed types: image/jpeg, image/png, image/webp, image/gif
 * - Stores to UploadThing
 * - Deletes previous avatar (if it was an UploadThing URL)
 * - Updates user.image in the DB
 *
 * Returns: { url: "https://..." }
 *
 * DELETE /api/user/avatar
 * Removes the current avatar, sets user.image to null.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadFile, deleteFile } from "@/lib/storage/uploadthing";
import { headers } from "next/headers";

const MAX_BYTES   = 4 * 1024 * 1024; // 4 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function validateImageMagicBytes(buf: Buffer, mime: string): boolean {
  if (buf.length < 4) return false;
  switch (mime) {
    case "image/jpeg":
      return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
    case "image/png":
      return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    case "image/gif":
      return buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
    case "image/webp":
      return buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
        && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
    default:
      return false;
  }
}

async function getAuthedUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function POST(req: NextRequest) {
  const sessionUser = await getAuthedUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("avatar") || formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'avatar' file field" }, { status: 400 });
  }

  // Validate type
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Use JPEG, PNG, WebP, or GIF.` },
      { status: 400 }
    );
  }

  // Validate size BEFORE reading into memory
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is 4 MB.` },
      { status: 400 }
    );
  }
  if (file.size < 100) {
    return NextResponse.json({ error: "File too small to be a valid image" }, { status: 400 });
  }

  // Read into buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate magic bytes match declared MIME type
  if (!validateImageMagicBytes(buffer, file.type)) {
    return NextResponse.json(
      { error: "File content does not match declared image type" },
      { status: 400 }
    );
  }

  // Delete old avatar if it was stored in UploadThing
  const [existing] = await db
    .select({ image: userTable.image })
    .from(userTable)
    .where(eq(userTable.id, sessionUser.id))
    .limit(1);

  if (existing?.image && (existing.image.includes("uploadthing") || existing.image.includes("utfs.io") || existing.image.includes("ufs.sh"))) {
    try { await deleteFile(existing.image); } catch (err) { console.warn("[avatar] UploadThing cleanup failed:", err); }
  }

  // Upload new avatar via UploadThing
  const ext = file.type.split("/")[1] ?? "jpg";
  const uploadFile2 = new File([buffer], `avatar_${sessionUser.id}_${Date.now()}.${ext}`, { type: file.type });
  let url: string;
  try {
    url = await uploadFile(uploadFile2);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  // Persist to DB
  await db
    .update(userTable)
    .set({ image: url, updatedAt: new Date() })
    .where(eq(userTable.id, sessionUser.id));

  return NextResponse.json({ url });
}

export async function DELETE() {
  const sessionUser = await getAuthedUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [existing] = await db
    .select({ image: userTable.image })
    .from(userTable)
    .where(eq(userTable.id, sessionUser.id))
    .limit(1);

  if (existing?.image && (existing.image.includes("uploadthing") || existing.image.includes("utfs.io") || existing.image.includes("ufs.sh"))) {
    try { await deleteFile(existing.image); } catch (err) { console.warn("[avatar] UploadThing cleanup failed:", err); }
  }

  await db
    .update(userTable)
    .set({ image: null, updatedAt: new Date() })
    .where(eq(userTable.id, sessionUser.id));

  return NextResponse.json({ cleared: true });
}
