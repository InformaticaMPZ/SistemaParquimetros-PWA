import { Page } from '../../components/General/Page';
import { Section } from '../../components/General/Section';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {

    const redirectToConsulta = () => {
      if ('Notification' in window) {
        Notification.requestPermission();
      }
      
      if (typeof window !== 'undefined' && window.localStorage) {
        const { pathname } = router;
        if (pathname === '/') {
          const storedPlateInfo = localStorage.getItem("plateInfo");
          if (!storedPlateInfo) {
            router.push('/garaje');
          } else {
            router.push('/compras');
          }
        }
      }
    };
    redirectToConsulta();
  }, [router]);

  return (
    <Page>
      <Section>
        <Head>
          <title>MPZ | Consulta de parquímetros</title>
          <meta name="description" content="Municipalidad de Pérez Zeledón" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="dark:bg-gray-800">
          Redireccionando a consulta...
        </main>
      </Section>
    </Page>
  );
};

export default Index;
