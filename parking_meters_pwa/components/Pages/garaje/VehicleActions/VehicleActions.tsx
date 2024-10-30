import useParkingMetersStore from "@/store/useParkingMeters.store";
import { PlateInfo } from "@/types/plateInfo";

interface VehicleActionsProps {
    plateInfoRef: React.MutableRefObject<{ handleSubmitPlateInformation: () => boolean } | null>;
    plateInfo: PlateInfo[];
    setPlateInfo: React.Dispatch<React.SetStateAction<PlateInfo[]>>;
    parkingTime: any;
    plateTypeList: any[];
    setIsOpen: (value: boolean) => void;
}

export const VehicleActions = ({
    plateInfoRef,
    plateInfo,
    setPlateInfo,
    setIsOpen,
}: VehicleActionsProps) => {
    const { parkingTime, plateTypeList, setParkingTime } = useParkingMetersStore();

    const handleAddVehicle = () => {

        const submitSuccess = plateInfoRef.current?.handleSubmitPlateInformation();
        let storedPlateInfo = JSON.parse(localStorage.getItem("plateInfo") || "[]");
        if (submitSuccess) {
            const newVehicle = {
                plateNumber: parkingTime.plateNumber,
                plateType: plateTypeList.find((type) => type.id === parkingTime.plateTypeId),
                favorite: storedPlateInfo.length == 0,
            };

            const updatedPlateInfo = [...plateInfo, newVehicle];
            setPlateInfo(updatedPlateInfo);
            localStorage.setItem("plateInfo", JSON.stringify(updatedPlateInfo));
            setIsOpen(false);
            setParkingTime({
                plateTypeId: undefined,
                plateNumber: ""
            });
        }
    };

    const handleEditVehicle = (info: PlateInfo) => {
        const updatedPlateInfo = plateInfo.map((item) =>
            item.plateNumber === info.plateNumber && item.plateType?.id === info.plateType?.id
                ? { ...item, plateNumber: parkingTime.plateNumber, plateType: plateTypeList.find((type) => type.id === parkingTime.plateTypeId) }
                : item
        );

        setPlateInfo(updatedPlateInfo);
        localStorage.setItem("plateInfo", JSON.stringify(updatedPlateInfo));
        setIsOpen(false);
        setParkingTime({
            plateTypeId: undefined,
            plateNumber: ""
        });
    };

    const handleDeleteVehicle = (plateSelected: PlateInfo) => {
        const updatedPlateInfo = plateInfo.filter(
            (info) => info.plateNumber !== plateSelected.plateNumber || info.plateType?.id !== plateSelected.plateType?.id
        );
        const wasFavorite = plateSelected.favorite;
        if (wasFavorite) {
            const hasFavorite = updatedPlateInfo.some((info) => info.favorite);
            if (!hasFavorite && updatedPlateInfo.length > 0) {
                updatedPlateInfo[0].favorite = true;
            }
        }
        setPlateInfo(updatedPlateInfo);
        localStorage.setItem("plateInfo", JSON.stringify(updatedPlateInfo));
        setIsOpen(false);
    };

    return { handleAddVehicle, handleEditVehicle, handleDeleteVehicle };
};

export default VehicleActions;