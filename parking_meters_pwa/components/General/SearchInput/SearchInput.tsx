import React from "react";
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="relative flex justify-end my-2 mr-2">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch />
            </div>
            <input
                type="text"
                className="block p-2 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-[35%] bg-gray-50"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};
