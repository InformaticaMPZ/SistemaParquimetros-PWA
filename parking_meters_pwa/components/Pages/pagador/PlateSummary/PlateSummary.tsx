import React from 'react';

interface PlateSummaryProps {
    selectedPlateType: any;
    parkingTime: any;
}

export const PlateSummary: React.FC<PlateSummaryProps> = ({ selectedPlateType,parkingTime }) => (
    <div>
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
    </div>
);
