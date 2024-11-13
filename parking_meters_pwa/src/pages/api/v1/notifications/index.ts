import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import { subscriptions } from '../subscribe';

webpush.setVapidDetails(
  'https://www.perezzeledon.go.cr',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { payload } = req.body;
  
    try {
      console.log(subscriptions);
      
      const sendNotifications = subscriptions.map(subscription =>
        webpush.sendNotification(subscription, JSON.stringify(payload))
      );
      
      await Promise.all(sendNotifications);
      res.status(200).json({ message: 'Notificación enviada a todos los suscriptores' });
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      res.status(500).json({ error: 'Error al enviar la notificación' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
