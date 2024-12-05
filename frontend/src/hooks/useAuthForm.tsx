import { useState } from "react";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const useAuthForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const signIn = useSignIn();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                const success = signIn({
                    auth: {
                        token: response.data.access_token,
                        type: "Bearer",
                    },
                    userState: { email: formData.email },
                });

                if (!success) {
                    setErrorMessage("Login failed. Please try again.");
                } else {
                    alert("Login successful!");
                }
            }
        } catch (error: any) {
            const errorDetail = error.response?.data?.detail || "Invalid credentials. Please try again.";
            setErrorMessage(errorDetail);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        showPassword,
        togglePasswordVisibility,
        isLoading,
        errorMessage,
        formData,
        handleChange,
        handleSubmit,
    };
};

export default useAuthForm;
