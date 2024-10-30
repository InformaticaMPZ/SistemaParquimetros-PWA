import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { handleModelMethodRequest } from '@/pages/api/v1/lib/odoo/RequestHelpers';

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
      const response = await handleModelMethodRequest({
        model: "parking_meters.parking_time",
        method: "create_parking_time",
        args: [],
        kwargs: {
            plate_number: req.body.plateNumber,
            plate_type_id:req.body.plateTypeId,
            parking_rate_ids:req.body.parkingRateId,
            end_time: req.body.endTime.replace("T"," ").replace(".000Z",""),
            start_time: req.body.startTime.replace("T"," ").replace(".000Z",""),
            email: req.body.email,
            phone: req.body.phone,
            name: req.body.name,
            last_name: req.body.lastName,
            id: req.body.id
        }
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
