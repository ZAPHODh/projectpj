'use client';

import { DisplayAdUnit, InArticleAd } from "@/components/ad-unit";
import { getCustomerColumns } from "@/components/customers/column";
import { CustomerDialog } from "@/components/customers/dialog";
import { CustomerProvider } from "@/components/providers/customer";
import { useSession } from "@/components/providers/session";
import { DataTable } from "@/components/ui/data-table/table";
import { createCustomerSchema, defaultCustomerValues, GetCustomerConfig } from "@/schemas/customers";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";


const customerMock: Customer = {
    id: "c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5r6",
    name: "João Souza",
    city: "São Paulo",
    address: "Rua Exemplo, 123",
    genre: "male",
    phone: "(11) 91234-5678",
    email: "joao.souza@exemplo.com",
    birthDay: new Date("1990-01-01"),
    salonId: "s1a2b3c4-d5e6-f7g8-h9i0",
    appointments: [],
    services: []
    ,
};

export default function CustomerPage() {
    const { session } = useSession()
    const { push } = useRouter()
    if (!session) push('/auth/signin')
    const [selectedRowData, setSelectedRowData] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const locale = useLocale();
    const messages = useMessages();
    const t = useTranslations('customer.page');

    return (
        <CustomerProvider initialCustomers={[]}>
            <div className="space-y-6 container mx-auto">
                <div className="p-4">
                    <h3 className="text-lg font-medium">{t('title')}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t('description')}
                    </p>
                </div>
                {/* <DisplayAdUnit format="horizontal" /> */}
                <DataTable
                    data={[customerMock]}
                    columns={getCustomerColumns(locale, messages)}
                    exportTo
                    newItem={{
                        defaultValues: defaultCustomerValues,
                        fieldConfig: GetCustomerConfig(locale, messages),
                        schema: createCustomerSchema,
                    }}
                    onNewItem={() => {
                        // Lógica para criar um novo customer
                    }}
                    imports
                    handleRowClick={(row) => {
                        setSelectedRowData(row);
                        setIsDialogOpen(true);
                    }}
                />
                <CustomerDialog
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                    selectedRowData={selectedRowData}

                />
            </div>
        </CustomerProvider>
    );
}