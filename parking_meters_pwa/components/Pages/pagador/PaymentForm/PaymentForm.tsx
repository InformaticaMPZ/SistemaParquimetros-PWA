import React, { useState } from 'react';
import { CustomCard } from 'components/General/CustomCard';
import { paymentFormSchema } from './PaymentFormSchema';
import useParkingMetersStore from '@/store/useParkingMeters.store';
import { useRouter } from 'next/router';
import Loading from 'components/General/LoadingForm/LoadingForm';
import { PayerDetailsForm } from '../PayerDetailsForm';
import { ContactInfoForm } from '../ContactInfoForm';
import { PlateSummary } from '../PlateSummary';
import { PaymentConfirmationForm } from '../PaymentConfirmationForm';

export const PaymentForm = () => {
  const { plateTypeList, parkingTime, setParkingTime, getParkingTime, loading } = useParkingMetersStore();
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

  const [errors, setErrors] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setErrors(formattedErrors);
    } else {
      getParkingTime().then((response) => {
        if (!response.success) {
          setIsModalOpen(true);
          setErrors(response.message);
        }
      });
    }
  };

  const selectedPlateType = plateTypeList
    .filter(plateType => plateType.id === parkingTime.plateTypeId).map((plateClass: any) => {
      const filteredPlateDetails = plateClass.plate_details.filter((detail: any) => detail.id === parkingTime.plateDetailId);
      return {
        ...plateClass,
        plate_details: filteredPlateDetails
      };
    })
    .filter(item => item.plate_details.length > 0)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5">
      <div className="col-span-1 md:col-span-3 md:col-start-2">

        <CustomCard title='Datos del Pagador' className='p-4' >
          <form>
            <PayerDetailsForm formData={formData} errors={errors} handleInputChange={handleInputChange} />
            <ContactInfoForm formData={formData} errors={errors} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />
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
