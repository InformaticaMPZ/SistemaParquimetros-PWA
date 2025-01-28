import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import CryptoJS from 'crypto-js';

const cors = Cors({ methods: ['POST', 'PUT', 'HEAD'] });

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result: any) => (result instanceof Error ? reject(result) : resolve(result)));
  });

const handleError = (res: NextApiResponse, error: any, statusCode: number = 500) => {
  res.status(statusCode).json({ success: false, error: error.message || 'Internal Server Error' });
};

const fetchWithAuth = async (
  url: string,
  method: string,
  sessionId: string | null,
  body: Record<string, unknown> = {}
) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['Cookie'] = `session_id=${sessionId}`;

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify({ params: body }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const { ODOO_DATABASE, ODOO_REQUEST,NEXT_PUBLIC_SESSION_KEY } = process.env;
  if (!ODOO_REQUEST || !ODOO_DATABASE) {
    return handleError(res, new Error('Faltan configuraciones en las variables de entorno'), 500);
  }

  try {
    if (req.method === 'POST') {
      const { user, password } = req.body;
      
      const [iv, encrypted] = password.split(':');

      if (!NEXT_PUBLIC_SESSION_KEY) {
        throw new Error('Encryption key is not defined');
      }
      const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(NEXT_PUBLIC_SESSION_KEY), {
          iv: CryptoJS.enc.Hex.parse(iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
     
      
      
      if (!user || !decrypted) {
        return handleError(res, new Error('Usuario y contraseña son obligatorios'), 400);
      }

      const authResponse = await fetch(`${ODOO_REQUEST}/web/session/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params: { db: ODOO_DATABASE, login: user, password: decrypted} }),
      });

      const setCookieHeader = authResponse.headers.get('set-cookie');
      const sessionIdMatch = setCookieHeader?.match(/session_id=([^;]+)/);
      if (!sessionIdMatch) throw new Error('No se recibió session_id');

      const sessionId = sessionIdMatch[1];

      const data = await fetchWithAuth(`${ODOO_REQUEST}/api/v1/login_officer`, 'POST', sessionId);
      const userData = data.result.data;

      return res.status(200).json({
        success: true,
        data: {
          Id: userData.id,
          Login: sessionId,
          User: userData.login,
          Name: userData.name,
          UpdatedStatus: userData.updated_status,
          MacPrinter: userData.phone_mac_direction,
        },
      });
    } else if (req.method === 'PUT') {
      const sessionId = req.headers.cookie;
      if (!sessionId) throw new Error('Usuario no autenticado');

      const data = await fetchWithAuth(`${ODOO_REQUEST}/api/v1/update_officer`, 'PUT', sessionId);
      return res.status(200).json({ success: true, message: data.result.message });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error: any) {
    handleError(res, error);
  }
}
