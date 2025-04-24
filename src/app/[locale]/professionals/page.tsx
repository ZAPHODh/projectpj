'use client';

import { getColumns } from "@/components/professionals/column";
import { ProfessionalDialog } from "@/components/professionals/dialog";
import { useComissionRule } from "@/components/providers/comission-rule";
import { DataTable } from "@/components/ui/data-table/table";
import { createProfessionalSchema, defaultProfessionalValues, GetProfessionalConfig } from "@/schemas/professional";
import { useLocale, useMessages } from "next-intl";
import { useState } from "react";

const professionalMock: Professional = {
    id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p",
    name: "Ana Silva",
    category: "Cabeleireira",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "ana.silva@exemplo.com",
    salonId: "b2c3d4e5-f6g7-8h9i-j0k1-l2m3n4o5p6",
    services: [
    ],
    commissions: [
    ],
    appointments: [
    ],
    userRoles: [
    ],
    transactions: [
    ],
    comissionRuleId: "cr1",
};

export default function Page() {
    const { comissionRules } = useComissionRule()
    const [selectedRowData, setSelectedRowData] = useState<Professional | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const locale = useLocale()
    const messages = useMessages();
    function onNewItem(professional: Professional) {

    }
    return (
        <div className="space-y-6 container mx-auto">
            <div className="p-4">
                <h3 className="text-lg font-medium">Professionals</h3>
                <p className="text-sm text-muted-foreground">
                    create and adjust your professionals, their services and their prices.
                </p>
            </div>
            <DataTable data={[professionalMock]} columns={getColumns(locale, messages)} exportTo newItem={{
                defaultValues: defaultProfessionalValues,
                fieldConfig: GetProfessionalConfig(comissionRules, 'type', locale, messages),
                schema: createProfessionalSchema
            }}
                onNewItem={onNewItem}
                handleRowClick={(row) => {
                    setSelectedRowData(row);
                    setIsDialogOpen(true);
                }} />
            <ProfessionalDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} selectedRowData={selectedRowData} />
        </div>
    )
}