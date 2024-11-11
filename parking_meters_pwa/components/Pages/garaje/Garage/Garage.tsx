import { useRef, useState } from "react";
import { CustomCard } from "components/General/CustomCard";
import { SearchInput } from "components/General/SearchInput";
import { VehicleTable } from "../VehiculeTable/VehiculeTable";
import { VehicleFormModal } from "../VehiculeFormModal";
import useParkingMetersStore from "@/store/useParkingMeters.store";
import { PlateInfo } from "@/types/plateInfo";
import { useLocalStorageEffect } from "@/hooks/useLocalStorageEffect";
import { CustomButton } from "components/General/CustomButton";
import { VehicleActions } from "../VehicleActions";


export const Garage = () => {
    const [plateInfo, setPlateInfo] = useLocalStorageEffect("plateInfo", []);
    const { parkingTime, plateTypeList } = useParkingMetersStore();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [plateSelected, setPlateSelected] = useState<PlateInfo | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const plateInfoRef = useRef<{ handleSubmitPlateInformation: () => boolean }>(null);

    const { handleAddVehicle, handleEditVehicle, handleDeleteVehicle } = VehicleActions({
        plateInfoRef,
        plateInfo,
        setPlateInfo,
        parkingTime,
        plateTypeList,
        setIsOpen,
    });

    const handleFavoriteToggle = (index: number) => {
        const updatedPlateInfo = plateInfo.map((item: { favorite: boolean; }, i: number) =>
            i === index ? { ...item, favorite: !item.favorite } : { ...item, favorite: false }
        );
        setPlateInfo(updatedPlateInfo);
        localStorage.setItem("plateInfo", JSON.stringify(updatedPlateInfo));
    };

    return (
        <CustomCard title="Mi Garaje">

            <div className="w-full flex items-center justify-between my-5">
                <CustomButton color="blue" actionButton="Nuevo" onClick={() => setIsOpen(true)} className="px-6 py-2.5 me-2 ms-4" />
                <SearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>
            <hr />
            <p className="mt-1 ms-4 text-red-600 text-sm">Haga clic en el ícono del vehículo para marcarlo como su favorito</p>

            <hr className="mb-4 mt-2" />
            <VehicleTable
                plateInfo={plateInfo}
                searchTerm={searchTerm}
                handleFavoriteToggle={handleFavoriteToggle}
                handleEditVehicle={(info) => {
                    setPlateSelected(info);
                    setIsOpen(true);
                }}
            />

            <VehicleFormModal
                isOpen={isOpen}
                plateSelected={plateSelected}
                setPlateSelected={setPlateSelected}
                handleAddVehicle={handleAddVehicle}
                handleEditVehicle={handleEditVehicle}
                handleDeleteVehicle={() => handleDeleteVehicle(plateSelected!)}
                setIsOpen={setIsOpen}
                plateInfoRef={plateInfoRef}
            />
        </CustomCard>
    );
};
