import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import useParkingMetersStore from '@/store/useParkingMeters.store';
import LoadingForm from 'components/General/LoadingForm/LoadingForm';

const withAuthRedirect = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { getActive } = useParkingMetersStore();
    const [loading, setLoading] = useState(true);
    const hasRun = useRef(false); 

    useEffect(() => {
      if (hasRun.current) return;
      hasRun.current = true;

      const checkActive = async () => {
        
        try {
          if ('Notification' in window) {
            Notification.requestPermission();
          }

          let statusValue = "false";
          const status = await getActive();
          statusValue = status?.data?.Value;

          if (statusValue === "false") {
            router.replace('/apagado');
            return;
          }

          if (router.pathname === '/') {
            const storedPlateInfo = localStorage.getItem("plateInfo");
            storedPlateInfo !== "[]" && storedPlateInfo !== null
              ? router.push('/compras')
              : router.push('/garaje');
            return;
          }

          setLoading(false);
        } catch (error) {
          router.replace('/apagado');
        }
      };

      checkActive();
    }, []); 

    if (loading) {
      return <LoadingForm />;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuthRedirect;
