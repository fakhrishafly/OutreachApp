import { Readable } from "node:stream";
import { google } from "googleapis";
import { getGoogleAuth } from "./auth";

export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_DRIVE_FOLDER_ID
  );
}

/** Uploads a file to the configured Drive folder and returns a shareable link. */
export async function uploadToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error(
      "Missing GOOGLE_DRIVE_FOLDER_ID. See SETUP.md for how to configure Drive uploads."
    );
  }

  const drive = google.drive({ version: "v3", auth: getGoogleAuth() });

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
  });

  const fileId = created.data.id;
  if (!fileId) {
    throw new Error("Drive upload failed: no file id returned.");
  }

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const file = await drive.files.get({
    fileId,
    fields: "webViewLink",
  });

  return file.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`;
}
