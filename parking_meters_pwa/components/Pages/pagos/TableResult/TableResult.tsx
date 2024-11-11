
import React from 'react';
import { FaAngleDown, FaAngleUp, FaCheckCircle, FaRegArrowAltCircleRight } from 'react-icons/fa';
import { borderStatePending, borderstateSuccess, headerTablePayments } from '@/utils/constData';
import { formatAmount } from '@/utils/converter';
import { CustomCard } from 'components/General/CustomCard';

interface TableResultProps {
    infractionList: Array<any>;
    activeRow: number | null;
    setActiveRow: (index: number | null) => void;
}

export const TableResult: React.FC<TableResultProps> = ({ infractionList, activeRow, setActiveRow }) => {
    return (
        <CustomCard title='Resultados de la Búsqueda' classNameCard='mb-4'>
            <div className="relative overflow-x-auto shadow-md rounded-b-xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {headerTablePayments.map((title, index) => (
                                <th
                                    scope="col"
                                    key={index}
                                    className={`px-6 py-3 dark:text-white ${index !== 0 && index !== headerTablePayments.length - 1 ? 'hidden md:table-cell' : ''}`}
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {infractionList && infractionList.length > 0 ? (
                            infractionList.map((row, index) => (
                                <React.Fragment key={index}>
                                    <tr
                                        className={`border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${row.infraction_state_id[1] === 'PENDIENTE' ? borderStatePending : borderstateSuccess}`}
                                        onClick={() => setActiveRow(activeRow === index ? null : index)}
                                    >
                                        <td className="px-6 py-4 dark:text-white">
                                            <div className='flex items-center'>
                                                <div className="md:hidden ms-[-19px]">
                                                    {activeRow === index ? (
                                                        <FaAngleUp className="mr-1" />
                                                    ) : (
                                                        <FaAngleDown className="mr-1" />
                                                    )}
                                                </div>
                                                <span>{row.plate_type_id[1] + '-' + row.plate_number}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4">{row.ticket_number}</td>
                                        <td className="hidden md:table-cell px-6 py-4">{row.registration_date}</td>
                                        <td className="hidden md:table-cell px-6 py-4">{formatAmount(parseFloat(row.infraction_price_id[1]) + row.surcharge)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-between">
                                                {row.infraction_state_id[1] === 'PENDIENTE' ? (
                                                    <button
                                                        type="button"
                                                        className='w-full flex flex-row p-3 justify-center items-center focus:outline-none text-white bg-red-700 hover:bg-red-500 focus:ring-4 focus:ring-red-300 font-medium rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                                                    >
                                                        <p className='mr-1'>{'PAGAR'}</p>
                                                        <FaRegArrowAltCircleRight className='ms-1' size={20} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className='w-full flex flex-row p-2 justify-center items-center text-green-700 border border-green-700 font-medium rounded-lg text-center dark:border-green-500 dark:text-green-500'
                                                    >
                                                        <p className='mr-1'>{row.infraction_state_id[1]}</p>
                                                        <FaCheckCircle className='ms-1' size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {activeRow === index && (
                                        <tr className={`md:hidden table-row bg-gray-50 dark:text-white dark:bg-gray-700 ${row.infraction_state_id[1] === 'PENDIENTE' ? borderStatePending : borderstateSuccess}`}>
                                            <td colSpan={6}>
                                                <div className="px-6 py-4">
                                                    <div><strong>Boleta:</strong> {row.ticket_number}</div>
                                                    <div><strong>Fecha:</strong> {row.registration_date}</div>
                                                    <div><strong>Monto:</strong> {formatAmount(parseFloat(row.infraction_price_id[1]) + row.surcharge)}</div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center p-2 py-4 dark:text-white">
                                    No hay registros
                                </td>
                            </tr>

                        )}
                    </tbody>

                </table>
            </div>

        </CustomCard>
    );
};
