import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import getSessionId from '@/utils/sessionManager';

const cors = Cors({
    methods: ['POST', 'HEAD', 'OPTIONS'],
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.MPZ_DOMAIN, process.env.MPZ_DOMAIN + "/"];
        if (!origin || (allowedOrigins && (allowedOrigins.includes(origin) || allowedOrigins.includes(origin)))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method == 'GET') {

        try {
            const { ODOO_REQUEST } = process.env;
            let sessionId = req.headers['credential'];
            if (!sessionId) {
                const nuevaSession = await getSessionId(true);
                sessionId = nuevaSession;
            }
            let { imageId } = req.query;
            if (!sessionId) {
                throw new Error(`Permiso denegado, usuario no autenticado`);
            }

            const imageResponse = await fetch(`${ODOO_REQUEST}/api/v1/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `session_id=${sessionId}`,
                },
                body: JSON.stringify({ params: { "id_infraction": imageId } }),
            });

            if (!imageResponse.ok) {
                throw new Error(`Lista de imagenes falló: ${imageResponse.status} - ${await imageResponse.text()}`);
            }

            const dataResponse = await imageResponse.json();
            const jsonResult = JSON.parse(dataResponse.result.data);

            if (!dataResponse.result.success) {
                throw new Error(`Error desde Odoo: ${dataResponse.message}`);
            }

            return res.status(200).json({
                success: true,
                data: jsonResult,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    } else if (req.method == 'POST') {
        try {
            await runMiddleware(req, res, cors);
            const { ODOO_REQUEST } = process.env;
            let sessionId = req.headers['credential'];
            if (!sessionId) {
                const nuevaSession = await getSessionId(true);
                sessionId = nuevaSession;
            }
            let { imageList, ticketNumber } = req.body;
            if (!sessionId) {
                throw new Error(`Permiso denegado, usuario no autenticado`);
            }

            const imageResponse = await fetch(`${ODOO_REQUEST}/api/v1/images/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `session_id=${sessionId}`,
                },
                body: JSON.stringify({ params: { "image_list": imageList, "ticket_number": ticketNumber } }),
            });

            if (!imageResponse.ok) {
                throw new Error(`Lista de imagenes falló: ${imageResponse.status} - ${await imageResponse.text()}`);
            }

            const dataResponse = await imageResponse.json();
            const jsonResult = JSON.parse(dataResponse.result.data);

            if (!dataResponse.result.success) {
                throw new Error(`Error desde Odoo: ${dataResponse.message}`);
            }

            return res.status(200).json({
                success: true,
                data: jsonResult,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || 'Internal Server Error',
            });
        }
    }
}