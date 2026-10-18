/**
 * UploadThing storage — avatars and document uploads.
 *
 * Uses the server-side UTApi for upload/delete operations.
 * Env var: UPLOADTHING_TOKEN (set in .env.local)
 */

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

/**
 * Upload a File to UploadThing and return the public URL.
 */
export async function uploadFile(file: File): Promise<string> {
  const response = await utapi.uploadFiles(file);
  if (response.error) {
    throw new Error(response.error.message ?? "Upload failed");
  }
  return response.data.ufsUrl;
}

/**
 * Delete a file from UploadThing by its URL or key.
 */
export async function deleteFile(urlOrKey: string): Promise<void> {
  // Extract the file key from the URL if it's a full URL
  const key = urlOrKey.includes("/")
    ? urlOrKey.split("/").pop() ?? urlOrKey
    : urlOrKey;
  await utapi.deleteFiles(key);
}
