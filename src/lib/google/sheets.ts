import { google, sheets_v4 } from "googleapis";
import { getGoogleAuth, getSpreadsheetId } from "./auth";

export const SHEET_NAMES = {
  stakeholder: "Stakeholder",
  interaction: "Interaction",
  target: "Target",
} as const;

export const STAKEHOLDER_HEADERS = ["id", "name", "type", "created_at"];

export const INTERACTION_HEADERS = [
  "id",
  "stakeholder_id",
  "tujuan",
  "pic_name",
  "pic_role",
  "phone",
  "email",
  "source",
  "potential_score",
  "periode",
  "stage_after",
  "hasil_pembahasan",
  "next_action",
  "next_follow_up_date",
  "attachment",
  "created_at",
];

export const TARGET_HEADERS = ["periode", "target_visit"];

let sheetsClient: sheets_v4.Sheets | null = null;
const ensuredSheets = new Set<string>();

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;
  sheetsClient = google.sheets({ version: "v4", auth: getGoogleAuth() });
  return sheetsClient;
}

function columnLetter(n: number): string {
  let s = "";
  let num = n;
  while (num > 0) {
    const rem = (num - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    num = Math.floor((num - 1) / 26);
  }
  return s;
}

/** Creates the tab (with header row) if it doesn't already exist. Cached per process. */
async function ensureSheet(sheetName: string, headers: string[]): Promise<void> {
  if (ensuredSheets.has(sheetName)) return;

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });
  const existingTitles = (meta.data.sheets ?? []).map(
    (s) => s.properties?.title
  );

  if (!existingTitles.includes(sheetName)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
  }

  const lastCol = columnLetter(headers.length);
  const headerRow = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:${lastCol}1`,
  });

  if (!headerRow.data.values || headerRow.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }

  ensuredSheets.add(sheetName);
}

/** Reads a whole tab and maps rows to objects keyed by the (expected) header names. */
export async function readSheet(
  sheetName: string,
  headers: string[]
): Promise<Record<string, string>[]> {
  await ensureSheet(sheetName, headers);

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const lastCol = columnLetter(headers.length);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A2:${lastCol}`,
  });

  const rows = res.data.values ?? [];
  return rows
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] != null ? String(row[i]) : "";
      });
      return obj;
    });
}

export async function appendRow<T extends object>(
  sheetName: string,
  headers: string[],
  rowObject: T
): Promise<void> {
  await ensureSheet(sheetName, headers);

  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const lastCol = columnLetter(headers.length);

  const record = rowObject as Record<string, string | number | undefined>;
  const values = headers.map((h) => {
    const v = record[h];
    return v === undefined || v === null ? "" : v;
  });

  // The range must span the full (unbounded) column range, not just row 1 —
  // otherwise the API only "sees" the header row as the table and inserts
  // every new row right after it (row 2), pushing all prior rows down on
  // every submit instead of landing at the true bottom of the sheet.
  // insertDataOption defaults to OVERWRITE, which writes into the first
  // empty row after the last row with data (auto-expanding the sheet if
  // needed) rather than shifting existing rows — INSERT_ROWS would insert
  // a literal new grid row at the detected position instead of appending.
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:${lastCol}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`.toUpperCase();
}
