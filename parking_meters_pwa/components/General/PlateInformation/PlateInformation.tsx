'use client';

import { SearchList } from '../SearchList';
import useParkingMetersStore from "@/store/useParkingMeters.store";
import { PlateInformationSchema } from './PlateInformationSchema';
import { CustomCard } from 'components/General/CustomCard';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Loading from '../LoadingForm/LoadingForm';


interface PlateInformationProps {
    plateSelected?: string;
    descriptionPlate?: string;
    readOnly?: boolean;
    isCard?: boolean;
}

export const PlateInformation = forwardRef(({ plateSelected, descriptionPlate, readOnly = false, isCard }: PlateInformationProps, ref) => {
    const { plateTypeList, getPlateTypes, setParkingTime, fastPlateTypeList, loading } = useParkingMetersStore();
    const [selectedPlateType, setSelectedPlateType] = useState<any>(null);
    const [newKey, setNewKey] = useState('');
    const [plateDescription, setPlateDescription] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    useEffect(() => {
        if (plateTypeList.length == 0 && selectedPlateType == null) {
            getPlateTypes();
        } else {
            if (plateSelected && plateNumber === "") {
                setPlateNumber(plateSelected);
                setParkingTime({
                    plateNumber: plateSelected
                });
            }
            if (descriptionPlate) {
                setPlateDescription(descriptionPlate);

                let searchPlateType = plateTypeList.find((plate) => plate.description === descriptionPlate);
                setSelectedPlateType(searchPlateType);
                setParkingTime({
                    plateTypeId: searchPlateType?.id
                });

            }
        }
    }, [plateSelected, descriptionPlate, plateTypeList]);

    const handleSelectPlateType = (item: any) => {
        setSelectedPlateType(item);
        setParkingTime({
            plateTypeId: item ? item.id : 0
        });
    };

    const handleClearType = () => {
        setSelectedPlateType(null);
    }

    const handledPlateNumber = (value: any) => {
        setPlateNumber(value.target.value);
        setParkingTime({
            plateNumber: value.target.value,
        });
    }

    const handleSubmitPlateInformation = () => {
        const formData = {
            vehiclePlate: plateNumber,
            plateType: selectedPlateType
        };

        if (descriptionPlate && selectedPlateType == null) {
            let searchPlateType = plateTypeList.find((plate:any) => plate.Description === descriptionPlate);
            formData.plateType = searchPlateType;
        }

        const validation = PlateInformationSchema.safeParse(formData);

        if (!validation.success) {
            const formattedErrors: { [key: string]: string } = {};
            validation.error.issues.forEach(issue => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return false;
        }
        setParkingTime({
            plateTypeId: formData.plateType.Id,
            plateNumber: formData.vehiclePlate
        });
        setSelectedPlateType(null);
        setNewKey(Math.random().toString());
        setErrors({});
        return true;
    };

    useImperativeHandle(ref, () => ({
        handleSubmitPlateInformation,
    }));

    const renderFormContent = () => {
        return readOnly ? (
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Placa del Vehículo
                        </label>
                        <input
                            value={plateNumber}
                            type="text"
                            id="placa"
                            name="placa"
                            className="bg-blue-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de Placa
                        </label>
                        <input
                            value={plateDescription}
                            type="text"
                            id="tipoPlaca"
                            name="tipoPlaca"
                            className="bg-blue-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Placa del Vehículo
                    </label>
                    <input
                        onChange={handledPlateNumber}
                        value={plateNumber}
                        type="text"
                        id="placa"
                        name="placa"
                        className="bg-blue-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="AAA123"
                    />
                    {errors.vehiclePlate && <p className="text-red-500 text-sm">{errors.vehiclePlate}</p>}
                </div>
                <div>
                    <SearchList
                        key={newKey}
                        filtered={plateDescription}
                        items={plateTypeList}
                        filterLabel="Description"
                        label="Tipo de Placa"
                        onSelect={handleSelectPlateType}
                        onClear={handleClearType}
                    />
                    <div className="rounded-md mt-2">
                        {fastPlateTypeList.map((type) => (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => {
                                    setPlateDescription(type.Description);
                                }}
                                className="inline-flex items-center mr-1 px-1 py-1 text-[10px] font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
                            >
                                <FaStar color="orange" style={{ stroke: 'gray', strokeWidth: 50, marginRight: 3 }} />
                                {type.Description}
                            </button>
                        ))}
                    </div>
                    {errors.plateType && <p className="text-red-500 text-sm">{errors.plateType}</p>}
                </div>
            </div>
        );
    };

    return (
        <div>
            {isCard ? (
                <CustomCard title="Información de la Placa" className="p-4">
                    {renderFormContent()}
                </CustomCard>
            ) : (
                <div>
                    {renderFormContent()}
                </div>
            )}
            {loading && <Loading />}
        </div>
    );



});

PlateInformation.displayName = "PlateInformation";