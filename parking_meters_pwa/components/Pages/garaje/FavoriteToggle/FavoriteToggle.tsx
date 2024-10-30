import { FaCarSide, FaMotorcycle } from "react-icons/fa";

export const FavoriteToggle: React.FC<{ isFavorite?: boolean; onClick: () => void; isCar?: boolean }> = ({ isFavorite, onClick, isCar }) => {
    return (
        <span
            className="p-3"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            style={{
                cursor: 'pointer',
                transition: 'color 0.3s ease, opacity 0.3s ease',
                opacity: 0.9,
            }}
            onMouseEnter={(e: any) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e: any) => (e.currentTarget.style.opacity = 0.9)}
        >
            {isCar && isFavorite && (
                <FaCarSide
                    color="orange"
                    style={{ stroke: 'gray', strokeWidth: 15 }}
                    size={60}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'gold')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
                />
            )}

            {isCar && !isFavorite && (
                <FaCarSide
                    size={60}
                    color="gray"
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'lightgray')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
                />
            )}

            {!isCar && isFavorite && (
                <FaMotorcycle
                    color="orange"
                    style={{ stroke: 'gray', strokeWidth: 15 }}
                    size={60}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'gold')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
                />
            )}
            {!isCar && !isFavorite && (
                <FaMotorcycle
                    size={60}
                    color="gray"
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'lightgray')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
                />
            )}

        </span>

    );
};