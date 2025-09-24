import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


interface ServiceAccountCredentials {
    client_email: string;
    private_key: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Проверяем конфигурацию
        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            throw new Error('Missing Google Sheets configuration');
        }

        // Авторизация
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        // Лист гостей — используем понятные английские заголовки
        const HEADERS = {
            id: 'ID',
            names: 'Names',
            tableNumber: 'Table Number',
            attending: 'Attending',
            timestamp: 'Timestamp',
        } as const;

        let sheet = doc.sheetsByTitle['Guests'];
        if (!sheet) {
            sheet = await doc.addSheet({
                title: 'Guests',
                headerValues: [
                    HEADERS.id,
                    HEADERS.names,
                    HEADERS.tableNumber,
                    HEADERS.attending,
                    HEADERS.timestamp,
                ],
            });
        }

        if (req.method === 'GET') {
            const rows = await sheet.getRows();
            const guests = rows.map(row => ({
                id: row.get(HEADERS.id) || `guest-${row.rowNumber}`,
                names: (row.get(HEADERS.names) || '')
                    .split(';')
                    .map((name: string) => name.trim())
                    .filter(Boolean),
                tableNumber: row.get(HEADERS.tableNumber) || '',
                attending: parseAttending(row.get(HEADERS.attending)),
                timestamp: row.get(HEADERS.timestamp) || ''
            }));
            res.status(200).json(guests);
            return;
        }

        if (req.method === 'POST') {
            const body = req.body;
            const id = String(body.id || `guest-${Date.now()}`);
            const names = Array.isArray(body.names) ? body.names : [];
            const tableNumber = String(body.tableNumber || '');
            const attending = typeof body.attending === 'boolean' ? body.attending : undefined;
            const timestamp = String(body.timestamp || '');

            await sheet.addRow({
                [HEADERS.id]: id,
                [HEADERS.names]: names.join('; '),
                [HEADERS.tableNumber]: tableNumber,
                [HEADERS.attending]: attending === undefined ? '' : attending ? 'Yes' : 'No',
                [HEADERS.timestamp]: timestamp,
            });
            res.status(201).json({ success: true, id });
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
        return;

    } catch (error) {
        console.error('Error in guests API:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
}

function parseAttending(value: unknown): boolean | undefined {
    const v = String(value || '').toLowerCase().trim();
    if (!v) return undefined;
    if (v === 'yes' || v === 'да' || v === 'true') return true;
    if (v === 'no' || v === 'нет' || v === 'false') return false;
    return undefined;
}