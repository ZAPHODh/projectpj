'use client';

import { DisplayAdUnit, InArticleAd } from "@/components/ad-unit";
import { getCustomerColumns } from "@/components/customers/column";
import { CustomerDialog } from "@/components/customers/dialog";
import { CustomerProvider, useCustomer } from "@/components/providers/customer";
import { useSession } from "@/components/providers/session";
import { DataTable } from "@/components/ui/data-table/table";
import { createCustomerSchema, defaultCustomerValues, GetCustomerConfig } from "@/schemas/customers";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function CustomerPage() {
    const [selectedRowData, setSelectedRowData] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const locale = useLocale();
    const messages = useMessages();
    const t = useTranslations('customer.page');
    const { customers, createCustomer } = useCustomer()
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
                    data={customers}
                    columns={getCustomerColumns(locale, messages)}
                    exportTo
                    newItem={{
                        defaultValues: defaultCustomerValues,
                        fieldConfig: GetCustomerConfig(locale, messages),
                        schema: createCustomerSchema,
                    }}
                    onNewItem={createCustomer}
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