import Loading from 'components/General/LoadingForm/LoadingForm';
import { Page } from 'components/General/Page';
import { TransactionState } from 'components/Pages/finalizar/TransactionState';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Finalizar = () => {
  const router = useRouter();
  const { temId } = router.query;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (temId) {
      setLoading(false);
    }
  }, [temId]);

  return (
    <>
      <Page haveBottoms={false}>
        {loading ? <Loading /> : <TransactionState tempInvoice={temId} />}
      </Page>
    </>
  );
};

export default Finalizar;
