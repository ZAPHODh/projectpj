import { CustomerProvider } from "@/components/providers/customer";
import { getServerSession } from "@/lib/auth/server-session";


export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const session = await getServerSession()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customers`, {
        headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()
    return (
        <CustomerProvider initialCustomers={data.customers}>
            {children}
        </CustomerProvider>
    )
}