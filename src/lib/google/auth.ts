import { google } from "googleapis";

let cachedAuth: InstanceType<typeof google.auth.JWT> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. See SETUP.md for how to configure Google API access.`
    );
  }
  return value;
}

/**
 * Shared service-account auth client for both Sheets and Drive.
 * Cached across invocations within the same server instance.
 */
export function getGoogleAuth() {
  if (cachedAuth) return cachedAuth;

  const email = requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const rawKey = requireEnv("GOOGLE_PRIVATE_KEY");
  const privateKey = rawKey.replace(/\\n/g, "\n");

  cachedAuth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });

  return cachedAuth;
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY
  );
}

export function getSpreadsheetId(): string {
  return requireEnv("GOOGLE_SHEET_ID");
}
