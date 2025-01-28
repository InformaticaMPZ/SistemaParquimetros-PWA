import { ParkingRate } from "@/types/parkingRate";
import { ParkingTime } from "@/types/parkingTime";
import { PlateType } from "@/types/plateType";
import { ParkingResponse } from "@/types/response";
import { create } from "zustand";
import CryptoJS from 'crypto-js';

interface StoreState {
  sessionId: string | null;
  parkingRateList: Array<ParkingRate>;
  plateTypeList: Array<PlateType>;
  fastPlateTypeList: Array<any>;
  parkingTime: ParkingTime;
  getStartSession: () => Promise<ParkingResponse>;
  getParkingRates: () => void;
  getParkingTime: () => Promise<ParkingResponse>;
  getPayment: (temporalId: string) => Promise<ParkingResponse>;
  setPayment: () => Promise<ParkingResponse>;
  getInfractions: () => Promise<ParkingResponse>;
  getPlateTypes: () => void;
  setParkingTime: (newParkingTime: Partial<ParkingTime>) => void;
  resetParkingTime: () => void;
  getClientIP: () => void;
  getActive: () => Promise<ParkingResponse>;
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
  subscription: "",
  ip: ""
};

const useParkingMetersStore = create<StoreState>((set, get) => ({
  parkingRateList: [],
  plateTypeList: [],
  fastPlateTypeList: [],
  parkingTime: { ...initialParkingTime },
  loading: false,
  sessionId: "",
  error: null,
  getParkingRates: async () => {
    const { sessionId } = get();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/parking-rate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Credential': sessionId || "",
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
      const { sessionId } = get();

      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/plate-type`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Credential": sessionId || ""
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch plate types");
      }

      const data = await response.json();
      const filterDescriptions = ["PARTICULARES", "MOTOCICLETAS", "CARGA LIVIANA", "PERMISOS DE TAXI"];
    
      const filteredPlateTypes = data.data.filter((plateType: { Description: string }) =>
        filterDescriptions.includes(plateType.Description)
      );

      set({ plateTypeList: data.data, loading: false, fastPlateTypeList: filteredPlateTypes });
    } catch (error) {
      set({ plateTypeList: [], error: (error as Error).message, loading: false });
    }
  },
  getParkingTime: async (): Promise<ParkingResponse> => {
    const { sessionId, parkingTime } = get();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/parking-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Credential': sessionId || ""
        },
        body: JSON.stringify(parkingTime),
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
    const { sessionId } = get();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/infraction?plateNumber=${currentParkingTime.plateNumber}&plateTypeId=${currentParkingTime.plateTypeId}&ticketNumber=${currentParkingTime.ticketNumber}&isToday=false`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Credential': sessionId || "",
        }
      });
      if (!response.ok) {
        throw new Error("Failed to post to get infraction");
      }

      const result = await response.json();
      console.log(result);
      

      set({ loading: false });
      return result;

    } catch (error) {
      console.log(error);
      
      set({ loading: false });
      return {
        success: false,
        message: (error as Error).message
      };
    }
  },
  getPayment: async (temporalId: string): Promise<ParkingResponse> => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/payment?temporalId=${temporalId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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
  setPayment: async (): Promise<ParkingResponse> => {
    
    set({ loading: true, error: null });
    const { sessionId, parkingTime } = get();
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Credential': sessionId || ""
        },
        body: JSON.stringify({
          ticket_number: parkingTime.ticketNumber,
          email: parkingTime.email,
          identification: parkingTime.id,
          ip: parkingTime.ip,
          phone: parkingTime.phone,
          name: parkingTime.name,
          last_name: parkingTime.lastName
        })
      });

      if (!response.ok) {
        throw new Error("Failed to post to set infraction");
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
  getStartSession: async (): Promise<ParkingResponse> => {

    set({ loading: true, error: null });
    try {
      const user = process.env.ODOO_USERNAME;
      const password = process.env.ODOO_PASSWORD;
      const encryptionKey = process.env.NEXT_PUBLIC_SESSION_KEY;

      if (!user || !password || !encryptionKey) {
        throw new Error("Environment variables not defined");
      }

      const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

      const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(encryptionKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      const encryptPassword = `${iv}:${encrypted}`;

      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, password: encryptPassword })
      });

      if (!response.ok) {
        throw new Error("Failed to post parking time");
      }

      const result = await response.json();

      set({ loading: false, sessionId: result.data.Login });

      return {
        success: result.success,
        message: "Session started",
        data: result.data.Login
      };

    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        message: (error as Error).message
      };
    }
  },
  getActive: async (): Promise<ParkingResponse> => {
    const { sessionId } = get();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_API_REQUEST}/api/v1/parameter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Credential': sessionId || ""
        },
        body: JSON.stringify({"parameterName":"parking_meters.Is_Active"}),
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
  }
}));

export default useParkingMetersStore;
