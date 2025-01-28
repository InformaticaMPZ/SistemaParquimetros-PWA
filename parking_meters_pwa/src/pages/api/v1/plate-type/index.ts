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

        const plateTypeResponse = await fetch(`${ODOO_REQUEST}/api/v1/get_plate_type`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `session_id=${sessionId}`,
            },
            body: JSON.stringify({ params: {} }),
        });

        if (!plateTypeResponse.ok) {
            throw new Error(`Lista de tipos de placas falló: ${plateTypeResponse.status} - ${await plateTypeResponse.text()}`);
        }

        const dataResponse = await plateTypeResponse.json();
        const jsonResult = JSON.parse(dataResponse.result.data);
       
        if (!dataResponse.result.success) {
            throw new Error(`Error desde Odoo: ${dataResponse.message}`);
        }

        const plateTypeList = jsonResult.data.map((plate: any) => ({
            Id: plate.id,
            Description: plate.description,
            PlateDetails: plate.plate_details.map((detail: any) => ({
                Id: detail.id,
                ClassCode: detail.class_code,
                GovermentCode: detail.government_code
            }))
        }));

        return res.status(200).json({
            success: true,
            data: plateTypeList,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Internal Server Error',
        });
    }
}