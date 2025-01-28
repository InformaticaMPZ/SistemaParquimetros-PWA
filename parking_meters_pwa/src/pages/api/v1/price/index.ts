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

    const priceResponse = await fetch(`${ODOO_REQUEST}/api/v1/price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session_id=${sessionId}`,
      },
      body: JSON.stringify({ params: {} }),
    });

    if (!priceResponse.ok) {
      throw new Error(`Precio de Infracciones falló: ${priceResponse.status} - ${await priceResponse.text()}`);
    }

    const data = await priceResponse.json();
  
    const rangeData = {
      Id: data.result.data.id,
      Price: data.result.data.price,
      UpdateDate: data.result.data.update_date
    };

    res.status(200).json({
      success: true,
      data: rangeData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}