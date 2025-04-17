"use client";

import { createContext, useContext, useEffect, useState } from "react";


interface ComissionRuleContextProps {
    comissionRules: CommissionRule[];
    setComissionRules: React.Dispatch<React.SetStateAction<CommissionRule[]>>;
    loading: boolean;
    error: string | null;
}

export const ComissionRuleContext = createContext<
    ComissionRuleContextProps | undefined
>(undefined);

export const ComissionRuleProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [comissionRules, setComissionRules] = useState<CommissionRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComissionRules = async () => {
            try {
                const response = await fetch("/api/comission-rules");
                if (!response.ok) throw new Error("Erro ao buscar regras de comissão.");

                const data = await response.json();
                setComissionRules(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        fetchComissionRules();
    }, []);

    return (
        <ComissionRuleContext.Provider
            value={{ comissionRules, setComissionRules, loading, error }}
        >
            {children}
        </ComissionRuleContext.Provider>
    );
};

export const useComissionRule = () => {
    const context = useContext(ComissionRuleContext);
    if (!context) {
        throw new Error(
            "useComissionRule deve ser usado dentro de um ComissionRuleProvider"
        );
    }
    return context;
};
