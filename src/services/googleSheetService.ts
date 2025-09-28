import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || 'YOUR_GOOGLE_SHEET_ID';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'YOUR_SERVICE_ACCOUNT_EMAIL';
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || 'YOUR_PRIVATE_KEY').replace(/\\n/g, '\n');

const serviceAccountAuth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);

export async function loadGoogleSheet(): Promise<void> {
  await doc.loadInfo();
}

export async function addRowToSheet(sheetTitle: string, rowData: any): Promise<void> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) throw new Error(`Лист с названием "${sheetTitle}" не найден.`);
  await sheet.addRow(rowData);
}

export async function getRowsFromSheet(sheetTitle: string): Promise<any[]> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) throw new Error(`Лист с названием "${sheetTitle}" не найден.`);
  const rows = await sheet.getRows();
  return rows.map(row => row.toObject());
}

export async function updateRowInSheet(sheetTitle: string, rowIndex: number, rowData: any): Promise<void> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) throw new Error(`Лист с названием "${sheetTitle}" не найден.`);
  const rows = await sheet.getRows();
  if (rowIndex < 0 || rowIndex >= rows.length) throw new Error(`Строка с индексом ${rowIndex} не найдена.`);
  for (const key in rowData) {
    rows[rowIndex][key] = rowData[key];
  }
  await rows[rowIndex].save();
}

export async function deleteRowFromSheet(sheetTitle: string, rowIndex: number): Promise<void> {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];
  if (!sheet) throw new Error(`Лист с названием "${sheetTitle}" не найден.`);
  const rows = await sheet.getRows();
  if (rowIndex < 0 || rowIndex >= rows.length) throw new Error(`Строка с индексом ${rowIndex} не найдена.`);
  await rows[rowIndex].delete();
}


