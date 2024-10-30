import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { handleModelMethodRequest } from '@/pages/api/v1/lib/odoo/RequestHelpers';

const cors = Cors({
  methods: ['GET', 'HEAD'],
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
  if (req.method === 'GET') {
    try {
      const response = await handleModelMethodRequest({
        model: "parking_meters.plate_type",
        method: "get_plates_with_types",
        args: [],
        kwargs: {}
      });
    
      res.status(200).json(JSON.parse(response.data).data);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
