'use server';

import { CustomerProvider } from "@/components/providers/customer";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "@/lib/auth/server-session";
import { getLocale } from "next-intl/server";


export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession()
    const locale = await getLocale()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) redirect({ href: '/account', locale })
    const data = await res.json()
    return (
        <CustomerProvider initialCustomers={data.customers}>
            {children}
        </CustomerProvider>
    )
}