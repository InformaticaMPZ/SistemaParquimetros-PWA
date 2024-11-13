import { ParkingRate } from "@/types/parkingRate";
import { ParkingTime } from "@/types/parkingTime";
import { PlateType } from "@/types/plateType";
import { ParkingResponse } from "@/types/response";
import { create } from "zustand";
import CryptoJS from 'crypto-js';

interface StoreState {
  parkingRateList: Array<ParkingRate>;
  plateTypeList: Array<PlateType>;
  fastPlateTypeList: Array<any>;
  parkingTime: ParkingTime;
  getParkingRates: () => void;
  getParkingTime: () => Promise<ParkingResponse>;
  getInfractions: () => Promise<ParkingResponse>;
  getPlateTypes: () => void;
  getPushSubscription: (subscription: PushSubscription) => Promise<ParkingResponse>;
  setParkingTime: (newParkingTime: Partial<ParkingTime>) => void;
  resetParkingTime: () => void;
  loading: boolean;
  error: string | null;
}

const initialParkingTime: ParkingTime = {
  plateTypeId: 0,
  plateNumber: "",
  plateDetailId: 0,
  parkingRateId: [],
  startTime: new Date(),
  endTime: new Date(),
  email: "",
  phone: "",
  id: "",
  lastName: "",
  name: "",
  amount: 0,
  ticketNumber: ""
};

const useParkingMetersStore = create<StoreState>((set, get) => ({
  parkingRateList: [],
  plateTypeList: [],
  fastPlateTypeList: [],
  parkingTime: { ...initialParkingTime },
  loading: false,
  error: null,
  getParkingRates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/parking-rate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch parking rates");
      }

      const data = await response.json();
      set({ parkingRateList: data, loading: false });
    } catch (error) {
      set({ parkingRateList: [], error: (error as Error).message, loading: false });
    }
  },
  getPlateTypes: async () => {
    const { plateTypeList } = get();
    if (plateTypeList && plateTypeList.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/plate-type`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plate types");
      }

      const data = await response.json();
      const filterDescriptions = ["PARTICULARES", "MOTOCICLETAS", "CARGA LIVIANA", "PERMISOS DE TAXI"];

      const filteredPlateTypes = data.filter((plateType: { description: string }) =>
        filterDescriptions.includes(plateType.description)
      );

      set({ plateTypeList: data, loading: false, fastPlateTypeList: filteredPlateTypes });
    } catch (error) {
      set({ plateTypeList: [], error: (error as Error).message, loading: false });
    }
  },
  getParkingTime: async (): Promise<ParkingResponse> => {
    const currentParkingTime = get().parkingTime;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/parking-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentParkingTime),
      });

      if (!response.ok) {
        throw new Error("Failed to post parking time");
      }

      const result = await response.json();

      set({ loading: false });
      return JSON.parse(result.data);

    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: (error as Error).message
      };
    }
  },
  getInfractions: async (): Promise<ParkingResponse> => {
    const currentParkingTime = get().parkingTime;
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/infraction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentParkingTime),
      });

      if (!response.ok) {
        throw new Error("Failed to post to get infraction");
      }

      const result = await response.json();

      set({ loading: false });
      return result;

    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: (error as Error).message
      };
    }
  },
  setParkingTime: (newParkingTime: Partial<ParkingTime>) => {
    set((state) => ({
      parkingTime: { ...state.parkingTime, ...newParkingTime },
    }));
  },
  resetParkingTime: () => {
    set({ parkingTime: { ...initialParkingTime } });
  },
  getPushSubscription: async (subscription: PushSubscription): Promise<ParkingResponse> => {
    set({ loading: true, error: null });

    try {
      const encryptedSubscription = CryptoJS.AES.encrypt(
        JSON.stringify(subscription),
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string
      ).toString();

      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedSubscription }),
      });

      if (!response.ok) {
        throw new Error("Failed to post to get subscription");
      }

      const result = await response.json();

      set({ loading: false });
      return result;

    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: (error as Error).message
      };
    }
  },

}));

export default useParkingMetersStore;
