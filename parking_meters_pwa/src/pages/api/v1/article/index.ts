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
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { ODOO_REQUEST } = process.env;
        let sessionId = req.headers['credential'];
        if (!sessionId) {
            const nuevaSession = await getSessionId(true);
            sessionId = nuevaSession;
        }

        if (!sessionId) {
            throw new Error(`Permiso denegado, usuario no autenticado`);
        }

        const articleResponse = await fetch(`${ODOO_REQUEST}/api/v1/get_articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `session_id=${sessionId}`,
            },
            body: JSON.stringify({ params: {} }),
        });

        if (!articleResponse.ok) {
            throw new Error(`Lista de articulos falló: ${articleResponse.status} - ${await articleResponse.text()}`);
        }

        const dataResponse = await articleResponse.json();
        const jsonResult = JSON.parse(dataResponse.result.data);

        if (!dataResponse.result.success) {
            throw new Error(`Error desde Odoo: ${dataResponse.message}`);
        }

        const articleList = jsonResult.data.map((article: any) => ({
            Id: article.id,
            Article: article.article,
            Definition: article.definition,
            Title: article.title,
            Clauses: article.clauses.map((clause: any) => ({
                Id: clause.id,
                Name: clause.name,
                Description: clause.description,
                Title: clause.title
            }))
        }));

        return res.status(200).json({
            success: true,
            data: articleList,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
}