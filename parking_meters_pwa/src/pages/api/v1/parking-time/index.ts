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
      let body = req.body;

      if (typeof req.body === 'string') {
        body = JSON.parse(req.body);
      }
      let currentParkingTime = {
        plate_number: body.plateNumber,
        plate_type_id: body.plateTypeId,
        parking_rate_ids: body.parkingRateId,
        end_time: body.endTime.replace("T", " ").replace(".000Z", ""),
        start_time: body.startTime.replace("T", " ").replace(".000Z", ""),
        email: body.email,
        phone: body.phone,
        name: body.name,
        last_name: body.lastName,
        id: body.id,
        subscription: body.subscription,
        ip:body.ip,
        amount:body.amount
      }

      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/create_parking_time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "params": currentParkingTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to add parking time");
      }

      const jsonResponse = await response.json();

      res.status(200).json(jsonResponse.result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

