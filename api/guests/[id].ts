import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

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
        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            throw new Error('Missing Google Sheets configuration');
        }

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

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
                headerValues: [HEADERS.id, HEADERS.names, HEADERS.tableNumber, HEADERS.attending, HEADERS.timestamp],
            });
        }

        const id = req.query.id as string;
        const rows = await sheet.getRows();
        const row = rows.find(r => String(r.get(HEADERS.id)) === id);

        if (!row) {
            res.status(404).json({ error: 'Guest not found' });
            return;
        }

        if (req.method === 'PATCH') {
            const body = req.body || {};
            if (body.names) row.set(HEADERS.names, Array.isArray(body.names) ? body.names.join('; ') : String(body.names));
            if (body.tableNumber !== undefined) row.set(HEADERS.tableNumber, String(body.tableNumber || ''));
            if (typeof body.attending === 'boolean') row.set(HEADERS.attending, body.attending ? 'Yes' : 'No');
            if (body.timestamp !== undefined) row.set(HEADERS.timestamp, String(body.timestamp || ''));
            await row.save();
            res.status(200).json({ success: true });
            return;
        }

        if (req.method === 'DELETE') {
            await row.delete();
            res.status(204).end();
            return;
        }

        res.status(405).json({ error: 'Method not allowed' });
        return;
    } catch (error) {
        console.error('Error in guests/[id] API:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
        return;
    }
}


