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
  let body = req.body;
  if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON" });
      }
    }
  let { parameterName } = body;
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

    const parameterResponse = await fetch(`${ODOO_REQUEST}/api/v1/parameter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: { "parameter_name": parameterName } }),
    });

    if (!parameterResponse.ok) {
      if (parameterName === "parking_meters.Is_Active") {
        const parameterData = {
          Value: "false"
        };
        res.status(200).json({
          success: true,
          data: parameterData,
        });
        return;
      } else {
        throw new Error(`Obtener parametro falló: ${parameterResponse.status} - ${await parameterResponse.text()}`);
      }
    }

    const data = await parameterResponse.json();

    const parameterData = {
      Value: data.result.data.parameter_value
    };

    res.status(200).json({
      success: true,
      data: parameterData,
    });
  } catch (error: any) {
    if (parameterName === "parking_meters.Is_Active") {
      const parameterData = {
        Value: "false"
      };
      res.status(200).json({
        success: true,
        data: parameterData,
      });
      return;
    } else {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal Server Error',
      });
    }
  }
}