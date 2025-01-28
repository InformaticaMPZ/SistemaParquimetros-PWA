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
    await runMiddleware(req, res, cors);
    const { ODOO_REQUEST } = process.env;
    const sessionId = req.headers['credential'];

    if (!sessionId) {
      throw new Error(`Permiso denegado, usuario no autenticado`);
    }

    const vehicleResponse = await fetch(`${ODOO_REQUEST}/api/v1/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: {} }),
    });

    if (!vehicleResponse.ok) {
      throw new Error(`Lista de vehículos falló: ${vehicleResponse.status} - ${await vehicleResponse.text()}`);
    }

    const dataResponse = await vehicleResponse.json();

    if (!dataResponse.result.success) {
      throw new Error(`Error desde Odoo: ${dataResponse.message}`);
    }

    const vehicleList = dataResponse.result.data.map((vehicule: any) => ({
      Id: vehicule.id,
      Description: vehicule.description,
    }));

    return res.status(200).json({
      success: true,
      data: vehicleList,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}
