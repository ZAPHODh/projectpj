'use client';

import { createContext, useContext, useEffect, useState } from "react";



interface CustomerContextProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    error: string | null;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
}

interface CustomerProviderProps {
    children: React.ReactNode;
    initialCustomers?: Customer[];
}

const CustomerContext = createContext<CustomerContextProps | undefined>(undefined);

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
    children,
    initialCustomers = []
}) => {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [error, setError] = useState<string | null>(null);

    const handleApiError = (error: unknown, defaultMessage: string) => {
        const message = error instanceof Error ? error.message : defaultMessage;
        setError(message);
        console.error(message);
        return message;
    };

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Erro ao atualizar cliente");

            const { customer } = await res.json();
            setCustomers(prev => prev.map(c => (c.id === id ? customer : c)))
        } catch (err) {
            handleApiError(err, "Falha na atualização do cliente");
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao excluir cliente");

            setCustomers(prev => prev.filter(c => c.id !== id));
            setError(null);
        } catch (err) {
            handleApiError(err, "Falha na exclusão do cliente");
        }
    };

    return (
        <CustomerContext.Provider
            value={{
                customers,
                setCustomers,
                error,
                updateCustomer,
                deleteCustomer,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error("useCustomer deve ser usado dentro de um CustomerProvider");
    }
    return context;
};