import React, { createContext, useContext, useState, useEffect } from "react";

// Define the structure of the form data used across different pages
interface FormData {
    creditCard: string;
    points: number;
    destination: string;
    destinationType: string;
    departureCity: string;
    flightType: string;
    classType: string;
    departureDate: Date | null;
    returnDate: Date | null;
}

interface SearchContextProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const defaultFormData: FormData = {
    creditCard: "",
    points: 0,
    destination: "",
    destinationType: "city",
    departureCity: "",
    flightType: "economy",
    classType: "oneWay",
    departureDate: new Date(),
    returnDate: null,
};

// Create a context with default values
const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>(() => {
        // Retrieve saved data from local storage, if available
        const savedData = localStorage.getItem("formData");
        return savedData ? JSON.parse(savedData) : defaultFormData;
    });

    useEffect(() => {
        // Save formData to local storage whenever it changes
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    return <SearchContext.Provider value={{ formData, setFormData }}>{children}</SearchContext.Provider>;
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearchContext must be used within a SearchProvider");
    }
    return context;
};
