'use server';

import { ComissionRuleProvider } from "@/components/providers/comission-rule";
import { toast } from "sonner";

export default async function Layout(props: { children: React.ReactNode }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`)
    if (!res.ok) {
        toast("Houve um erro ao entrar em contato com o back end", {
            description: "Server não respondeu"
        })
    }
    return (
        <ComissionRuleProvider>{props.children}</ComissionRuleProvider>
    )
}