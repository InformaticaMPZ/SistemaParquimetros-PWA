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
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON" });
      }
    }

    const { plateNumber, plateTypeId } = body;
    const { ODOO_REQUEST } = process.env;
    let sessionId = req.headers['credential'];
    if (!sessionId) {
      const nuevaSession = await getSessionId(true);
      sessionId = nuevaSession;
    }

    if (!sessionId) {
      throw new Error(`Permiso denegado, usuario no autenticado`);
    }

    const timeResponse = await fetch(`${ODOO_REQUEST}/api/v1/time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: { "plate_number": plateNumber, "plate_type_id": plateTypeId } }),
    });

    if (!timeResponse.ok) {
      throw new Error(`Lista de marcas falló: ${timeResponse.status} - ${await timeResponse.text()}`);
    }

    const dataResponse = await timeResponse.json();

    if (!dataResponse.result.success) {
      throw new Error(`Error desde Odoo: ${dataResponse.message}`);
    }

    return res.status(200).json({
      success: true,
      data: { "minutes": dataResponse.result.data.remaining_minutes, 
        "seconds": dataResponse.result.data.remaining_seconds, 
        "nextTime": dataResponse.result.data.next_start_time,
        "allTime": dataResponse.result.data.all_to_day_records,
       },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}