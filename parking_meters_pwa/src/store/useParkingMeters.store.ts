import { ParkingRate } from "@/types/parkingRate";
import { ParkingTime } from "@/types/parkingTime";
import { PlateType } from "@/types/plateType";
import { ParkingResponse } from "@/types/response";
import { create } from "zustand";

interface StoreState {
  parkingRateList: Array<ParkingRate>;
  plateTypeList: Array<PlateType>;
  fastPlateTypeList: Array<any>;
  parkingTime: ParkingTime;
  getParkingRates: () => void;
  getParkingTime: () => Promise<ParkingResponse>;
  getPayment: (temporalId:string) => Promise<ParkingResponse>;
  getInfractions: () => Promise<ParkingResponse>;
  getPlateTypes: () => void;
  setParkingTime: (newParkingTime: Partial<ParkingTime>) => void;
  resetParkingTime: () => void;
  getClientIP : () => void;
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
  ticketNumber: "",
  subscription:"",
  ip:""
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
     
      set({ parkingRateList: data.data, loading: false });
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
      let jsonData = JSON.parse(data.data);
    
      const filteredPlateTypes = jsonData.data.filter((plateType: { description: string }) =>
        filterDescriptions.includes(plateType.description)
      );

      set({ plateTypeList: jsonData.data, loading: false, fastPlateTypeList: filteredPlateTypes });
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
      return JSON.parse(JSON.stringify(result));

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
  getPayment: async (temporalId:string): Promise<ParkingResponse> => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"temporalId":temporalId}),
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
  getClientIP: async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      set((state) => ({
        parkingTime: { ...state.parkingTime, ip: data.ip },
      }));
    } catch (error) {
      console.error('Error fetching IP:', error);
    }
  },
}));

export default useParkingMetersStore;
