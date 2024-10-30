import React from "react";
import { FavoriteToggle } from "../FavoriteToggle";
import { IconType } from "react-icons";
import { FaUser, FaCog } from "react-icons/fa";

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
    Icon: IconType;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ label, Icon }) => (
    <button
        type="button"
        className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-600"
    >
        <Icon className="w-4 h-4 mr-2.5" aria-hidden="true" />
        {label}
    </button>
);

export const VehicleTable: React.FC<VehicleTableProps> = ({ plateInfo, searchTerm, handleFavoriteToggle, handleEditVehicle }) => {
    const filteredPlateInfo = plateInfo.filter((info) =>
        info.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-wrap gap-4">
            {filteredPlateInfo.length > 0 ? (
                filteredPlateInfo.map((info, index) => (
                    <div
                        key={index}
                        className="flex min-w-0 flex-grow text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-white"
                    >
                        {/* <FaMotorcycle  size={60} className="object-cover rounded-l-lg border" /> */}
                        <FavoriteToggle isFavorite={info.favorite} isCar={info.plateType?.description !== "MOTOCICLETAS"} onClick={() => handleFavoriteToggle(index)} />
                        <div className="flex flex-col flex-grow">
                            <div className="relative bg-gray-200 inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-600">Vehículo registrado</div>
                            <ButtonComponent label={`Placa: ${info.plateNumber}`} Icon={FaUser} />
                            <ButtonComponent label={`Tipo: ${info.plateType?.description}`} Icon={FaCog} />

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





// <div className="relative overflow-x-auto shadow-lg sm:rounded-lg m-5">
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//         <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
//             Datos de la Placa
//         </caption>
//         <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//                 <th scope="col" className="px-2 py-3 w-[65px]">Número</th>
//                 <th scope="col" className="px-2 py-3">Tipo</th>
//                 <th scope="col" className="px-2 py-3 w-[70px] text-center">Favorito</th>
//             </tr>
//         </thead>
//         <tbody>
//             {filteredPlateInfo.length > 0 ? (
//                 filteredPlateInfo.map((info, index) => (
//                     <tr key={index} onClick={() => handleEditVehicle(info)} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
//                         <td className="w-[65px] px-2 py-4 whitespace-nowrap">{info.plateNumber}</td>
//                         <td className="px-2 py-4">{info.plateType?.description}</td>
//                         <td className="px-2 py-4 text-center w-[70px]">
//                             <FavoriteToggle isFavorite={info.favorite} onClick={() => handleFavoriteToggle(index)} />
//                         </td>
//                     </tr>
//                 ))
//             ) : (
//                 <tr>
//                     <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                         No hay información de la placa disponible
//                     </td>
//                 </tr>
//             )}
//         </tbody>
//     </table>
// </div>