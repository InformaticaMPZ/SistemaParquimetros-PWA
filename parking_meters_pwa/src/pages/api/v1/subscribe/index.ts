import type { NextApiRequest, NextApiResponse } from 'next';
import CryptoJS from 'crypto-js';

let subscriptions: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { encryptedSubscription } = req.body;

    if (!encryptedSubscription) {
      return res.status(400).json({ error: 'Suscripción inválida' });
    }

    let subscription;
    try {
      const bytes = CryptoJS.AES.decrypt(
        encryptedSubscription,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
      );
      subscription = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      return res.status(400).json({ error: 'Error al desencriptar la suscripción' });
    }

    const existingSubscription = subscriptions.find((sub) => sub.endpoint === subscription.endpoint);

    if (!existingSubscription) {
      subscriptions.push(subscription);
    }

    res.status(201).json({
      success: true,
      message: "",
      data: 'Suscripción guardada correctamente'
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export { subscriptions };
