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
            <SearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <VehicleTable
                plateInfo={plateInfo}
                searchTerm={searchTerm}
                handleFavoriteToggle={handleFavoriteToggle}
                handleEditVehicle={(info) => {
                    setPlateSelected(info);
                    setIsOpen(true);
                }}
            />

            <div className="w-full flex justify-end pr-4 mb-5">
                <CustomButton color="blue" actionButton="Nuevo" onClick={() => setIsOpen(true)} />
            </div>


            <VehicleFormModal
                isOpen={isOpen}
                plateSelected={plateSelected}
                handleAddVehicle={handleAddVehicle}
                handleEditVehicle={handleEditVehicle}
                handleDeleteVehicle={() => handleDeleteVehicle(plateSelected!)}
                setIsOpen={setIsOpen}
                plateInfoRef={plateInfoRef}
            />
        </CustomCard>
    );
};
