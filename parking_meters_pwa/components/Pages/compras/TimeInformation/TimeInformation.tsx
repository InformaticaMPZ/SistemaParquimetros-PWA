'use client';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale/es';
import { endOfDay, setHours, setMinutes, startOfDay, isAfter } from 'date-fns';
import useParkingMetersStore from '@/store/useParkingMeters.store';
import { TimeInformationSchema } from './TimeInformationSchema';
import { CustomCard } from 'components/General/CustomCard';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Loading from 'components/General/LoadingForm/LoadingForm';
import { CustomDatePicker } from '../CustomDatePicker';
import { CustomTimePicker } from '../CustomTimePicker';
import { TicketCounter } from '../TicketCounter';

const roundToNextFiveMinutes = (date: Date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 10) * 10;
    return setMinutes(date, roundedMinutes);
};

export const TimeInformation = forwardRef((_, ref) => {
    registerLocale('es', es);

    const [startDate, setStartDate] = useState(roundToNextFiveMinutes(new Date()));
    const { setParkingTime, loading, parkingTime, getParkingRates } = useParkingMetersStore();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    let toDay = new Date();
    const [minTime, setMinTime] = useState(setHours(setMinutes(startOfDay(toDay), (roundToNextFiveMinutes(toDay).getMinutes() - 5)), toDay.getHours() > 7 ? toDay.getHours() : 7));
    const [maxTime, setMaxTime] = useState(setHours(setMinutes(endOfDay(toDay), 0), 17));

    const handleSubmitTimeInformation = () => {
        const formData = {
            startDate,
            startTime: startDate,
            parkingRateId: parkingTime.parkingRateId,
        };

        const validation = TimeInformationSchema.safeParse(formData);

        if (!validation.success) {
            const formattedErrors: { [key: string]: string } = {};
            validation.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return false;
        }

        setParkingTime({
            startTime: startDate
        });

        setErrors({});
        return true;
    };

    useEffect(() => {
        getParkingRates();
    }, []);


    useImperativeHandle(ref, () => ({
        handleSubmitTimeInformation,
    }));

    const handleSubmitDate = (date: Date) => {
        setStartDate(date);

        const onlyDate = startOfDay(date);
        const todayOnlyDate = startOfDay(toDay);

        if (isAfter(onlyDate, todayOnlyDate)) {
            setMinTime(setHours(setMinutes(endOfDay(toDay), 0), 7));
        } else {
            setMinTime(setHours(setMinutes(startOfDay(toDay), (roundToNextFiveMinutes(toDay).getMinutes() - 5)), toDay.getHours() > 7 ? toDay.getHours() : 7));
        }
    };
    return (

        <div>
            <CustomCard title='Selección de Tiempo' classNameCard='mt-5' className='p-4'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full'>
                    <div>
                        <CustomDatePicker startDate={startDate} onChangeDate={handleSubmitDate} />
                    </div>
                    <div>
                        <CustomTimePicker
                            selectedTime={startDate}
                            minTime={minTime}
                            maxTime={maxTime}
                            label='Hora de Inicio'
                            onChangeTime={setStartDate}
                        />
                        {errors.startDate && <p className='text-red-500 text-sm'>{errors.startDate}</p>}
                    </div>

                </div>
                <TicketCounter startDate={startDate} />
                <div className='pt-4 mb-2'>
                    {errors.parkingRateId && <p className='text-red-500 text-sm'>{errors.parkingRateId}</p>}
                </div>

            </CustomCard>

            {loading && <Loading />}
        </div>
    );
});

TimeInformation.displayName = 'TimeInformation';
