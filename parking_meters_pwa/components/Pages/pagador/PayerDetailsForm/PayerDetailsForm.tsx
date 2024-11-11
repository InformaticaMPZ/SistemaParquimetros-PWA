import React from 'react';

interface PayerDetailsProps {
  formData: { id: string; name: string; lastName: string };
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PayerDetailsForm: React.FC<PayerDetailsProps> = ({ formData, errors, handleInputChange }) => (
  <div>
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
    </div>
  </div>
);
