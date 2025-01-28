import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'HEAD'],
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { plateNumber, plateTypeId } = req.body;

    await runMiddleware(req, res, cors);
    const { ODOO_REQUEST } = process.env;
    const sessionId = req.headers['credential'];

    if (!sessionId) {
      throw new Error(`Permiso denegado, usuario no autenticado`);
    }

    const timeResponse = await fetch(`${ODOO_REQUEST}/api/v1/time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: {"plate_number": plateNumber, "plate_type_id":plateTypeId} }),
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
      data: {"minutes": dataResponse.result.data.remaining_minutes, "seconds": dataResponse.result.data.remaining_seconds},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}