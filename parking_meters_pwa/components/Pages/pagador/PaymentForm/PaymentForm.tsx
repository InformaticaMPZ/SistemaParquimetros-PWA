import React, { useEffect, useState } from 'react';
import { CustomCard } from 'components/General/CustomCard';
import { FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import { paymentFormSchema } from './PaymentFormSchema';
import useParkingMetersStore from '@/store/useParkingMeters.store';
import { formatAmount } from '@/utils/converter';
import { useRouter } from 'next/router';
import { ModalNotification } from 'components/General/ModalNotification';
import Link from 'next/link';
import Loading from 'components/General/LoadingForm/LoadingForm';
import { Stepper } from '../Stepper';
import { PaymentWarningMessage } from '../PaymentWarningMessage';

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
            <div>
              <label
                htmlFor="id"
                className="min-w-full block my-2 text-sm font-medium font-bolder text-gray-900 dark:text-white"
              >
                Cédula
              </label>
              <input
                autoFocus
                type="text"
                name="id"
                id="id"
                value={formData.id}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="0123456789"
              />
              {errors.id && <div className="text-red-500">{errors.id._errors[0]}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-8 md:gap-4">
              <div className='col-span-4'>
                <label
                  htmlFor="name"
                  className="min-w-full block my-2 text-sm font-medium font-bolder text-gray-900 dark:text-white"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                />
                {errors.name && <div className="text-red-500">{errors.name._errors[0]}</div>}
              </div>

              <div className='col-span-4'>
                <label
                  htmlFor="lastName"
                  className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Apellidos
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                />
                {errors.lastName && <div className="text-red-500">{errors.lastName._errors[0]}</div>}
              </div>

              <div className='col-span-5'>
                <label
                  htmlFor="email"
                  className="min-w-full block my-2 text-sm font-medium font-bolder text-gray-900 dark:text-white"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="correo@mail.com"
                />
                {errors.email && <div className="text-red-500">{errors.email._errors[0]}</div>}
              </div>

              <div className='col-span-3'>
                <label
                  htmlFor="phone"
                  className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="88889999"
                />
                {errors.phone && <div className="text-red-500">{errors.phone._errors[0]}</div>}
              </div>
            </div>
          </form>

        </CustomCard>

        {selectedPlateType && <CustomCard title='Datos de la Placa' classNameCard='mt-3' className='p-4'>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div>
                <label htmlFor="plateNumber" className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Placa del Vehículo
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="plateNumber"
                  name="plateNumber"
                  value={parkingTime.plateNumber}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className='col-span-3'>
                <label htmlFor="plateType" className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tipo de Placa
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="plateType"
                  name="plateType"
                  value={selectedPlateType.description}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              {selectedPlateType.plate_details[0].government_code &&
                <div className='col-span-2'>
                  <label htmlFor="plateClass" className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white">
                    Clase de Placa
                  </label>
                  <input
                    disabled={true}
                    type="text"
                    id="plateClass"
                    name="plateClass"
                    value={selectedPlateType.plate_details[0].class_code}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              }
              {selectedPlateType.plate_details[0].government_code &&
                <div className='col-span-2'>
                  <label htmlFor="plateCode" className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white">
                    Código de Placa
                  </label>
                  <input
                    disabled={true}
                    type="text"
                    id="plateCode"
                    name="plateCode"
                    value={selectedPlateType.plate_details[0].government_code}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>
              }
            </div>
            {!selectedPlateType.plate_details[0].government_code &&
              <div>
                <label htmlFor="plateClass" className="min-w-full block my-2 text-sm font-medium text-gray-900 dark:text-white">
                  Clase de Placa
                </label>
                <input
                  disabled={true}
                  type="text"
                  id="plateClass"
                  name="plateClass"
                  value={selectedPlateType.plate_details[0].class_code}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            }
          </form>
        </CustomCard>
        }
        <CustomCard title='Datos del Pago' classNameCard='mt-3 mb-5' className='p-4'>
          <form onSubmit={handleSubmit}>

            <Stepper startTime={parkingTime.startTime} endTime={parkingTime.endTime} />

            <h2 className="text-center text-2xl tracking-tight font-bold text-gray-900 dark:text-white border rounded-lg p-2 dark:bg-gray-700 bg-gray-200">
              Monto a cancelar:
              <span className="block text-center text-2xl tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                {formatAmount(parkingTime.amount)}
              </span>
            </h2>

            <div className="flex w-full  mt-6">
              <PaymentWarningMessage />
            </div>
            <div className="flex items-center justify-center mb-10 mt-4">
              <div className="flex items-center h-5 mt-[3px]">
                <input
                  id="isTermsAccepted"
                  type="checkbox"
                  name="isTermsAccepted"
                  checked={formData.isTermsAccepted}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
              </div>

              <div>
                <label htmlFor="isTermsAccepted" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Acepto los &nbsp;
                  <Link href="/" className="text-blue-600 hover:underline dark:text-blue-500">Términos y Condiciones</Link >
                </label>
                {errors.isTermsAccepted && <div className="text-red-500 ml-2">{errors.isTermsAccepted._errors[0]}</div>}
              </div>
            </div>
            <div className="flex w-full justify-between mt-6 mb-4">
              <button
                className="py-2.5 px-5 w-40 text-green-800 mr-2 text-sm font-medium focus:outline-none text-center inline-flex items-center bg-white rounded-lg border border-gray-200 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                onClick={() => { router.push('/compras'); }}
              >
                <FaArrowLeft className="mx-2 " size={20} />
                Volver a Consulta
              </button>
              <button
                disabled={parkingTime.amount === 0}
                type="submit"
                className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center
                  ${parkingTime.amount === 0 ? 'bg-gray-400 cursor-not-allowed' :
                  'bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'}`}
              >
                <FaCreditCard className="mr-2" /> Pagar
              </button>
            </div>
          </form>
          <ModalNotification
            title='¡Se presentó un error!'
            message={<div dangerouslySetInnerHTML={{ __html: errors }} />}
            notificationType="error"
            cancelText="Cancel"
            isOpenModal={isModalOpen}
            closeModal={closeModal}
            showAprobeButton={false}
          />
        </CustomCard>
        {loading && <Loading />}

      </div>
    </div>
  );
};
