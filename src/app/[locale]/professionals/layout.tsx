'use server';


import { ProfessionalProvider } from "@/components/providers/professional";

import { getServerSession } from "@/lib/auth/server-session";

import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function Layout(props: { children: React.ReactNode }) {
    const session = await getServerSession()
    if (!session) redirect('/auth/signin')
    const [professionalsResponse, commissionRulesResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/professionals`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
            },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/commission-rules`, {
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json',
            },
        })
    ]);

    if (!professionalsResponse.ok || !commissionRulesResponse.ok) {
        //error handling
    }
    const [professionalsData, commissionRulesData] = await Promise.all([
        professionalsResponse.json(),
        commissionRulesResponse.json()
    ]);

    return (
        <ProfessionalProvider initialCommissionRules={commissionRulesData} initialProfessionals={professionalsData}>{props.children}</ProfessionalProvider>
    )
}