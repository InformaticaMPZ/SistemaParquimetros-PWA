import React, { useEffect, useRef, useState } from 'react';
import { CustomCard } from 'components/General/CustomCard';
import { paymentFormSchema } from './PaymentFormSchema';
import useParkingMetersStore from '@/store/useParkingMeters.store';
import { useRouter } from 'next/router';
import Loading from 'components/General/LoadingForm/LoadingForm';
import { PayerDetailsForm } from '../PayerDetailsForm';
import { ContactInfoForm } from '../ContactInfoForm';
import { PlateSummary } from '../PlateSummary';
import { PaymentConfirmationForm } from '../PaymentConfirmationForm';
import { usePushNotifications } from '@/hooks/usePushNotification';

export const PaymentForm = () => {
  const { subscribeToPushNotifications } = usePushNotifications();
  const { plateTypeList, parkingTime, setParkingTime, getParkingTime, loading, getClientIP, setPayment } = useParkingMetersStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    isTermsAccepted: false,
    id: '',
    name: '',
    lastName: '',
    amount: 0
  });
  useEffect(() => { getClientIP(); }, [getClientIP]);
  const [errors, setErrors] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputRefs = {
    id: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setParkingTime({
      email: formData.email,
      id: formData.id,
      name: formData.name,
      lastName: formData.lastName,
      phone: formData.phone
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = paymentFormSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.format();
      const firstErrorField = Object.keys(formattedErrors)[1];
      if (firstErrorField && firstErrorField in inputRefs) {
        inputRefs[firstErrorField as keyof typeof inputRefs]?.current?.focus();
      }
      setErrors(result.error.format());
      return;
    }

    if (parkingTime.ticketNumber === '') {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register(process.env.NODE_ENV === 'development' ? '/sw.js' : '/apps/app_pagos_tiempo/sw.js');
          let responseSubscription = await subscribeToPushNotifications();
          if (responseSubscription.success) {
            setParkingTime({ subscription: responseSubscription.data });
            const response = await getParkingTime();
            if (!response.success) {
              throw new Error(response.message);
            }
            router.push(response.data);
          } else {
            throw new Error(responseSubscription.message);
          }
        } catch (error: any) {
          setIsModalOpen(true);
          setErrors(error.message);
        }
      }
    } else {
      const response = await setPayment();
      if (!response.success) {
        throw new Error(response.message);
      }
      router.push(response.data.collector);
    }
  };

  const selectedPlateType = plateTypeList
    .filter((plateType: any) => plateType.Id === parkingTime.plateTypeId).map((plateClass: any) => {
      const filteredPlateDetail = plateClass.PlateDetails.find(
        (detail: any) => detail.Id === parkingTime.plateDetailId
      ) || plateClass.PlateDetails[0];
      return {
        ...plateClass,
        PlateDetails: filteredPlateDetail
      };
    })[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className="col-span-1 md:col-span-3 md:col-start-2">
        <CustomCard title='Datos del Pagador' className='p-4' >
          <form>
            <PayerDetailsForm inputRefs={inputRefs} formData={formData} errors={errors} handleInputChange={handleInputChange} />
            <ContactInfoForm inputRefs={inputRefs} formData={formData} errors={errors} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />
          </form>
        </CustomCard>

        {selectedPlateType && <CustomCard title='Datos de la Placa' classNameCard='mt-3' className='p-4'>
          <form>
            <PlateSummary selectedPlateType={selectedPlateType} parkingTime={parkingTime} />
          </form>
        </CustomCard>
        }
        <CustomCard title='Datos del Pago' classNameCard='mt-3 mb-5' className='p-4'>
          <PaymentConfirmationForm
            parkingTime={parkingTime}
            formData={formData}
            errors={errors}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmit={handleSubmit}
          />
        </CustomCard>
        {loading && <Loading />}
      </div>
    </div>
  );
};
