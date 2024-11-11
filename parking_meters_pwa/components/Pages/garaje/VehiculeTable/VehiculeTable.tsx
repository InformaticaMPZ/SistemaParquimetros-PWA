import React from "react";
import { FavoriteToggle } from "../FavoriteToggle";
import { IconType } from "react-icons";
import { FaRegListAlt, FaRegFilePowerpoint } from "react-icons/fa";

interface PlateInfo {
    plateNumber: string;
    plateType?: {
        description: string;
        id: number;
    };
    favorite?: boolean;
}

interface VehicleTableProps {
    plateInfo: Array<PlateInfo>;
    searchTerm: string;
    handleFavoriteToggle: (index: number) => void;
    handleEditVehicle: (plateSelected: any) => void;
}

interface ButtonComponentProps {
    label: string;
    text: string;
    Icon: IconType;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ label, text, Icon }) => (
    <button
        type="button"
        className="relative inline-flex items-start w-full px-4 py-2"
    >
        <Icon className="w-4 h-5 mr-2.5 flex-shrink-0" aria-hidden="true" />
        <div className="flex items-start w-full justify-start space-x-2">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm font-normal flex-grow text-left">{text}</p>
        </div>
    </button>
);


export const VehicleTable: React.FC<VehicleTableProps> = ({ plateInfo, searchTerm, handleFavoriteToggle, handleEditVehicle }) => {
    const filteredPlateInfo = plateInfo.filter((info) =>
        info.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-wrap gap-4 mx-4 mb-4">
            {filteredPlateInfo.length > 0 ? (
                filteredPlateInfo.map((info, index) => (
                    <div
                        onClick={() => handleEditVehicle(info)}
                        key={index}
                        className="flex min-w-0 flex-grow text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-200 dark:text-white hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-white"
                    >
                        <div className="border-r border-gray-300 rounded-s-lg px-2 mt-auto mb-auto h-full flex justify-center items-center ">
                            <FavoriteToggle
                                isFavorite={info.favorite}
                                isCar={info.plateType?.description !== "MOTOCICLETAS" && info.plateType?.description !== "BICIMOTOS"}
                                onClick={() => handleFavoriteToggle(index)}
                            />
                        </div>

                        <div className="flex flex-col flex-grow ">
                            <div className="relative bg-gray-200 inline-flex items-center w-full px-4 py-2 rounded-tr-lg text-lg font-medium border-b border-gray-300 dark:bg-gray-600 dark:border-gray-400">Vehículo Registrado</div>
                            <ButtonComponent label={"Placa:"} text={`${info.plateNumber}`} Icon={FaRegFilePowerpoint} />
                            <hr />
                            <ButtonComponent label={"Tipo:"} text={`${info.plateType?.description}`} Icon={FaRegListAlt} />

                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No hay información de la placa disponible.</p>
            )}
        </div>



    );
};

export default VehicleTable;