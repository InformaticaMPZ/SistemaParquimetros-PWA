import React from "react";
import { PlateInformation } from "components/General/PlateInformation";
import { FaRegSave, FaRegTrashAlt, FaTimes } from "react-icons/fa";
import { PlateInfo } from "@/types/plateInfo";
import { CustomButton } from "components/General/CustomButton";

interface VehicleFormModalProps {
    isOpen: boolean;
    plateSelected: any;
    handleAddVehicle: () => void;
    handleDeleteVehicle: () => void;
    handleEditVehicle: (info: PlateInfo) => void;
    setIsOpen: (isOpen: boolean) => void;
    plateInfoRef: React.RefObject<{ handleSubmitPlateInformation: () => boolean }>;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
    isOpen,
    plateSelected,
    handleAddVehicle,
    handleDeleteVehicle,
    handleEditVehicle,
    setIsOpen,
    plateInfoRef,
}) => {
    const setVehicule = () => {
        if (plateSelected) {
            handleEditVehicle(plateSelected)
        }
        else {
            handleAddVehicle()
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-400 bg-opacity-95">
            <div className="relative w-full max-w-7xl max-h-full">
                <div className="relative bg-white rounded-xl shadow dark:bg-gray-700">
                    <CustomButton
                        color='gray'
                        onClick={() => setIsOpen(false)}
                        Icon={FaTimes}
                        className="absolute top-3 right-2.5 px-0 py-0 me-0 mb-0 mt-2"
                        iconClassName="m-1"
                    />
                    <div className="pb-1">
                        <PlateInformation
                            ref={plateInfoRef}
                            isCard={true}
                            descriptionPlate={plateSelected?.plateType?.description || ""}
                            plateSelected={plateSelected?.plateNumber || ""}
                        />
                        <div className="px-2 pt-4 pb-1 flex items-center justify-end">
                            <CustomButton
                                actionButton='Guardar'
                                color='green'
                                onClick={setVehicule}
                                Icon={FaRegSave}
                            />

                            {plateSelected && (
                                <CustomButton
                                    actionButton='Eliminar'
                                    color='red'
                                    onClick={handleDeleteVehicle}
                                    Icon={FaRegTrashAlt}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default VehicleFormModal;