import { useEffect, useState } from "react";
import useParkingMetersStore from "@/store/useParkingMeters.store";
import { calculateEndTime, getTimeRemaining } from "@/utils/converter";

export const useTicketCounter = (startDate: Date) => {
  const { setParkingTime, parkingRateList } = useParkingMetersStore();
  const [rateIds, setRateIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const countOccurrences = (rateIds: number[], newId: number) => {
    return rateIds.filter(rateId => rateId === newId).length;
  };

  const getTotalHours = () => {
    return rateIds.reduce((total, id) => {
      const rate = parkingRateList.find(item => item.id === id);
      return total + (rate ? rate.hours : 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return rateIds.reduce((total, id) => {
      const rate = parkingRateList.find(item => item.id === id);
      return total + (rate ? rate.price : 0);
    }, 0);
  };

  useEffect(() => {
    const price = getTotalPrice();
    const currentParkingTime = useParkingMetersStore.getState().parkingTime;
    if (currentParkingTime.amount !== price) {
      setParkingTime({
        ...currentParkingTime,
        amount: price
      });
    }
  }, [rateIds]);

  const increment = (newId: number) => {
    const rateItem = parkingRateList.find(item => item.id === newId);
    if (!rateItem) return;
    
    const newTotalHours = getTotalHours() + rateItem.hours;
    const remainingHours = getTimeRemaining();

    if (remainingHours > 0 && newTotalHours <= remainingHours) {
      setRateIds(prevIds => {
        const updatedRateIds = [...prevIds, newId];
        const endTime = calculateEndTime(newTotalHours, startDate);
        setParkingTime({
          parkingRateId: updatedRateIds,
          endTime: endTime
        });
        return updatedRateIds;
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const decrement = (idToRemove: number) => {
    setRateIds(prevIds => {
      const index = prevIds.indexOf(idToRemove);
      const newRateIds = index !== -1
        ? [...prevIds.slice(0, index), ...prevIds.slice(index + 1)]
        : prevIds;
        
      const newTotalHours = getTotalHours() - (parkingRateList.find(item => item.id === idToRemove)?.hours || 0);
      const endTime = calculateEndTime(newTotalHours, startDate);
      setParkingTime({ parkingRateId: newRateIds, endTime: endTime });
      
      return newRateIds;
    });
  };

  return {
    rateIds,
    parkingRateList,
    isModalOpen,
    countOccurrences,
    getTotalPrice,
    increment,
    decrement,
    closeModal,
  };
};
