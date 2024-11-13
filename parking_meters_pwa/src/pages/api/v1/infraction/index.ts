import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import { handleGetRequest } from '@/pages/api/v1/lib/odoo/RequestHelpers';

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

      let domain = [];
      if (plateNumber && plateTypeId) {
        domain.push(['plate_number', '=', plateNumber], ['plate_type_id', '=', plateTypeId]);
      }

      if (ticketNumber) {
        domain = [['ticket_number', '=', ticketNumber]];
      }
   
      const response = await handleGetRequest({
        model: "parking_meters.infraction",
        domain: domain,
        defaultFields: [
          'id',
          'ticket_number',
          'plate_type_id',
          'plate_number',
          'plate_detail_id',
          'infraction_price_id',
          'first_location',
          'second_location',
          'third_location',
          'infraction_state_id',
          'registration_date',
          'brand_code_id',
          'color_code_id',
          'article_code_id',
          'clause_code_id',
          'vehicule_code_id',
          'observations',
          'latitude',
          'longitude',
          'surcharge',
          'cancellation_description',
          'inspector_user_id'
        ],
        defaultOffset: 0,
        defaultLimit: 10,
        defaultOrder: 'id DESC',
      });
      let result = await response.json();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

