import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import getSessionId from '@/utils/sessionManager';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD', 'OPTIONS'],
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

  if (req.method === 'POST') {
    try {
      let sessionId = req.headers['credential'];
      if (!sessionId) {
        const nuevaSession = await getSessionId(true);
        sessionId = nuevaSession;
      }

      if (!sessionId) {
        throw new Error(`Permiso denegado, usuario no autenticado`);
      }
      let body = req.body;

      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (error) {
          return res.status(400).json({ error: "Invalid JSON" });
        }
      }

      const {
        ticket_number,
        email,
        identification,
        ip,
        phone,
        name,
        last_name
      } = body;

      if (!ticket_number) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/insert_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${sessionId}`,
        },
        body: JSON.stringify({
          params: {
            ticket_number,
            email,
            identification,
            ip,
            phone,
            name,
            last_name
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to insert payment');
      }

      const jsonResponse = await response.json();
      return res.status(200).json({
        success: true,
        data: jsonResponse.result,
      });
    } catch (error) {
      console.error('Error inserting payment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    try {
      let { temporalId } = req.query;

      if (!temporalId) {
        return res.status(400).json({ error: 'Missing temporal invoice' });
      }
      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/get_payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "params": { "tem_invoice": temporalId } }),
      });

      if (!response.ok) {
        throw new Error("Failed to get payment");
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