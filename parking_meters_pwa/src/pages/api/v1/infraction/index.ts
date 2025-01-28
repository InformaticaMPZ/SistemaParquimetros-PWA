import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST','GET','PUT','HEAD'],
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

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

      let { plateNumber, plateTypeId, ticketNumber, isToday } = req.query;
 
      const sessionId = req.headers['credential'];     
      if (!sessionId) {
        throw new Error(`Permiso denegado, usuario no autenticado`);
      }

      let currentInfraction = {
        plate_number: plateNumber,
        plate_type_id: plateTypeId,
        ticket_number: ticketNumber,
        is_today: isToday
      }
    
      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/infractions`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `session_id=${sessionId}`,
        },
        body: JSON.stringify({ "params": currentInfraction }),
      });

      if (!response.ok) {
        throw new Error("Fallo al obtener infracciones");
      }

      const jsonResponse = await response.json();

      if (!jsonResponse.result.success) {
        throw new Error(`Error desde Odoo: ${jsonResponse.message}`);
      }
   
      if (jsonResponse.result.data.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }
      
      return res.status(200).json({
        success: true,
        data: jsonResponse.result.data,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
   
    try {
      const sessionId = req.headers['credential'];
      if (!sessionId) {
        return res.status(401).json({ error: 'Permiso denegado, usuario no autenticado' });
      }
  
      const infractionData = {
        ticket_number: req.body.ticketNumber,
        plate_type_id: req.body.plateTypeId,
        plate_number: req.body.plateNumber,
        plate_detail_id: req.body.plateDetailId,
        infraction_price_id: req.body.infractionPriceId,
        first_location: req.body.firstLocation,
        second_location: req.body.secondLocation,
        third_location: req.body.thirdLocation,
        infraction_state_id: req.body.infractionStateId,
        registration_date: req.body.registrationDate,
        payment_date: req.body.paymentDate,
        brand_code_id: req.body.brandCodeId,
        color_code_id: req.body.colorCodeId,
        article_code_id: req.body.articleCodeId,
        clause_code_id: req.body.clauseCodeId,
        vehicle_code_id: req.body.vehiculeCodeId,
        observations:req.body.observations,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        surcharge:req.body.surcharge,
        cancellation_description: req.body.cancellationDescription,
        inspector_user_id: req.body.inspectorUserId,
        image_list: req.body.imageList,
      };

      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/infraction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `session_id=${sessionId}`,
        },
        body: JSON.stringify({ params: infractionData }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la infracción');
      }

      const jsonResponse = await response.json();

      if (!jsonResponse.result.success) {
        return res.status(400).json({ error: jsonResponse.message });
      }
      
      res.status(200).json({
        success: true,
        message: 'Infracción registrada exitosamente',
        data: jsonResponse.result.data,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: `Error interno: ${errorMessage}` });
    }
  } else if (req.method === 'PUT') {
    try {
      const sessionId = req.headers['credential'];
      if (!sessionId) {
        return res.status(401).json({ error: 'Permiso denegado, usuario no autenticado' });
      }
  
      const infractionData = {
        ticket_number: req.body.ticketNumber,
        plate_type_id: req.body.plateTypeId,
        plate_number: req.body.plateNumber,
        plate_detail_id: req.body.plateDetailId,
        infraction_price_id: req.body.infractionPriceId,
        first_location: req.body.firstLocation,
        second_location: req.body.secondLocation,
        third_location: req.body.thirdLocation,
        infraction_state_id: req.body.infractionStateId,
        registration_date: req.body.registrationDate,
        payment_date: req.body.paymentDate,
        brand_code_id: req.body.brandCodeId,
        color_code_id: req.body.colorCodeId,
        article_code_id: req.body.articleCodeId,
        clause_code_id: req.body.clauseCodeId,
        vehicle_code_id: req.body.vehiculeCodeId,
        observations:req.body.observations,
        latitude:req.body.latitude,
        longitude:req.body.longitude,
        surcharge:req.body.surcharge,
        cancellation_description: req.body.cancellationDescription,
        inspector_user_id: req.body.inspectorUserId,
        image_list: req.body.imageList,
      };

      const response = await fetch(`${process.env.ODOO_REQUEST}/api/v1/infraction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `session_id=${sessionId}`,
        },
        body: JSON.stringify({ params: infractionData }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar la infracción');
      }

      const jsonResponse = await response.json();

      if (!jsonResponse.result.success) {
        return res.status(400).json({ error: jsonResponse.message });
      }
      
      res.status(200).json({
        success: true,
        message: 'Infracción registrada exitosamente',
        data: jsonResponse.result.data,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(500).json({ error: `Error interno: ${errorMessage}` });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

