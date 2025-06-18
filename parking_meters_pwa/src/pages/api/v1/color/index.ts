import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import getSessionId from '@/utils/sessionManager';

const cors = Cors({
  methods: ['POST', 'HEAD','OPTIONS'],
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    let sessionId = req.headers['credential'];
    if (!sessionId) {
      const nuevaSession = await getSessionId(true);
      sessionId = nuevaSession;
    }
    
    const { ODOO_REQUEST } = process.env;

    const colorResponse = await fetch(`${ODOO_REQUEST}/api/v1/colors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: {} }),
    });

    if (!colorResponse.ok) {
      throw new Error(`Lista de colores falló: ${colorResponse.status} - ${await colorResponse.text()}`);
    }

    const dataResponse = await colorResponse.json();

    if (!dataResponse.result.success) {
      throw new Error(`Error desde Odoo: ${dataResponse.message}`);
    }
    
    const colorList = dataResponse.result.data.map((color: any) => ({
      Id: color.id,
      Color: color.color,
    }));

    return res.status(200).json({
      success: true,
      data: colorList,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}