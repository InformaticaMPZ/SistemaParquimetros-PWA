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
      let { plateNumber, plateTypeId, ticketNumber } = req.body;

      if (!plateNumber || !plateTypeId) {
        return res.status(400).json({ error: 'Missing plateNumber or plateTypeId' });
      }
    
      let currentInfraction = {
        plate_number: plateNumber,
        plate_type_id: plateTypeId,
        ticket_number: ticketNumber
      }

      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/get_infractions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "params": currentInfraction }),
      });

      if (!response.ok) {
        throw new Error("Failed to get infractions");
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

