import { ModalNotification } from "components/General/ModalNotification";

import RateRow from "./RateRow";
import { formatAmount } from "@/utils/converter";
import { useTicketCounter } from "@/hooks/UseTicketCounter";

export const TicketCounter = ({ startDate }: { startDate: Date }) => {
    const {
        rateIds,
        parkingRateList,
        isModalOpen,
        countOccurrences,
        getTotalPrice,
        increment,
        decrement,
        closeModal
    } = useTicketCounter(startDate);

    return (
        <div>
            <div className="relative overflow-x-auto shadow-md rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tiempo</th>
                            <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parkingRateList.map(item => (
                            <RateRow
                                key={item.id}
                                item={item}
                                count={countOccurrences(rateIds, item.id)}
                                onIncrement={() => increment(item.id)}
                                onDecrement={() => decrement(item.id)}
                            />
                        ))}
                        <tr className="bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <td className="px-6 py-4 font-bold text-red-500 text-lg">Total</td>
                            <td className="px-6 py-4 font-bold text-red-500 text-lg text-center">
                                {formatAmount(getTotalPrice())}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ModalNotification
                title="¡Atención!"
                message={<div>No puedes agregar más tiempo ya que superaría la hora límite de las <strong>5 PM</strong>.</div>}
                notificationType="warning"
                cancelText="Cancel"
                isOpenModal={isModalOpen}
                closeModal={closeModal}
                showAprobeButton={false}
            />
        </div>
    );
};
