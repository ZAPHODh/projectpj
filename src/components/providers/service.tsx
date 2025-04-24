"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ServiceContextProps {
    services: Service[];
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
    loading: boolean;
    error: string | null;
    updateService: (id: string, updates: Partial<Service>) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
    refreshServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextProps | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            if (!res.ok) throw new Error("Erro ao buscar serviços.");

            const data = await res.json();
            setServices(data.services);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const updateService = async (id: string, updates: Partial<Service>) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            if (!res.ok) throw new Error("Erro ao atualizar serviço.");

            const updated = await res.json();
            setServices(prev =>
                prev.map(s => (s.id === id ? updated.service : s))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const deleteService = async (id: string) => {
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Erro ao deletar serviço.");

            setServices(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const refreshServices = async () => {
        setLoading(true);
        await fetchServices();
    };

    return (
        <ServiceContext.Provider
            value={{
                services,
                setServices,
                loading,
                error,
                updateService,
                deleteService,
                refreshServices,
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useService deve ser usado dentro de um ServiceProvider");
    }
    return context;
};