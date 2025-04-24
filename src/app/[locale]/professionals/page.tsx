'use client';

import { getColumns } from "@/components/professionals/column";
import { ProfessionalDialog } from "@/components/professionals/dialog";
import { useProfessional } from "@/components/providers/professional";

import { DataTable } from "@/components/ui/data-table/table";
import { createProfessionalSchema, defaultProfessionalValues, GetProfessionalConfig } from "@/schemas/professional";
import { useLocale, useMessages } from "next-intl";
import { useState } from "react";



export default function Page() {
    const { commissionRules, professionals, updateProfessional } = useProfessional()
    const [selectedRowData, setSelectedRowData] = useState<Professional | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const locale = useLocale()
    const messages = useMessages();
    return (
        <div className="space-y-6 container mx-auto">
            <div className="p-4">
                <h3 className="text-lg font-medium">Professionals</h3>
                <p className="text-sm text-muted-foreground">
                    create and adjust your professionals, their services and their prices.
                </p>
            </div>
            <DataTable
                data={professionals}
                columns={getColumns(locale, messages)}
                exportTo newItem={{
                    defaultValues: defaultProfessionalValues,
                    fieldConfig: GetProfessionalConfig(commissionRules, 'type', locale, messages),
                    schema: createProfessionalSchema
                }}
                onNewItem={updateProfessional}
                handleRowClick={(row) => {
                    setSelectedRowData(row);
                    setIsDialogOpen(true);
                }} />
            <ProfessionalDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} selectedRowData={selectedRowData} />
        </div>
    )
}