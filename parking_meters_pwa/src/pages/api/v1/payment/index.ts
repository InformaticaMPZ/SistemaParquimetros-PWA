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
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    try {
        let { temporalId } = req.body;

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