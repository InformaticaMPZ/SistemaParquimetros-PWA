import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import getSessionId from '@/utils/sessionManager';

const cors = Cors({
  methods: ['GET', 'HEAD','OPTIONS'],
  origin: (origin, callback) => {
    const allowedOrigins =[ process.env.MPZ_DOMAIN, process.env.MPZ_DOMAIN+"/"];
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
  if (req.method === 'GET') {
    let sessionId = req.headers['credential'];
    if (!sessionId) {
      const nuevaSession = await getSessionId(true);
      sessionId = nuevaSession;
    }

    if (!sessionId) {
      throw new Error(`Permiso denegado, usuario no autenticado`);
    }
    try {
      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/get_parking_rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Cookie': `session_id=${sessionId}`,
        },
        body: JSON.stringify({ "params": "" }),
      });
      
      
      if (!response.ok) {
        throw new Error("Failed to get parking rate");
      }

      const jsonResponse = await response.json();

      res.status(200).json(jsonResponse.result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
