// Заглушки для backward-compatibility. Google Sheets больше не используется.
export async function loadGoogleSheet(): Promise<void> { return; }
export async function addRowToSheet(): Promise<void> { return; }
export async function getRowsFromSheet(): Promise<any[]> { return []; }
export async function updateRowInSheet(): Promise<void> { return; }
export async function deleteRowFromSheet(): Promise<void> { return; }


