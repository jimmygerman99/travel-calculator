import React, { createContext, useContext, useState } from "react";
import { FormData } from "../interfaces/FormDataTypes";

export interface FormDataContextType {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void; // Ensure this is part of the type
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const FormDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>({
        creditCard: "",
        points: 0,
        destination: "",
        destinationType: "",
        departureCity: "",
        departureDate: new Date(),
        departureAirport: "",
        returnDate: null,
        flightType: "",
        classType: "",
    });

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prevData) => ({
            ...prevData,
            ...data, // Merge new data with existing form data
        }));
    };

    return <FormDataContext.Provider value={{ formData, updateFormData }}>{children}</FormDataContext.Provider>;
};

export const useFormData = () => {
    const context = useContext(FormDataContext);
    if (!context) {
        throw new Error("useFormData must be used within a FormDataProvider");
    }
    return context;
};
