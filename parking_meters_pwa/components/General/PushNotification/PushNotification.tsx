import useParkingMetersStore from '@/store/useParkingMeters.store';
import { useEffect } from 'react';

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const subscribeToPushNotifications = async (getPushSubscription: any) => {
    try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string),
        });

        if (!subscription) {
            console.error('Failed to create subscription');
            return;
        }

        const response = await getPushSubscription(subscription);

        if (!response.success) {
            console.error('Failed to save subscription:', response.message);
        }

    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
    }
};

export const PushNotification = () => {
    const { getPushSubscription } = useParkingMetersStore();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => navigator.serviceWorker.ready)
                .then((registration) => {
                    return registration.pushManager.getSubscription();
                })
                .then((subscription) => {
                    if (!subscription) {
                        subscribeToPushNotifications(getPushSubscription);
                    }
                    else {
                        getPushSubscription(subscription);
                    }
                })
                .catch((error) => console.error('Service Worker registration or subscription failed:', error));
        }
    }, [getPushSubscription]);

    return null;
};
