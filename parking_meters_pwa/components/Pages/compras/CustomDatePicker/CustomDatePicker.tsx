'use client';
import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { format } from 'date-fns';

interface CustomDatePickerProps {
    startDate: Date;
    onChangeDate: (date: Date) => void;
}

export const CustomDatePicker = ({ startDate, onChangeDate }: CustomDatePickerProps) => {
    const [isClient, setIsClient] = useState(false);
    const [isOpenDate, setIsOpenDate] = useState(false);

    useEffect(() => {
        setIsClient(true);
        registerLocale('es', es);
    }, []);

    const handleClickDate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpenDate(!isOpenDate);
    };

    const handleChangeDate = (date: Date | null) => {
        if (date) {
            onChangeDate(date);
            setIsOpenDate(false);
        }
    };

    return (
        <div>
            {isClient && (
                <div className="pw-1 pt-2">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha
                        </label>
                        <button
                            className="bg-blue-50 text-left border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onClick={handleClickDate}
                        >
                            {format(startDate, 'dd/MM/yyyy')}
                        </button>
                        {isOpenDate && (
                            <div className="flex justify-center mt-2">
                                <DatePicker
                                    selected={startDate}
                                    locale="es"
                                    placeholderText="Selecciona una fecha"
                                    minDate={new Date()}
                                    todayButton="Hoy"
                                    dateFormat="dd/MM/yyyy"
                                    onChange={handleChangeDate}
                                    inline
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
