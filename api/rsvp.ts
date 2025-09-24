import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export const config = {
    runtime: 'nodejs20.x',
};

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
        // Проверяем обязательные переменные окружения
        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            throw new Error('Missing Google Sheets configuration');
        }

        // Создаём JWT клиент для авторизации
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        // Имена колонок листа для RSVP
        const HEADERS = {
            guestName: 'Guest Name',
            tableNumber: 'Table Number',
            attending: 'Attending',
            timestamp: 'Timestamp',
            userAgent: 'User Agent',
            url: 'URL',
            createdAt: 'Created At',
        } as const;

        // Гарантируем наличие листа
        let rsvpSheet = doc.sheetsByTitle['RSVP Responses'];
        if (!rsvpSheet) {
            rsvpSheet = await doc.addSheet({
                title: 'RSVP Responses',
                headerValues: [
                    HEADERS.guestName,
                    HEADERS.tableNumber,
                    HEADERS.attending,
                    HEADERS.timestamp,
                    HEADERS.userAgent,
                    HEADERS.url,
                    HEADERS.createdAt,
                ]
            });
        }

        if (req.method === 'GET') {
            const rows = await rsvpSheet.getRows();
            const data = rows.map(row => ({
                guestName: row.get(HEADERS.guestName) || '',
                tableNumber: row.get(HEADERS.tableNumber) || '',
                attending: parseAttending(row.get(HEADERS.attending)),
                timestamp: row.get(HEADERS.timestamp) || '',
                userAgent: row.get(HEADERS.userAgent) || '',
                url: row.get(HEADERS.url) || '',
                createdAt: row.get(HEADERS.createdAt) || '',
            }));
            res.status(200).json(data);
            return;
        }

        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method not allowed' });
            return;
        }

        const data = req.body;

        // Записываем строку в лист
        await rsvpSheet.addRow({
            [HEADERS.guestName]: data.guestName,
            [HEADERS.tableNumber]: data.tableNumber,
            [HEADERS.attending]: data.attending ? 'Yes' : 'No',
            [HEADERS.timestamp]: data.timestamp,
            [HEADERS.userAgent]: data.userAgent,
            [HEADERS.url]: data.url,
            [HEADERS.createdAt]: new Date().toISOString(),
        });

        res.status(200).json({ success: true, message: 'RSVP data saved successfully' });
        return;

    } catch (error) {
        console.error('Error in RSVP API:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        return;
    }
}

function parseAttending(value: unknown): boolean {
    const v = String(value || '').toLowerCase().trim();
    return v === 'yes' || v === 'да' || v === 'true';
}