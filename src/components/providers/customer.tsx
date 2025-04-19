"use client";

import { createContext, useContext, useEffect, useState } from "react";


interface CustomerContextProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    loading: boolean;
    error: string | null;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    refreshCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextProps | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/customers");
            if (!res.ok) throw new Error("Erro ao buscar clientes.");

            const data = await res.json();
            setCustomers(data.customers);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const updateCustomer = async (id: string, updates: Partial<Customer>) => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Erro ao atualizar cliente.");

            const updated = await res.json();
            setCustomers(prev =>
                prev.map(c => (c.id === id ? updated.customers : c))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCustomer = async (id: string) => {
        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao deletar cliente.");

            setCustomers(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const refreshCustomers = async () => {
        setLoading(true);
        await fetchCustomers();
    };

    return (
        <CustomerContext.Provider
            value={{
                customers,
                setCustomers,
                loading,
                error,
                updateCustomer,
                deleteCustomer,
                refreshCustomers,
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
